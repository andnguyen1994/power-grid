import React from 'react'

function PlayerTableData({ players }) {
  let rows = []
  console.log(players)
  for (var i = 0; i < players.length; i++) {
    rows.push(
      <tr>
        <td>{players[i].number + 1}</td>
        <td>{players[i].money}</td>
        <td>{players[i].powerplants}</td>
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

export default PlayerTableData
