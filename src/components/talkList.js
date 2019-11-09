import React, { useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import moment from 'moment'
import { Link } from 'react-router-dom'
import Spinner from './spinner'
import { TALKS } from '../queries'
import useIo from '../hooks/useIo'

const TalkList = () => {
  const {
    loading,
    error,
    data,
    refetch
  } = useQuery(TALKS)
  const io = useIo()

  useEffect(() => {
    io.on('post_created', () => {
      refetch()
    })
    io.on('talk_created', () => {
      refetch()
    })
    return () => {
      io.off('post_created')
      io.off('talk_created')
    }
  }, [io, refetch])

  if (loading) {
    return <Spinner />
  }
  if (error) {
    console.log(error)
    return <div>error</div>
  }

  return (
    <div>
      {
        data.talks.map(talk => (
          <Link
            className='link dim db moon-gray pointer'
            to={`/talk/${talk.id}`}
            key={talk.id}
          >
            {`${talk.name} ${talk.posts.length} ${moment(talk.createdAt).fromNow()}`}
          </Link>
        ))
      }
    </div>
  )
}

export default TalkList
