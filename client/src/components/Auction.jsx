import React from 'react'
import useInput from '../scripts/input-hook'
import socketIOClient from 'socket.io-client'

function Auction(props) {
  const { socket, curPlayer, curBid, card } = props
  const { value: bid, bind, reset } = useInput(curBid)

  const handleSubmit = e => {
    e.preventDefault()
    console.log('bid' + bid)
    socket.emit('AUCTION_BID', { bid: parseInt(bid) })
  }

  const handleSkip = e => {
    e.preventDefault()
    socket.emit('AUCTION_BID', { bid: 0 })
  }

  return (
    <div>
      {curPlayer}
      {curBid}
      {card.number}
      {card.type}
      {card.cost}
      {card.power}
      <form onSubmit={handleSubmit}>
        <label>
          Bid:
          <input type="number" {...bind} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <button onClick={handleSkip}> Skip</button>
    </div>
  )
}

export default Auction
