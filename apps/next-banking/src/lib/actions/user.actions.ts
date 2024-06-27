'use server';

import { cookies } from 'next/headers';
import { ID } from 'node-appwrite';
import { createAdminClient, createSessionClient } from '../appwrite/appwrite';
import { nextBankAppwriteEnvVars } from '../appwrite/helpers';

export const getLoggedInUser = async () => {
  try {
    const { account } = await createSessionClient(
      nextBankAppwriteEnvVars.endpoint,
      nextBankAppwriteEnvVars.projectId,
      nextBankAppwriteEnvVars.sessionKey
    );
    return await account.get();
  } catch (error) {
    return undefined;
  }
};

export const signIn = async ({ email, password }: signInProps) => {
  const { account } = await createAdminClient(
    nextBankAppwriteEnvVars.endpoint,
    nextBankAppwriteEnvVars.projectId,
    nextBankAppwriteEnvVars.secret
  );

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
  const { account } = await createAdminClient(
    nextBankAppwriteEnvVars.endpoint,
    nextBankAppwriteEnvVars.projectId,
    nextBankAppwriteEnvVars.secret
  );

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
  const { account } = await createSessionClient(
    nextBankAppwriteEnvVars.endpoint,
    nextBankAppwriteEnvVars.projectId,
    nextBankAppwriteEnvVars.sessionKey
  );

  cookies().delete(nextBankAppwriteEnvVars.sessionKey);
  await account.deleteSession('current');
}
