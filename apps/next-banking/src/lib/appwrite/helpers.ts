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

interface IAppwriteDatabaseCollection<TCollectionNames extends string> {
  id: string;
  name: TCollectionNames;
}

interface IAppwriteDatabaseEnvVars<TCollectionNames extends string> {
  readonly id: string;
  readonly collections: Map<
    TCollectionNames,
    IAppwriteDatabaseCollection<TCollectionNames>
  >;
}

const createAppwriteCollections = <TCollectionNames extends string>(
  collectionNames: TCollectionNames[]
): Map<TCollectionNames, IAppwriteDatabaseCollection<TCollectionNames>> =>
  new Map(
    collectionNames.map((name) => [
      name,
      {
        id: getEnvironmentVariable(
          `APPWRITE_${String(name).toUpperCase()}_COLLECTION_ID`
        ),
        name,
      },
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
