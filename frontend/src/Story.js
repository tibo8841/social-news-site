import React from 'react'
import './Story.css'

function Story(props) {
  function handleVote(direction) {
    props.postVote(direction, props.id)
  }

  function handleDelete() {
    props.deleteStory(props.id)
  }

  const { title, score, url } = props.story

  return (
    <li>
      <button
        className="upvote"
        onClick={() => {
          handleVote('up')
        }}
      >
        ⬆
      </button>
      <button
        className="downvote"
        onClick={() => {
          handleVote('down')
        }}
      >
        ⬇
      </button>
      <a className="title" href={url} target="_blank" rel="noreferrer">
        {title}
      </a>{' '}
      ({score} point{score !== 1 ? 's' : ''}){' '}
      <button className="delete" onClick={handleDelete}>
        ❌
      </button>
    </li>
  )
}

export default Story
