var intialState = require('./initialState')
const shuffle = require('./scripts/shuffle')

var express = require('express')

var app = express()

var server = app.listen(8000)

app.use(express.static('public'))

const io = require('socket.io')(server)

let playerKeys = []
let numPlayers = 0
let playerOrder = []
let curTurn = 0
let powerplantDeck = intialState.powerplantDeck
let market = powerplantDeck.slice(0, 8)
powerplantDeck = powerplantDeck.slice(8, powerplantDeck.length)

console.log(powerplantDeck)
// Meat of code goes in here
io.on('connection', socket => {
  //If first player, enable start button
  if (numPlayers === 0) {
    io.to(`${socket.id}`).emit('HOST')
  }

  //Players press ready to join
  socket.on('READY', () => {
    playerKeys.push(socket.id)
    socket.join('GAME')
    console.log(`player ${socket.id} has joined the game`)
    playerOrder.push(numPlayers)
    io.to(`${playerKeys[numPlayers]}`).emit('JOINED', {
      text: `hello player ${++numPlayers}`
    })
    io.in('GAME').emit('NEW PLAYER', { players: playerKeys })
  })

  //when host presses start, init game (draw board, show market and future, show resources, randomize order)

  socket.on('START', () => {
    //send cities map, markets, send order
    playerOrder = shuffle(playerOrder)
    powerplantDeck = shuffle(powerplantDeck)
    io.in('GAME').emit('INIT_GAME_STATE', {
      playerOrder: playerOrder,
      curMarket: market.slice(0, 4),
      futMarket: market.slice(4, 8)
    })
  })

  socket.on('')
  //player 1 starts by choosing a powerplant to auction, waits for next player until all passes and highest gets power plant

  //If highest is not current player, current player stays the same

  //when hasSelected = numPlayers, go to resource acquisition phase

  //Send prices to clients, start with last player, clients send purchases, go until all clients are complete

  //Build phase 1, normal order, players choose starting city (broadcast to others),

  //Powerphase -> calculate where resources are and what gets powered

  //repeat with some changes

  //when mostCities === 17 end phase
})
