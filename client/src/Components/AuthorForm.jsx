import React, { useState } from 'react';
import useField from '../hooks/useField';
import { UPDATE_AUTHOR, ALL_AUTHORS, ALL_BOOKS } from '../query';
import { Button, Form, Header } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';

export default function BookForm({ authors, setError }) {

  const [name, setName] = useState(null);
  const [born, setBorn] = useField('number');

  const [updateAuthor] = useMutation(UPDATE_AUTHOR,
    {

      onError: (err) => {
        setError(err.graphQLErrors[0].message)
      },
      update: (store, response) => {
        const dataInStore = store.readQuery({ query: ALL_BOOKS, variables: { genre: "" }, })
        store.writeQuery({
          query: ALL_BOOKS,
          variables: { genre: "", author: "" },
          data: {
            ...dataInStore,
            allBooks: [...dataInStore.allBooks, response.data.addBook]
          }
        })
      }
    });

  const editAuthor = (e) => {
    e.preventDefault();
    if (name) {
      updateAuthor({
        variables: {
          name,
          born: Number(born.value),
        }
      });
      setBorn.clear();
    }


  };

  const handleChange = (e) => {
    setName(e.target.value);

  }
  return (
    <Form>
      <Header> Set birthyear</Header>
      <Form.Field>
        <label>
          Pick author:
          <select value={name} onChange={handleChange}>
            {authors.map(author => <option key={author.id} value={author.name}>{author.name}</option>)}
          </select>
        </label>
      </Form.Field>
      <Form.Field>
        <label>Born</label>
        <input placeholder="Year" {...born} />
      </Form.Field>

      <Button onClick={editAuthor}>Submit</Button>
    </Form>
  );
}
