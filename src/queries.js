import gql from 'graphql-tag'

export const AM_I_AUTH = gql`
    query {
        amIAuth {
            isAuth
            me {
                id
                username
                email
                bio
            }
        }
    }
`

export const TALKS = gql`
    query {
        talks {
            id
            name
            createdAt
            activeUsers {
                id
            }
        }
    }
`

export const TALK = gql`
    query Talk($id: ID!){
        talk(id: $id) {
            id
            name
            description
            createdAt
            updatedAt
            posts {
                id
                text
                createdAt
                updatedAt
                author {
                    username
                }
            }
            activeUsers {
                id
            }
        }
    }
`
