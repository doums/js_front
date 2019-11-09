import gql from 'graphql-tag'

export const SIGN_IN = gql`
    mutation SignIn($email: String!, $password: String!) {
        signIn(email: $email, password: $password) {
            token
        }
    }
`

export const SIGN_UP = gql`
    mutation signUp($email: String!, $username: String!, $password: String!) {
        signUp(email: $email, username: $username, password: $password) {
            token
        }
    }
`

export const CREATE_POST = gql`
    mutation CreatePost($text: String!, $talkId: ID!) {
        createPost(text: $text, talkId: $talkId) {
            id
            text
            author {
                id
                username
            }
            createdAt
            updatedAt
        }
    }
`

export const DELETE_POST = gql`
    mutation DeletePost($id: ID!) {
        deletePost(id: $id) {
            id
        }
    }
`

export const CREATE_TALK = gql`
    mutation CreateTalk($name: String!, $description: String!) {
        createTalk(name: $name, description: $description) {
            id
            name
            description
            createdAt
            updatedAt
            posts {
                id
            }
        }
    }
`
