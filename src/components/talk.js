import React, { useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Link, useHistory, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { AM_I_AUTH, TALK } from '../queries'
import Spinner from './spinner'
import { JOIN_TALK, LEAVE_TALK } from '../mutations'

export default function Talk () {
  const { id } = useParams()
  const { t } = useTranslation()

  const { loading: authLoading, error: authError, data: authData } = useQuery(AM_I_AUTH)
  const { loading: talkLoading, error: talkError, data } = useQuery(TALK, {
    variables: { id }
  })

  const [leaveTalk] = useMutation(LEAVE_TALK)
  const [joinTalk] = useMutation(JOIN_TALK, { variables: { id } })

  const history = useHistory()
  useEffect(() => {
    if (!authLoading && !authData.amIAuth.isAuth) {
      history.push('/signIn')
    }
  })

  useEffect(() => {
    joinTalk({ variables: id })
    return () => leaveTalk()
  }, [joinTalk, leaveTalk, id])

  if (authLoading || talkLoading) {
    return <Spinner />
  }
  if (authError) {
    console.log(authError)
    return <div>auth error</div>
  }
  if (talkError) {
    console.log(talkError)
    return <div>talk error</div>
  }
  console.log(data)
  return (
    <div>
      <div>
        { data.talk.name }
      </div>
      <div>
        { data.talk.description }
      </div>
      <div>
        { `${t('started')} ${moment(data.talk.createdAt).fromNow()}` }
      </div>
    </div>
  )
}
