import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'

class FirstComponent extends Component {
  constructor() {
    super()
    this.state = {
      response: false,
      endpoint: 'http://192.168.1.82:8000'
    }
  }

  componentDidMount() {
    const { endpoint } = this.state
    const socket = socketIOClient(endpoint)
    socket.emit('READY')
    socket.on('JOINED', data => this.setState({ response: data }))
    socket.emit('START')
  }

  render() {
    const { response } = this.state
    return <div>{response.text}</div>
  }
}

export default FirstComponent
