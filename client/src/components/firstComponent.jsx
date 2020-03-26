import React, { useState, useEffect } from 'react'
import socketIOClient from 'socket.io-client'
import styled from 'styled-components'
import PlayerDataTable from './PlayerDataTable'
import Market from './Market'
import Auction from './Auction'

const testCSS = styled.div``

const socket = socketIOClient('http://192.168.1.82:8080')

function FirstComponent() {
  const [number, setNumber] = useState(-1)
  const [players, updatePlayers] = useState([])
  const [market, updateMarket] = useState([])
  const [auction, updateAuction] = useState({ active: false })

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
      socket.on('GAME_STATE_UPDATE', data => {
        updateMarket(data.market)
        updatePlayers(data.players)
      })
      socket.on('AUCTION_UPDATE', data => {
        console.log('auction update')
        updateAuction(data)
        console.log(data)
      })
    }
  })

  const handleStart = () => {
    socket.emit('START')
  }

  //

  const handleRemove = e => {
    e.preventDefault()
    socket.emit('REMOVAL', { remove: e })
  }

  const remove = () => {
    let x = players.find(p => p.number === number + 1)
    if (x) {
      if (x.powerplants.length > 3) {
        return (
          <div>
            <button onClick={handleRemove(0)}>1</button>
            <button onClick={handleRemove(1)}>2</button>
            <button onClick={handleRemove(2)}>3</button>
          </div>
        )
      }
    }
    return
  }

  console.log(auction.active)
  return (
    <div>
      {' '}
      {number} <button onClick={() => handleStart()}>start</button>
      <PlayerDataTable players={players} />
      <Market marketData={market} socket={socket} />
      {auction.active && (
        <Auction
          socket={socket}
          curPlayer={Auction.curPalyer}
          curBid={auction.curBid}
          card={auction.card}
        />
      )}
      {remove}
    </div>
  )
}

export default FirstComponent
