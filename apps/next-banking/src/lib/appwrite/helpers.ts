export function getEnvironmentVariable(varName: string): string {
  const value = process.env[varName];

  if (!value) {
    throw new Error(`Environment variable ${varName} does not exist.`);
  }

  return value;
}

interface IAppwriteEnvVars<TCollectionNames extends string> {
  readonly sessionKey: string;
  readonly endpoint: string;
  readonly projectId: string;
  readonly secret: string;
  readonly database: IAppwriteDatabaseEnvVars<TCollectionNames>;
}

interface IAppwriteDatabaseEnvVars<TCollectionNames extends string> {
  readonly id: string;
  readonly collections: Map<TCollectionNames, string>;
}

const createAppwriteCollections = <TCollectionNames extends string>(
  collectionNames: TCollectionNames[]
): Map<TCollectionNames, string> =>
  new Map(
    collectionNames.map((name) => [
      name,
      getEnvironmentVariable(
        `APPWRITE_${String(name).toUpperCase()}_COLLECTION_ID`
      ),
    ])
  );

const createAppwriteVars = <TCollectionNames extends string>(
  collectionNames: TCollectionNames[]
): IAppwriteEnvVars<TCollectionNames> => ({
  sessionKey: getEnvironmentVariable('APPWRITE_SESSION_KEY'),
  endpoint: getEnvironmentVariable('APPWRITE_ENDPOINT'),
  projectId: getEnvironmentVariable('APPWRITE_PROJECT_ID'),
  secret: getEnvironmentVariable('APPWRITE_SECRET'),
  database: {
    id: getEnvironmentVariable('APPWRITE_DATABASE_ID'),
    collections: createAppwriteCollections(collectionNames),
  },
});

export type NextBankingCollections = 'banks' | 'users' | 'transactions';

export const nextBankAppwriteEnvVars =
  createAppwriteVars<NextBankingCollections>([
    'banks',
    'users',
    'transactions',
  ]);
