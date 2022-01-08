import { gql } from "apollo-server-express";

const userSchema = gql`
  type User {
    id: ID!
    nickname: String!
  }

  extend type Query {
    users: [User!]! # getMessages
    user(id: ID!): User! # getMessage
  }
`;

export default userSchema;
