import React from 'react'
import styled from 'styled-components'
import socketIOClient from 'socket.io-client'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

//const StyledButton = styled.Button``

const StartButton = ({ socket }) => {
  const handleSubmit = e => {
    e.preventDefault()
    socket.emit('START')
  }

  return (
    <Button variant="contained" color="primary" onClick={handleSubmit}>
      Start
    </Button>
  )
}

export default StartButton
