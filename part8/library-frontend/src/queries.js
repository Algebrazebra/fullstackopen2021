import { gql } from "@apollo/client";

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      author
      id
      genres
    }
  }
`;

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      id
      bookCount
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation create_book(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      published
      author
      id
      genres
    }
  }
`;

export const CHANGE_BIRTHYEAR = gql`
  mutation change_birthyear($author: String!, $born: Int!) {
    editAuthor(name: $author, setBornTo: $born) {
      name
      id
      born
      bookCount
    }
  }
`;
