import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { useHistory, useParams } from 'react-router-dom'
import moment from 'moment'
import { AM_I_AUTH, TALK } from '../queries'
import Spinner from './spinner'
import { CREATE_POST } from '../mutations'
import { OPTIMISTIC_ID } from '../constants'
import useIo from '../hooks/useIo'
import PostList from './postList'

export default function Talk () {
  const [text, setText] = useState('')

  const { id: talkId } = useParams()
  const io = useIo()

  const { loading: authLoading, error: authError, data: authData } = useQuery(AM_I_AUTH)
  const {
    loading: talkLoading,
    error: talkError,
    data,
    refetch
  } = useQuery(TALK, {
    variables: { id: talkId }
  })

  const [createPost, { loading: createPostLdg }] = useMutation(CREATE_POST, {
    onError: e => console.log(e.message)
  })

  const history = useHistory()
  useEffect(() => {
    if (!authLoading && !authData.amIAuth.isAuth) {
      history.push('/signIn')
    }
  })

  useEffect(() => {
    io.on('post_created', payload => {
      if (payload.talkId === talkId) {
        refetch()
      }
    })
    return () => io.off('post_created')
  }, [io, refetch, talkId])

  const onCreatePost = () => {
    if (!text || createPostLdg) {
      return
    }
    createPost({
      variables: { text, talkId },
      optimisticResponse: {
        __typename: 'Mutation',
        createPost: {
          __typename: 'Post',
          id: OPTIMISTIC_ID,
          text,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          author: {
            __typename: 'User',
            id: authData.amIAuth.me.id,
            username: authData.amIAuth.me.username
          }
        }
      },
      update: (cache, { data: { createPost: result } }) => {
        try {
          const { talk } = cache.readQuery({ query: TALK, variables: { id: talkId } })
          talk.posts.push(result)
          cache.writeQuery({ query: TALK, data: { talk }, variables: { id: talkId } })
        } catch (e) {
          console.log('cache update fail after post creation')
        }
        setText('')
      }
    })
  }

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

  return (
    <div>
      <div className='mb3'>
        <div className='f3 lh-copy db moon-gray sans-serif tracked'>
          {data.talk.name.toUpperCase()}
        </div>
        <div className='f5 lh-copy mv1'>
          { data.talk.description }
        </div>
        <div className='f6 lh-copy sans-serif i'>
          {`${data.talk.posts.length} post${data.talk.posts.length > 1 ? 's' : ''}, ${moment(data.talk.createdAt).fromNow()}`}
        </div>
      </div>
      <div className='bt b--white-80 mv3' />
      <div className='flex flex-column'>
        <PostList posts={data.talk.posts} userId={authData.amIAuth.me.id} />
        <div className='flex flex-column self-center'>
          <textarea
            className='ba bg-near-black f6 b--white-80 mb2 gray athelas pa3 border-box measure'
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder='Aa'
            rows={4}
            cols={100}
          />
          <div className='self-end'>
            <button
              type='button'
              className={`sans-serif f6 ba pa3 b--white-80 bg-transparent gray ${text && 'grow'}`}
              onClick={onCreatePost}
              disabled={!text}
            >
              ok
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
