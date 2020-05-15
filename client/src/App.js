import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useApolloClient, useSubscription, useQuery } from '@apollo/client';
import { Container, Header, Button, Message } from 'semantic-ui-react'
import Authors from './Components/Authors'
import Books from './Components/Books/Books'
import BookForm from './Components/Books/BookForm'
import LoginForm from './Components/LoginForm'
import Recommend from './Components/Recommend'
import { BOOK_ADDED, ALL_BOOKS, ALL_AUTHORS, ALL_GENRES } from './query';


function App() {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [display, setDisplay] = useState("authors");
  const [activeGenre, setActiveGenre] = useState("");
  const client = useApolloClient()

  const books = useQuery(ALL_BOOKS,
    {
      variables: { genre: activeGenre, author: "" },
      refetchQueries: [{ query: ALL_GENRES }, { query: ALL_AUTHORS }],
    });

  const updateCacheWith = async (addedBook) => {
    const includedIn = (set, object) => set.map(b => b.id).includes(object.id)
    let booksInStore = client.readQuery({
      query: ALL_BOOKS,
      variables: { genre: "", author: "" },
    })
    let authorsInStore = client.readQuery({
      query: ALL_AUTHORS,
    })
    if (!includedIn(booksInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: {
          allBooks: booksInStore.allBooks.concat(addedBook)
        },
        variables: { genre: "", author: "" }
      })
    }
    if (!includedIn(authorsInStore.allAuthors, addedBook.author)) {
      client.writeQuery({
        query: ALL_AUTHORS,
        data: {
          allAuthors: authorsInStore.allAuthors.concat(addedBook.author)
        }
      })
    }
  }

  useSubscription(BOOK_ADDED, {

    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded

      setNotification(`${addedBook.title} added`)
      updateCacheWith(addedBook)

    }
  })


  useEffect(() => {
    const token = localStorage.getItem("book-user-token")
    setToken(token)
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      error && setError(null)
      notification && setNotification(null)
    }, 5000);
    return () => clearTimeout(timer);
  }, [error, notification]);

  const handleClick = (e, result) => {
    setDisplay(result.id)
  }
  const handleLogout = (e, result) => {
    localStorage.removeItem("book-user-token")
    setToken(null)
    client.resetStore()
  }
  return <Container>    <br />
    <div>
      <Button primary id="authors" onClick={handleClick}>Authors</Button>
      <Button primary id="books" onClick={handleClick}>Books</Button>
      {token && <>
        <Button primary id="add_book" onClick={handleClick}>Add book</Button>
        <Button primary id="recommend" onClick={handleClick}>Recommendations</Button>
        <Button color="red" id="logout" onClick={handleLogout}>Logout</Button>
      </>}
      {!token && <Button color="green" id="login" onClick={handleClick}>Login</Button>}
    </div>

    <Header as='h2' content='Book App' />
    {error && <Message negative>
      <Message.Header>{error}</Message.Header>
    </Message>}
    {notification && <Message positive>
      <Message.Header>{notification}</Message.Header>
    </Message>}
    {display === "authors" && <Authors token={token} setError={setError} />}
    {display === "books" && <Books books={books} activeGenre={activeGenre} setActiveGenre={setActiveGenre} />}
    {display === "add_book" && <BookForm setError={setError} setDisplay={setDisplay} />}
    {display === "recommend" && <Recommend />}
    {display === "login" && <LoginForm setToken={setToken} setError={setError} setDisplay={setDisplay} />}

  </Container>
}

export default App;
