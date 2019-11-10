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
          <div key={talk.id} className='mb3'>
            <Link
              className='link db moon-gray'
              to={`/talk/${talk.id}`}
            >
              <span className='f3 lh-copy dim pointer'>
                {talk.name}
              </span>
            </Link>
            <div className='f6 lh-copy sans-serif i'>
              {`${talk.posts.length} post${talk.posts.length > 1 ? 's' : ''}, ${moment(talk.createdAt).fromNow()}`}
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default TalkList
