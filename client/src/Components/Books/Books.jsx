import React, { useState } from 'react';


import { Header } from 'semantic-ui-react'
import Genres from './Genres'
import MyLoader from '../MyLoader'
import BooksTable from './BooksTable'

export default function Books({ books, activeGenre, setActiveGenre }) {

  const { loading, data } = books



  if (loading) return <MyLoader />
  if (!data.allBooks) return <div>No data to diplay</div>

  return (
    <>
      <Header as="h3" content={`Books: ${data.allBooks.length}`} />
      <BooksTable books={data.allBooks} />
      <Genres activeGenre={activeGenre} setActiveGenre={setActiveGenre} />
    </>
  );
}
