import React, { useState, useEffect } from 'react'
import { useMutation, useApolloClient, useQuery } from '@apollo/react-hooks'
import { Link, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SIGN_IN, SIGN_UP } from '../mutations'
import { AM_I_AUTH } from '../queries'
import Spinner from './spinner'
import { AUTH_TOKEN } from '../constants'

export default function Login (props) {
  const { mod } = props
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [username, setUsername] = useState('')
  const client = useApolloClient()
  const { t } = useTranslation()

  const errorMessage = graphQLError => {
    if (graphQLError === 'GraphQL error: Invalid email') {
      setError(t('emailError'))
    } else if (graphQLError === 'GraphQL error: Invalid password') {
      setError(t('passwordError'))
    } else if (graphQLError === 'GraphQL error: provide a valid email address') {
      setError(t('emailError'))
    }
  }

  const [signIn, { loading: signInLoading }] = useMutation(SIGN_IN, {
    onCompleted: async ({ signIn: { token } }) => {
      localStorage.setItem(AUTH_TOKEN, token)
      await client.clearStore()
      history.push('/')
    },
    onError: e => errorMessage(e.message),
    variables: {
      email,
      password
    }
  })
  const [signUp, { loading: signUpLoading }] = useMutation(SIGN_UP, {
    onCompleted: async ({ signUp: { token } }) => {
      localStorage.setItem(AUTH_TOKEN, token)
      await client.clearStore()
      history.push('/')
    },
    onError: e => errorMessage(e.message),
    variables: {
      email,
      username,
      password
    }
  })
  const { loading: authLoading, error: authError, data } = useQuery(AM_I_AUTH)

  useEffect(() => {
    if (!authLoading && data && data.amIAuth.isAuth) {
      history.push('/')
    }
  })

  if (authLoading) {
    return <Spinner />
  }
  if (authError) {
    console.log(authError)
    return <div>auth error</div>
  }

  const isFormValid = () => {
    if (mod === 'register') {
      return email !== '' && password !== '' && username !== ''
    }
    return email !== '' && password !== ''
  }

  const handleSubmit = async () => {
    if (mod === 'register') {
      await signUp()
    } else {
      await signIn()
    }
  }

  return (
    <div className='flex flex-column justify-center items-center h-100 w-100 pa3'>
      {
        error && <div className='athelas mb2 gray'>{ error }</div>
      }
      {
        mod === 'register' && (
          <input
            className='ba b--white-80 mb2 gray athelas pa3 w-30-ns w-60-m w-100 border-box'
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder={t('username')}
          />
        )
      }
      <input
        className='ba b--white-80 mb2 gray athelas pa3 w-30-ns w-60-m w-100 border-box'
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder='email'
      />
      <input
        className='ba b--white-80 mb2 gray athelas pa3 w-30-ns w-60-m w-100 border-box'
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder={t('password')}
        type='password'
      />
      <div>
        {
          mod === 'register' ? (
            <Link to='/signIn' className='sans-serif f6 i mr3 mb3 lh-copy dim moon-gray pointer'>
              {t('loginLink')}
            </Link>
          ) : (
            <Link to='/signUp' className='sans-serif f6 i mr3 mb3 lh-copy dim moon-gray pointer'>
              {t('registerLink')}
            </Link>
          )
        }
        <button
          className={`sans-serif f6 ba pa3 b--white-80 bg-transparent mr2 gray ${isFormValid() && 'grow'}`}
          onClick={handleSubmit}
          disabled={!isFormValid() || signInLoading || signUpLoading}
          type='button'
        >
          ok
        </button>
      </div>
    </div>
  )
}
