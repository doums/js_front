import React, { useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import { AM_I_AUTH } from '../queries'
import Spinner from './spinner'

const Home = () => {
  const { loading: authLoading, error: authError, data } = useQuery(AM_I_AUTH)
  const history = useHistory()
  useEffect(() => {
    if (!authLoading && !data.amIAuth.isAuth) {
      history.push('/signIn')
    }
  })

  if (authLoading) {
    return <Spinner />
  }
  if (authError) {
    console.log(authError)
    return <div>auth error</div>
  }

  return <div>CoolChat</div>
}

export default Home
