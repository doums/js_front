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
            posts {
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
                author {
                    id
                    username
                }
                createdAt
                updatedAt
            }
        }
    }
`

export const POSTS_BY_TALK = gql`
    query PostByTalk($talkId: ID!){
        postsByTalk(talkId: $talkId) {
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
