import React from 'react'
import { useRef } from 'react'
import './Modal.css'
const Modal = ({ type, method, closeModal }) => {
  const inputEl = useRef(null)

  function handleTextInput(e) {
    e.preventDefault()
    method(inputEl.current.value)
    closeModal()
  }

  if (type === 'text-input') {
    return (
      <div className='text-input'>
        <input type='text' ref={inputEl} placeholder='input text' required />
        <button onClick={handleTextInput} type='submit'>
          ok
        </button>
        <button onClick={() => closeModal()}>close</button>
      </div>
    )
  }

  return <div>test</div>
}

export default Modal
