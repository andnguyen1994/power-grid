import React from 'react'
import styled from 'styled-components'
import socketIOClient from 'socket.io-client'
import PowerplantCard from './PowerplantCard'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

const PowerplantMarketContainer = styled(List)`
  height: 38%;
`

const CardContainer = styled.div`
  height: ${props => 100 / props.length}%;
`

const ListItemContainer = styled(ListItem)`
  height: 100%;
`

function Market({ marketData, socket }) {
  const handleAuction = (index, e) => {
    console.log('index', index)
    console.log('market', marketData)
    socket.emit('AUCTION_BID', { bid: marketData[index].number, card: index })
  }
  //need to center, add condition for phase 3
  return (
    <PowerplantMarketContainer>
      {marketData.map((p, index, arr) => {
        let x = index === parseInt(arr.length / 2)
        return (
          <CardContainer length={arr.length}>
            {x && <Divider />}
            <ListItemContainer
              button
              onClick={function(event) {
                event.preventDefault()
                handleAuction(index)
              }}
            >
              <PowerplantCard powerplant={p} />
            </ListItemContainer>
          </CardContainer>
        )
      })}
    </PowerplantMarketContainer>
  )
}

export default Market
