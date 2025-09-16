import { gql } from "@apollo/client";

export const USER_LOGIN = gql`
  mutation userLogin($email: String!, $password: String!) {
    login(input: { identifier: $email, password: $password }) {
      jwt
    }
  }
`;
