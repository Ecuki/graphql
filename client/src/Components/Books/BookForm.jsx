import React, { useState } from 'react';
import useField from '../../hooks/useField';
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../../query';
import { Button, Form, Header } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';

export default function BookForm({ setError, setDisplay }) {
  const [title, setTitle] = useField('text');
  const [author, setAuthor] = useField('text');
  const [published, setPublished] = useField('number');
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useField('text');
  const [createBook] = useMutation(ADD_BOOK, {
    onError: (err) => {
      setError(err.graphQLErrors[0].message)
    },
    update: (store, { data }) => {
      const booksInStore = store.readQuery({ query: ALL_BOOKS, variables: { genre: "" } })
      store.writeQuery({
        query: ALL_BOOKS,
        variables: { genre: "", author: "" },
        data: {
          ...booksInStore,
          allBooks: [...booksInStore.allBooks, data.addBook],
        }
      })
    },
    refetchQueries: [{ query: ALL_AUTHORS }]
  });
  const addGenres = () => {
    if (!setGenre.isEmpty()) {
      setGenres(genres.concat(genre.value));
      setGenre.clear();
    }
  };
  const addBook = async (e) => {
    e.preventDefault();
    if (
      !setTitle.isEmpty() &&
      !setAuthor.isEmpty() &&
      !setPublished.isEmpty()
    ) {
      await createBook({
        variables: {
          title: title.value,
          author: author.value,
          published: Number(published.value),
          genres,
        },

      });
      setTitle.clear();
      setAuthor.clear();
      setPublished.clear();
      setGenres([]);
      setDisplay('books')
    }
  };
  return (
    <Form>
      <Header> Add new book</Header>
      <Form.Field>
        <label>Title</label>
        <input placeholder="Title" {...title} />
      </Form.Field>
      <Form.Field>
        <label>Author</label>
        <input placeholder="Author" {...author} />
      </Form.Field>
      <Form.Field>
        <label>Published</label>
        <input placeholder="Published" {...published} />
      </Form.Field>
      <Form.Field>
        <label>Genre</label>
        <input placeholder="Author" {...genre} />
        <Button onClick={addGenres}>Add genre</Button>
      </Form.Field>
      <Form.Field>
        <label>Genres</label>
        {genres.map((genre) => ` ${genre}`)}
      </Form.Field>
      <Button onClick={addBook}>Submit</Button>
    </Form>
  );
}
