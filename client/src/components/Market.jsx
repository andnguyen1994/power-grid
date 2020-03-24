import React from 'react'
import socketIOClient from 'socket.io-client'

function Market({ marketData, socket }) {
  let rows = []

  const handleAuction = index => {
    console.log('index', index)
    console.log('market', marketData)
    socket.emit('AUCTION_BID', { bid: marketData[index].number, card: index })
  }
  console.log(marketData, rows)
  for (let i = 0; i < marketData.length; i++) {
    if (!!marketData[i]) {
      rows.push(
        <tr>
          <td>
            <button onClick={() => handleAuction(i)}>
              {marketData[i].number}
            </button>
          </td>
          <td>{marketData[i].type}</td>
          <td>{marketData[i].cost}</td>
          <td>{marketData[i].power}</td>
        </tr>
      )
    }
  }

  return (
    <table>
      <tr>
        <th>Number </th>
        <th>Resource </th>
        <th>cost </th>
        <th>power</th>
      </tr>
      {rows}
    </table>
  )
}

export default Market
