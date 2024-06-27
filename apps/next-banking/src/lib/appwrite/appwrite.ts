'use server';

import { cookies } from 'next/headers';
import { Account, Client, Databases, Users } from 'node-appwrite';

export async function createSessionClient(
  endpoint: string,
  projectId: string,
  sessionKey: string
) {
  const client = new Client().setEndpoint(endpoint).setProject(projectId);

  const session = cookies().get(sessionKey);
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

export async function createAdminClient(
  endpoint: string,
  projectId: string,
  key: string
) {
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(key);

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
