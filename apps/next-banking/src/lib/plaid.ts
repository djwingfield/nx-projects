import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const plaidConfiguration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
    'PLAID-SECRET': process.env.PLAID_SECRE,
  },
});

export const plaidClient = new PlaidApi(plaidConfiguration);
