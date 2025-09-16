import { gql } from "@apollo/client";

export const USER_QUERY = gql`
  query userData($id: ID!) {
    user(id: $id) {
      email
      firstName
      lastName
    }
  }
`;
