import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'

export default function PostList ({ posts, userId }) {
  return (
    <div className='flex flex-column chat overflow-auto w-100 mw7-l mw8-m'>
      {
        posts.map(post => (
          <div
            key={post.id}
            className={`${post.author.id === userId ? 'self-end justify-end tr' : ''} flex flex-column mb3`}
          >
            {
              post.author.id !== userId && (
                <div className='sans-serif b'>
                  {post.author.username}
                </div>
              )
            }
            <div className='lh-copy measure'>
              {post.text}
            </div>
            <div className='f6 lh-copy sans-serif i mid-gray '>
              { moment(post.createdAt).fromNow() }
            </div>
          </div>
        ))
      }
    </div>
  )
}

PostList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  posts: PropTypes.array.isRequired,
  userId: PropTypes.string.isRequired
}
