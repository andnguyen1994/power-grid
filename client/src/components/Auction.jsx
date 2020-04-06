import React, { useState, useEffect } from 'react'
import Styled from 'styled-components'
import useInput from '../scripts/input-hook'
import socketIOClient from 'socket.io-client'
import TextField from '@material-ui/core/TextField'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import PowerplantCard from './PowerplantCard'

const StyledAuction = Styled.div`
  grid-area: auction;
  display: grid;
  grid-template-columns: 2fr 1fr;
  justify-items:stretch;
`

const StyledTable = Styled(TableContainer)`
  width: 100%;
`

const StyledBody = Styled(TableBody)`
  width:100%;
`
const SubmitArea = Styled.div`
  display:grid;
  grid-template-rows: 1fr 2fr;
`

const StyledCard = Styled.div`
  background-color: red;
`

const Form = Styled.div`

`

function Auction(props) {
  const { active, socket, curPlayer, curBid, card, turnOrder, players } = props

  const [tableData, updateTableData] = useState(
    new Array(players.length).fill(0)
  )

  const [bid, setBid] = useState(curBid)

  useEffect(() => {
    let p = tableData
    for (let i = 0; i < players.length; i++) {
      if (players[i].auctionComp) {
        p[i] = 'C'
      } else if (active === false) {
        p[i] = 0
      } else if (turnOrder.findIndex((index) => index === i) === -1) {
        p[i] = 'X'
      }
    }
    p[curPlayer] = curBid
    updateTableData(p)
    setBid(curBid)
  }, [turnOrder])

  const handleChange = (event) => {
    setBid(event.target.value)
  }

  const handleSubmit = (e) => {
    socket.emit('AUCTION_BID', { bid: bid })
  }

  const handleSkip = (e) => {
    socket.emit('AUCTION_BID', { bid: 0 })
  }

  return (
    <StyledAuction>
      <SubmitArea>
        <StyledCard>
          {active && <PowerplantCard powerplant={card} />}
        </StyledCard>
        <Form>
          <TextField
            id="bid-"
            label="Bid"
            value={bid}
            onChange={handleChange}
          />
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>

          <Button variant="contained" color="primary" onClick={handleSkip}>
            Skip
          </Button>
        </Form>
      </SubmitArea>

      <StyledTable component={Paper}>
        <StyledBody>
          {tableData.map((value, index) => (
            <TableRow key={index}>
              <TableCell align="right">{players[index].number}</TableCell>
              <TableCell align="right">{value}</TableCell>
            </TableRow>
          ))}
        </StyledBody>
      </StyledTable>
    </StyledAuction>
  )
}

export default Auction
