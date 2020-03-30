import React from 'react'
import styled from 'styled-components'
import socketIOClient from 'socket.io-client'
import PowerplantCard from './PowerplantCard'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

const PowerplantMarketContainer = styled(List)`
  height: 40%;
`

const CardContainer = styled.div`
  height: ${100 / 8}%;
`

function Market({ marketData, socket }) {
  const handleAuction = (index, e) => {
    console.log('index', index)
    console.log('market', marketData)
    socket.emit('AUCTION_BID', { bid: marketData[index].number, card: index })
  }
  //need to center
  return (
    <PowerplantMarketContainer>
      {marketData.map((p, index) => {
        let x = index === 4
        return (
          <CardContainer>
            {x && <Divider />}
            <ListItem
              button
              onClick={function(event) {
                event.preventDefault()
                handleAuction(index)
              }}
            >
              <PowerplantCard
                number={p.number}
                type={p.type}
                cost={p.cost}
                power={p.power}
              />
            </ListItem>
          </CardContainer>
        )
      })}
    </PowerplantMarketContainer>
  )
}

export default Market
