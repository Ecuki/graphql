import React from 'react'
import { Table } from 'semantic-ui-react'
export default function BooksTable({ books }) {
    return (
        <Table celled compact>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Title</Table.HeaderCell>
                    <Table.HeaderCell>Author</Table.HeaderCell>
                    <Table.HeaderCell>Publised</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {books.map(({ title, author, published, id }) => (
                    <Table.Row key={id}>
                        <Table.Cell>{author.name}</Table.Cell>
                        <Table.Cell>{title}</Table.Cell>
                        <Table.Cell>{published}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
}
