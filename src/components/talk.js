import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { useHistory, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { AM_I_AUTH, TALK } from '../queries'
import Spinner from './spinner'
import { CREATE_POST } from '../mutations'
import { OPTIMISTIC_ID } from '../constants'
import useIo from '../hooks/useIo'

export default function Talk () {
  const [text, setText] = useState('')

  const { id: talkId } = useParams()
  const { t } = useTranslation()
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
      <div>
        { data.talk.name }
      </div>
      <div>
        { data.talk.description }
      </div>
      <div>
        { `${t('started')} ${moment(data.talk.createdAt).fromNow()}` }
      </div>
      {
        data.talk.posts.map(post => (
          <div key={post.id}>
            {post.text}
          </div>
        ))
      }
      <div>
        <input
          className='ba b--white-80 mb2 gray athelas pa3 w-40-ns w-60-m w-100 border-box measure'
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder='Aa'
        />
        <button
          type='button'
          className={`sans-serif f6 ba pa3 b--white-80 bg-transparent mr2 gray ${text && 'grow'}`}
          onClick={onCreatePost}
          disabled={!text}
        >
          ok
        </button>
      </div>
    </div>
  )
}
