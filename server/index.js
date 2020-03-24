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
  active: false,
  curPlayer: -1,
  curBid: 0,
  curCard: -1,
  turnOrder: [0, 1, 2, 3]
}
let turn

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
    io.in('GAME').emit('GAME_STATE_UPDATE', {
      market: market,
      players: players
    })
    io.in('GAME').emit('AUCTION_PHASE')
    console.log('started')
  })

  socket.on('AUCTION_BID', data => {
    //verify auction bid
    console.log('received auction')
    console.log(parseInt(data.bid))
    //confirm auction is ongoing
    if (curAuction.turnOrder[0] === -1) {
    } else if (socket.id === players[curAuction.turnOrder[0]].key) {
      console.log('correct player')
      if (curAuction.active === false) {
        if (data.bid <= curAuction.curBid) {
          players[curAuction.turnOrder[0]].auctionComp = true
        } else {
          let auctionQ = []
          for (var i = 0; i < players.length; i++) {
            if (!players[i].auctionComp) {
              auctionQ.push(i)
            }
          }
          auctionQ.push(auctionQ.shift())
          curAuction = {
            active: true,
            curPlayer: players.find(e => e.key === socket.id),
            curBid: market[data.card].number,
            card: market[data.card],
            turnOrder: auctionQ
          }
          market.splice(data.card, 1)
        }
      } else if (data.bid <= curAuction.curBid) {
        console.log(
          data.bid,
          curAuction.curBid,
          data.bid + curAuction.curBid,
          data.bid <= curAuction.curBid
        )
        curAuction.turnOrder.shift()
        console.log('remove player')
      } else {
        console.log(data)
        curAuction.curBid = data.bid
        curAuction.curPlayer = players.find(e => e.key === socket.id)
        curAuction.turnOrder.push(curAuction.turnOrder.shift())
      }
      console.log(curAuction.turnOrder)
      console.log(curAuction.curBid)
      if (curAuction.turnOrder.length === 1) {
        players[curAuction.turnOrder[0]].auctionComp = true
        players[curAuction.turnOrder[0]].powerplants.push(curAuction.card)
        players[curAuction.turnOrder[0]].money -= curAuction.curBid
        curAuction.active = false
        curAuction.curBid = 0
        let next = () => {
          for (let i = 0; i < players.length; i++) {
            if (!players[i].auctionComp) {
              return i
            }
          }
          return -1
        }
        console.log(next())
        curAuction.turnOrder = [next()]
        console.log('turnorder', curAuction.turnOrder)
        updateMarket(market, powerplantDeck.pop())
      }
      io.in('GAME').emit('AUCTION_UPDATE', curAuction)
      io.in('GAME').emit('GAME_STATE_UPDATE', {
        market: market,
        players: players
      })
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
