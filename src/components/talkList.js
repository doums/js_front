import React, { useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import moment from 'moment'
import Spinner from './spinner'
import { TALKS } from '../queries'

const TalkList = () => {
  const { loading, error, data } = useQuery(TALKS)

  if (loading) {
    return <Spinner />
  }
  if (error) {
    console.log(error)
    return <div>error</div>
  }

  const joinTalk = id => {

  }

  return (
    <div>
      {
        data.talks.map(talk => (
          <div
            key={talk.id}
            onClick={() => joinTalk(talk.id)}
          >
            {talk.name}
            {talk.activeUsers.length}
            {moment(talk.createdAt).fromNow()}
          </div>
        ))
      }
    </div>
  )
}

export default TalkList
