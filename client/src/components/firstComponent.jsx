import React, { useState, useEffect } from 'react'
import socketIOClient from 'socket.io-client'
import styled from 'styled-components'
import PlayerDataTable from './PlayerDataTable'
import Market from './Market'

const testCSS = styled.div``

const socket = socketIOClient('http://192.168.1.82:8080')

function FirstComponent() {
  const [number, setNumber] = useState(-1)
  const [players, updatePlayers] = useState([])
  const [market, updateMarket] = useState([])

  useEffect(() => {
    if (number === -1) {
      socket.emit('READY')
      socket.on(
        'JOINED',
        data => {
          setNumber(data.playerNum)
        },
        [number]
      )
      socket.on('PLAYER_UPDATE', data => {
        updatePlayers(data.players)
      })
      socket.on('INIT_GAME_STATE', data => {
        updateMarket(data.market)
        updatePlayers(data.players)
      })
    }
  })

  const handleStart = () => {
    socket.emit('START')
  }
  console.log(number)
  return (
    <div>
      {' '}
      {number} <button onClick={() => handleStart()}>start</button>
      <PlayerDataTable players={players} />
      <Market marketData={market} socket={socket} />
    </div>
  )
}

export default FirstComponent
