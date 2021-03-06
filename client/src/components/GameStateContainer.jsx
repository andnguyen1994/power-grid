import React, { useState, useEffect } from 'react'
import socketIOClient from 'socket.io-client'
import styled from 'styled-components'
import PlayerDataTable from './PlayerDataTable'
import StartButton from './StartButton'
import Market from './Market'
import ResourceMarket from './ResourceMarket'
import Auction from './Auction'
import { Coal, Oil } from './Icons'

const socket = socketIOClient('http://localhost:8080')

const ContainerStyle = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 85% 15%;
  grid-template-columns: 80% 20%;
  grid-template-areas:
    'board market'
    'hand market';
  justify-items: stretch;
`

const MainBoardContainer = styled.div`
  height: 100%;
  width: 100%;
  grid-area: board;
`

const PlayerAreaContainer = styled.div`
  grid-area: hand;
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-areas: 'handarea auction';
`

const MarketAreaContainer = styled.div`
  grid-area: market;
`

const GameStateContainer = () => {
  const [gameState, setGameState] = useState({
    step: 0,
    phase: 'LOBBY',
    turn: 0,
  })
  const [number, setNumber] = useState(-1)
  const [players, updatePlayers] = useState([])
  const [market, updateMarket] = useState([])
  const [resources, updateResources] = useState([
    { market: 0, count: 0 },
    { market: 0, count: 0 },
    { market: 0, count: 0 },
    { market: 0, count: 0 },
  ])
  const [auction, updateAuction] = useState({
    active: false,
    curPlayer: '',
    curBid: 0,
    card: {},
    turnOrder: [0, 1, 2, 3],
  })

  useEffect(() => {
    if (number === -1) {
      socket.emit('READY')
      socket.on(
        'JOINED',
        (data) => {
          setNumber(data.playerNum)
        },
        [number]
      )
      socket.on('PLAYER_UPDATE', (data) => {
        updatePlayers(data.players)
      })
      socket.on('GAME_STATE_UPDATE', (data) => {
        updateMarket(data.market)
        updatePlayers(data.players)
        updateResources(data.resources)
        setGameState(data.gameState)
      })
      socket.on('AUCTION_UPDATE', (data) => {
        //console.log('auction update', data)
        updateAuction(data)
      })
    }
  })

  return (
    <ContainerStyle>
      <MainBoardContainer>
        <PlayerDataTable players={players} />
      </MainBoardContainer>
      <PlayerAreaContainer>
        {gameState.phase === 'LOBBY' && <StartButton socket={socket} />}
        {gameState.phase === 'AUCTION' && (
          <Auction
            active={auction.active}
            socket={socket}
            curPlayer={auction.curPlayer}
            curBid={auction.curBid}
            card={auction.card}
            turnOrder={auction.turnOrder}
            players={players}
          />
        )}
      </PlayerAreaContainer>
      <MarketAreaContainer>
        <Market marketData={market} socket={socket} />
        <ResourceMarket resources={resources} />
      </MarketAreaContainer>
    </ContainerStyle>
  )
}

export default GameStateContainer
