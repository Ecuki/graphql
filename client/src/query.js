
import { gql } from '@apollo/client';
const BOOK_DETAIL = gql`
fragment BookDetails on Book{
  title
      published
      author{
        id
        name
        bookCount
        born
      }
      id
      genres
}
`
export const ALL_BOOKS = gql`
  query ($genre:String $author:String){
    allBooks(genre:$genre author:$author) {
      ...BookDetails
    }
  }
  ${BOOK_DETAIL}

`;


export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`;
export const ALL_GENRES = gql`
  query {
    allGenres
  }
`;
export const ME = gql`
  query {
    me{
      username
      favoriteGenre
    }
  }
`;
export const ADD_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
   ...BookDetails
    }
  }
  ${BOOK_DETAIL}
`;
export const UPDATE_AUTHOR = gql`
  mutation updateAuthor($name: String! $born: Int) {
    editAuthor(name: $name
     setBornTo: $born) {
      name
      born
      id
    }
  }
`;
export const LOGIN = gql`
mutation login($username:String! $password:String!){
  login(username:$username password:$password){
    value
  }
}
`
export const BOOK_ADDED = gql`
subscription{
  bookAdded{
    ...BookDetails
  }
}
${BOOK_DETAIL}
`