var intialState = require('./initialState')
const { shuffle } = require('./scripts/shuffle')
const { updateMarket } = require('./scripts/auction')

var express = require('express')

var app = express()

var server = app.listen(8080)

app.use(express.static('public'))

const io = require('socket.io')(server)

let numPlayers = 0
let players = []
let curAuction = {
  curPlayer: -1,
  price: 0,
  curCard: -1,
  turn: -1,
  turnOrder: [0, 1, 2, 3]
}
let turnOrder = [0, 1, 2, 3]

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
    var player = {
      key: socket.id,
      number: numPlayers++,
      money: 50,
      powerplants: [],
      cities: [],
      auctionComp: false
    }
    players.push(player)
    socket.join('GAME')
    console.log(`player ${socket.id} has joined the game`)
    io.to(`${players[players.length - 1].key}`).emit('JOINED', {
      text: `hello player ${numPlayers}`,
      playerNum: numPlayers
    })
    io.in('GAME').emit('PLAYER_UPDATE', { players: players })
  })

  //when host presses start, init game (draw board, show market and future, show resources, randomize order)

  socket.on('START', () => {
    //send cities map, markets, send order
    players = shuffle(players)
    //need to remove cards and shuffle in tier 3 card
    powerplantDeck = shuffle(powerplantDeck)
    io.in('GAME').emit('INIT_GAME_STATE', {
      market: market,
      players: players
    })
    io.in('GAME').emit('AUCTION_PHASE')
    console.log('started')
  })

  socket.on('AUCTION_BID', data => {
    //verify auction bid
    console.log('received auction')
    if (socket.id === players[curAuction.turnOrder[0]].key) {
      console.log('correct player')
      if (curAuction.card === '') {
        if (data.bid <= curAuction.price) {
          player[socket.id].auctionComp = true
        } else {
          let auctionQ = []
          for (var i = 0; i < players.length; i++) {
            if (!players[i].auctionComp) {
              auctionQ.push(i)
            }
          }
          curAuction = {
            curPlayer: playerKeys.indexOf(socket.id),
            price: market[data.card].number,
            Card: market[data.card],
            turnOrder: auctionQ
          }
        }
      } else if (data.bid <= curAuction.price) {
        curAuction.turnOrder.shift()
      } else {
        curAuction.price = data.bid
        curAuction.curPlayer = curAuction.turn
        curAuction.turnOrder.push(curAuction.turnOrder.shift())
      }

      if (curAuction.turnOrder.length === 1) {
        players[curAuction.turnOrder[0]].auctionComp = true
        players[curAuction.turnOrder[0]].powerplants.push(curAuction.card)
        player[curAuction.turnOrder[0]].money -= curAuction.price
        updateMarket(market, powerplantDeck.pop())
      }
    }
  })
  //player 1 starts by choosing a powerplant to auction, waits for next player until all passes and highest gets power plant

  //If highest is not current player, current player stays the same

  //when hasSelected = numPlayers, go to resource acquisition phase

  //Send prices to clients, start with last player, clients send purchases, go until all clients are complete

  //Build phase 1, normal order, players choose starting city (broadcast to others),

  //Powerphase -> calculate where resources are and what gets powered

  //repeat with some changes

  //when mostCities === 17 end phase
})
