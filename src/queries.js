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
