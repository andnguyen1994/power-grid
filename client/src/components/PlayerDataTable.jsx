import React from 'react'

function PlayerTableData({ players }) {
  let rows = []
  for (var i = 0; i < players.length; i++) {
    rows.push(
      <tr>
        <td>{players[i].number + 1}</td>
        <td>{players[i].money}</td>
        {displayPowerplants(players[i].powerplants)}
        <td>{players[i].cities}</td>
      </tr>
    )
  }
  return (
    <table>
      <tr>
        <th>Player # </th>
        <th>Money </th>
        <th>powerplants </th>
        <th>cities</th>
      </tr>
      {rows}
    </table>
  )
}

function displayPowerplants(powerplants) {
  let arr = []
  for (let i = 0; i < powerplants.length; i++) {
    arr.push(<tr>{powerplants[i].number},</tr>)
  }
  return arr
}

export default PlayerTableData
