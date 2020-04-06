import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import PowerplantCard from './PowerplantCard'

function PlayerTableData({ players }) {
  //console.log(players)
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Player Name</TableCell>
            <TableCell align="right">Money</TableCell>
            <TableCell align="right">Powerplants</TableCell>
            <TableCell align="right">Cities</TableCell>
            <TableCell align="right">Resources</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((p) => (
            <TableRow key={p.key}>
              <TableCell component="th" scope="row">
                {p.number}
              </TableCell>
              <TableCell align="right">{p.money}</TableCell>
              <TableCell align="right">
                <List>
                  {p.powerplants.map((powerplant) => {
                    return (
                      <ListItem>
                        <PowerplantCard powerplant={powerplant} />
                      </ListItem>
                    )
                  })}
                </List>
              </TableCell>
              <TableCell align="right">{p.cities}</TableCell>
              <TableCell align="right">{p.resources}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
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
