import React, { useEffect } from 'react';
import useField from '../hooks/useField';
import { LOGIN, ALL_AUTHORS, ALL_BOOKS } from '../query';
import { Button, Form, Header } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';

export default function LoginForm({ setError, setToken, setDisplay }) {

    const [username, setUsername] = useField('text');
    const [password, setPassword] = useField('password');

    const [login, result] = useMutation(LOGIN, {
        refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS, variables: { genre: "" } }],
        onError: (err) => {
            setError(err.graphQLErrors[0].message)
        }
    });

    useEffect(() => {
        if (result.data) {
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('book-user-token', token)
            setUsername.clear();
            setPassword.clear();
            setDisplay("authors")
        }

    }, [result.data])

    const handleLogin = async (e) => {
        e.preventDefault();

        login({
            variables: {
                username: username.value,
                password: password.value,
            }
        });


    };


    return (
        <Form>
            <Header> Set birthyear</Header>
            <Form.Field>
                <label>Username</label>
                <input placeholder="Username" {...username} />
            </Form.Field>
            <Form.Field>
                <label>Password</label>
                <input placeholder="password" {...password} />
            </Form.Field>

            <Button onClick={handleLogin}>Submit</Button>
        </Form>
    );
}
