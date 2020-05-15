import React from 'react'
import BooksTable from './Books/BooksTable'
import MyLoader from './MyLoader'
import { ME, ALL_BOOKS } from '../query'
import { useQuery } from '@apollo/client'
import { Header } from 'semantic-ui-react';

export default function Recommend() {

    const { data: meData, loading: meLoading } = useQuery(ME)
    const { data: booksData, loading: booksLoading } = useQuery(ALL_BOOKS, {
        variables: { genre: meData ? meData.me.favoriteGenre : "" }
    })

    if (meLoading || booksLoading) return <MyLoader />
    if (!meData.me || !booksData.allBooks) return <div>No data to diplay</div>
    const { me } = meData
    const { allBooks } = booksData

    return (
        <div>
            <Header >{`Recomendation for ${me.username} in genre : ${me.favoriteGenre}`}</Header>
            <BooksTable books={allBooks} />
        </div>
    )
}
