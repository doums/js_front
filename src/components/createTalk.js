import React, { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CREATE_TALK } from '../mutations'
import { AM_I_AUTH } from '../queries'
import Spinner from './spinner'

export default function CreateTalk () {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isValid, setIsValid] = useState(false)
  const { t } = useTranslation()

  const { loading: authLoading, error: authError, data } = useQuery(AM_I_AUTH)

  const history = useHistory()
  useEffect(() => {
    if (!authLoading && !data.amIAuth.isAuth) {
      history.push('/signIn')
    }
  })

  useEffect(() => {
    if (name && description && !isValid) {
      setIsValid(true)
    }
    if ((!name || !description) && isValid) {
      setIsValid(false)
    }
  }, [name, description, isValid])

  const [createTalk, { loading }] = useMutation(CREATE_TALK, {
    onCompleted: ({ createTalk: { id } }) => history.push(`/talk/${id}`)
  })

  if (authLoading) {
    return <Spinner />
  }
  if (authError) {
    console.log(authError)
    return <div>auth error</div>
  }

  const submit = e => {
    e.preventDefault()
    if (loading || !isValid) {
      return
    }
    createTalk({
      variables: {
        name,
        description
      }
    })
  }

  const onCancel = () => {
    history.goBack()
  }

  const onNameChange = e => {
    setName(e.target.value)
  }

  const onDescriptionChange = e => {
    setDescription(e.target.value)
  }

  return (
    <div className='flex flex-column items-center h-100 mt6'>
      <input
        className='ba b--white-80 mb2 gray athelas pa3 w-40-ns w-60-m w-100 border-box measure'
        value={name}
        onChange={onNameChange}
        placeholder={t('name')}
      />
      <textarea
        className='ba bg-near-black b--white-80 mb2 gray f6 athelas pa3 w-40-ns w-60-m w-100 border-box measure'
        value={description}
        onChange={onDescriptionChange}
        placeholder='description'
        rows={4}
      />
      <div className='flex'>
        <button
          type='button'
          className='sans-serif f6 ba pa3 b--white-80 bg-transparent mr2 gray grow'
          onClick={onCancel}
        >
          {t('cancel')}
        </button>
        <button
          type='button'
          className={`sans-serif f6 ba pa3 b--white-80 bg-transparent mr2 gray ${isValid && 'grow'}`}
          onClick={submit}
          disabled={!isValid}
        >
          ok
        </button>
      </div>
    </div>
  )
}
