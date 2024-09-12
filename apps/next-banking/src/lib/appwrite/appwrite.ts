'use server';

import { cookies } from 'next/headers';
import { Account, Client, Databases, Users } from 'node-appwrite';
import { nextBankAppwriteEnvVars } from './helpers';

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(nextBankAppwriteEnvVars.endpoint)
    .setProject(nextBankAppwriteEnvVars.projectId);

  const session = cookies().get(nextBankAppwriteEnvVars.sessionKey);
  if (!session || !session.value) {
    throw new Error('No session');
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(nextBankAppwriteEnvVars.endpoint)
    .setProject(nextBankAppwriteEnvVars.projectId)
    .setKey(nextBankAppwriteEnvVars.secret);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get users() {
      return new Users(client);
    },
  };
}
