import { gql } from 'graphql-request';
import { META } from './common';

export const QUERY_USER_ERC721 = (account: string) => gql`
  query getUserTokens {
    ${META}
    owners(where: {id: "${account.toLowerCase()}"}) {
      id,
      ownedTokens(first: 1000) {
        id,
        contract {
          id
        }
      }
    }
  }
`;
