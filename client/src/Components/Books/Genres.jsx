import React from 'react'
import { useQuery } from '@apollo/client';
import { ALL_BOOKS, ALL_GENRES } from '../../query';
import { Button } from 'semantic-ui-react'
import MyLoader from '../MyLoader'
export default function Genres({ activeGenre, setActiveGenre }) {
    const { data, loading } = useQuery(ALL_GENRES, {
        refetchQueries: [{ query: ALL_BOOKS, variables: { genre: "" } }],
    }
    );
    const
        handleChangeGenre = (genre) => {
            setActiveGenre(genre)
            console.log(activeGenre);
        }
    if (loading) return <MyLoader />
    if (!data.allGenres) return <div>No data to diplay</div>
    const { allGenres: genres } = data
    return (
        <div>
            {genres.map(genre => <Button primary active={genre === activeGenre} onClick={() => handleChangeGenre(genre)} size='mini'>
                {genre}
            </Button>)}
            <Button primary active={activeGenre === ""} onClick={() => handleChangeGenre(null)} size='mini'>
                All
            </Button>
        </div>
    )
}
