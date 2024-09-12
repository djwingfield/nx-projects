'use server';

import { cookies } from 'next/headers';
import { ID } from 'node-appwrite';
import { createAdminClient, createSessionClient } from '../appwrite/appwrite';
import { nextBankAppwriteEnvVars } from '../appwrite/helpers';
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from 'plaid';
import { plaidClient } from '../plaid';
import { encryptId, parseStringify } from '../utils';
import { revalidatePath } from 'next/cache';

export const getLoggedInUser = async () => {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    return undefined;
  }
};

export const signIn = async ({ email, password }: signInProps) => {
  const { account } = await createAdminClient();

  const session = await account.createEmailPasswordSession(email, password);

  cookies().set(nextBankAppwriteEnvVars.sessionKey, session.secret, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  });

  return getLoggedInUser();
};

export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
}: SignUpParams) => {
  const { account } = await createAdminClient();

  const newAccount = await account.create(
    ID.unique(),
    email,
    password,
    `${firstName} ${lastName}`
  );

  const session = await account.createEmailPasswordSession(email, password);

  cookies().set(nextBankAppwriteEnvVars.sessionKey, session.secret, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  });

  return newAccount;
};

export async function signOut() {
  const { account } = await createSessionClient();

  cookies().delete(nextBankAppwriteEnvVars.sessionKey);
  await account.deleteSession('current');
}

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: user.firstName + ' ' + user.lastName,
      products: ['auth'] as Products[],
      language: 'en',
      country_codes: ['US'] as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(tokenParams);

    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    console.log(error);
  }
};

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  sharableId,
}: createBankAccountProps) => {
  try {
    const { databases } = await createAdminClient();

    const bankAccount = await databases.createDocument(
      nextBankAppwriteEnvVars.database.collections.get('users')?.id
    );
  } catch (error) {
    console.error(error);
  }
};

export const exchangePublicToken = async ({ publicToken, user }) => {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: 'dwolla' as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(
      request
    );
    const processorToken = processorTokenResponse.data.processor_token;

    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    if (!fundingSourceUrl) throw Error('No funding source URL');

    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      sharableId: encryptId(accountData.account_id),
    });

    revalidatePath('/');

    return parseStringify({
      publicTokenExchange: 'complete',
    });
  } catch (error) {
    console.error('An error occurred while creating account', error);
  }
};
