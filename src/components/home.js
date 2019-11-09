import React, { useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Link, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AM_I_AUTH } from '../queries'
import Spinner from './spinner'
import TalkList from './talkList'

const Home = () => {
  const { loading: authLoading, error: authError, data } = useQuery(AM_I_AUTH)
  const history = useHistory()
  const { t } = useTranslation()
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

  return (
    <div>
      CoolChat
      <Link to='/createTalk' className='dib mb1 mr3'>
        <div className='sans-serif f6 ba pa3 b--white-80 bg-transparent mr2 gray grow'>
          {t('createTalk')}
        </div>
      </Link>
      <TalkList />
    </div>
  )
}

export default Home
