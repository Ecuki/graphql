import React from 'react';
import AuthorForm from './AuthorForm';
import { useQuery } from '@apollo/client';
import { ALL_AUTHORS } from '../query';
import { Table, Header } from 'semantic-ui-react';
import MyLoader from './MyLoader';
export default function Authors({ setError, token }) {
  const { data, loading } = useQuery(ALL_AUTHORS,
    {
      onError: (err) => {
        setError(err.graphQLErrors[0].message)
      }
    });

  if (loading) return <MyLoader />
  if (!data.allAuthors) return <div>No data to diplay</div>


  const { allAuthors: authors } = data;
  return (
    <>
      <Header as="h3" content={`Authors: ${authors.length}`} />
      <Table celled compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Author</Table.HeaderCell>
            <Table.HeaderCell>Born</Table.HeaderCell>
            <Table.HeaderCell>Books</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {authors.map(({ name, born, bookCount, id }) => (
            <Table.Row key={id}>
              <Table.Cell>{name}</Table.Cell>
              <Table.Cell>{born}</Table.Cell>
              <Table.Cell>{bookCount}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {token && <AuthorForm authors={authors} setError={setError} />}
    </>
  );
}
