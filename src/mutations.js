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
            activeUsers {
                id
            }
            posts {
                id
            }
        }
    }
`

export const JOIN_TALK = gql`
    mutation JoinTalk($id: ID!) {
        joinTalk(id: $id) {
            id
            activeTalks {
                id
            }
        }
    }
`

export const LEAVE_TALK = gql`
    mutation LeaveTalk {
        leaveTalk {
            id
            activeTalks {
                id
            }
        }
    }
`
