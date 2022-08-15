import './Spinner.css'
import React from 'react'

const Spinner = ({ active, style = 'panel-spinner' }) => {
  return (
    <div className={active ? style + ' active' : style}>
      {/* <Spinner animation="border"/> */}
      loading...
    </div>
  )
}

export default Spinner
