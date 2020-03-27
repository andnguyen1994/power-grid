var initialState = require('./initialState')
const { shuffle } = require('./scripts/shuffle')
const { updateMarket } = require('./scripts/auction')

var express = require('express')

var app = express()

var server = app.listen(8080)

app.use(express.static('public'))

const io = require('socket.io')(server)

let turnCount = 0
let phase = 'LOBBY'
let numPlayers = 0
let step = 0
let players = []
let turnOrder = [0, 1, 2, 3] //track overall turn order
let curAuction = {
  active: false,
  curPlayer: -1,
  curBid: 0,
  curCard: -1,
  turnOrder: [0, 1, 2, 3],
  didBuy: false
}
let resources = initialState.resources
let powerplantDeck = initialState.powerplantDeck
let cities = initialState.cities
let powerplantMarket = powerplantDeck.slice(0, 8)
powerplantDeck = powerplantDeck.slice(8, powerplantDeck.length)

console.log(powerplantDeck)
// Meat of code goes in here
io.on('connection', socket => {
  //If first player, enable start button
  socket.on('READY', () => {
    if (numPlayers === 0) {
      io.to(`${socket.id}`).emit('HOST')
    }

    //Players press ready to join
    if ((phase = 'LOBBY')) {
      var player = {
        key: socket.id,
        number: numPlayers++,
        money: 50,
        powerplants: [],
        cities: [],
        resources: [0, 0, 0, 0],
        auctionComp: false,
        resourceComp: false
      }
      players.push(player)
      socket.join('GAME')
      console.log(`player ${socket.id} has joined the game`)
      io.to(`${players[players.length - 1].key}`).emit('JOINED', {
        text: `hello player ${numPlayers}`,
        playerNum: numPlayers
      })
      io.in('GAME').emit('PLAYER_UPDATE', { players: players })
    }
  })

  //when host presses start, init game (draw board, show market and future, show resources, randomize order)

  socket.on('START', () => {
    if (phase === 'LOBBY') {
      //send cities map, markets, send order
      players = shuffle(players)
      //need to remove cards and shuffle in tier 3 card
      powerplantDeck = shuffle(powerplantDeck)
      io.in('GAME').emit('GAME_STATE_UPDATE', {
        market: powerplantMarket,
        players: players,
        resources: resources.market,
        cities: cities
      })
      phase = 'AUCTION'
      io.in('GAME').emit('AUCTION_PHASE')
      console.log('started')
    }
  })

  socket.on('AUCTION_BID', data => {
    //verify auction bid
    console.log('received auction')
    //confirm auction is ongoing
    if (curAuction.turnOrder[0] === -1) {
    } else if (socket.id === players[curAuction.turnOrder[0]].key) {
      let auctionQ = []
      console.log('correct player')
      //If there's no active auction, check for skip or new auction
      if (curAuction.active === false) {
        if (data.bid <= 0) {
          players[curAuction.turnOrder[0]].auctionComp = true
          curAuction.turnOrder.shift()
        } else {
          //updating player order
          for (var i = 0; i < players.length; i++) {
            if (!players[i].auctionComp) {
              auctionQ.push(i)
            }
          }
          auctionQ.push(auctionQ.shift())
          curAuction = {
            active: true,
            curPlayer: players.find(e => e.key === socket.id),
            curBid: powerplantMarket[data.card].number,
            card: powerplantMarket[data.card],
            turnOrder: auctionQ,
            didBuy: true
          }
          powerplantMarket.splice(data.card, 1)
        }
        //If skipped, remove player from current auction
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
        //console.log(data)
        curAuction.curBid = data.bid
        curAuction.curPlayer = players.find(e => e.key === socket.id)
        curAuction.turnOrder.push(curAuction.turnOrder.shift())
      }
      //only one person left = winner
      if (curAuction.turnOrder.length === 1 && curAuction.active) {
        players[curAuction.turnOrder[0]].auctionComp = true
        players[curAuction.turnOrder[0]].powerplants.push(curAuction.card)
        players[curAuction.turnOrder[0]].money -= curAuction.curBid
        curAuction.active = false
        curAuction.curBid = 0
        auctionQ = []
        for (var i = 0; i < players.length; i++) {
          if (!players[i].auctionComp) {
            auctionQ.push(i)
          }
        }
        curAuction.turnOrder = auctionQ
        updateMarket(powerplantMarket, powerplantDeck)
      }
      if (curAuction.turnOrder.length === 0) {
        //remove lowest card if nobody bought
        if (!curAuction.didBuy) {
          updateMarket(powerplantMarket, powerplantDeck)
          powerplantMarket.shift()
        }
        if (powerplantMarket[powerplantMarket.length - 1].number === 999) {
          console.log('hello')
          powerplantMarket.pop()
          powerplantMarket.shift()
          step = 3
        }
        phase = 'RESOURCES'
      }
      console.log(curAuction.turnOrder)

      //if phase 3 is drawn
      io.in('GAME').emit('AUCTION_UPDATE', curAuction)
      io.in('GAME').emit('GAME_STATE_UPDATE', {
        market: powerplantMarket,
        players: players
      })
    }
  })

  socket.on('REMOVAL', data => {
    x = players.find(p => p.key === socket.id)
    for (let i = 0; i < x.resources.length; i++) {
      x.resources[i] -= data.resources[i]
      resources[i] += data.resources[i]
    }
    x.powerplants.splice(data.card, 1)
    io.in('GAME').emit('GAME_STATE_UPDATE', {
      market: powerplantMarket,
      players: players,
      resourceMarket: resources.market
    })
  })

  //need to reverse order
  socket.on('BUY_RESOURCE', data => {
    if (socket.id === players[turnOrder[3]].key) {
      for (let i = 0; i < resources.length; i++) {
        resources[i].market -= data.resources[i]
        players[turnOrder[3]].resources[i] += data.resources[i]
      }
      players[turnOrder[3]].money -= data.cost
      players[turnOrder[3]].resourceComp = true
      io.in('GAME').emit('GAME_STATE_UPDATE', {
        players: players,
        market: powerplantMarket,
        resourceMarket: resources.market
      })
      turnOrder.unshift(turnOrder.pop())
      if (turnOrder[0] === 0) {
        phase = 'CITIES'
      }
    }
  })

  //data contains cities[] and money
  socket.on('CITIES', data => {
    if (socket.id === players[turnOrder[0]].key) {
      x = players[turnOrder[0]]
      x.cities = x.cities.concat(data.cities)
      x.money -= data.money
      for (let i = 0; i < powerplantMarket.length; i++) {
        if (powerplantMarket[i].number < x.cities.length) {
          powerplantMarket.splice(i, 1)
          updateMarket(powerplantMarket, powerplantDeck)
        }
      }
      for (c in data.cities) {
        cities[c].owners.push(x.number)
      }
      turnOrder.push(turnOrder.shift())
      if (turnOrder[0] === 0) {
        phase = 'BUREACRACY'
        if (step === 1) {
          if (
            players.find(p => {
              p.cities.length >= 7
            })
          ) {
            step = 2
            powerplantMarket.shift()
            updateMarket(powerplantMarket, powerplantDeck)
          }
        }
      }
    }
  })

  socket.on('BUREACRACY', data => {
    if (socket.id === players[turnOrder[0]].key) {
      let x = players.find(p => p.key === socket.id)
      for (var i = 0; i < data.resources.length; i++) {
        x.resources[i] -= data.resources[i]
        resources[i] += data.resources[i]
      }
      x.powered = data.powered
      x.money += initialState.payout[x.powered]
      if (ready++ === players.length) {
        if (players.find(p => p.cities.length > 17)) {
          let max = 0
          let winner = 0
          for (let i = 0; i < players.length; i++) {
            if (players[i].powered > max) {
              max = players[i].powered
              winner = i
            } else if (players[i].powered === max) {
              if (players[i].money > players[winner].money) {
                winner = i
              } else if (players[i].money === players[winner].money) {
                if (players[i].cities > players[winner].cities) {
                  winner = i
                }
              }
            }
            io.in('GAME').emit('WINNER', { winner: winner, players: players })
          }
        }
        //replenish resources
        for (r in resources) {
          if (r.count < refill[step]) {
            r.market += r.count
            r.count = 0
          } else {
            r.market += refill[step]
            r.count -= refill[step]
          }
        }
        //reset market: remove highest and put at the bottom of deck AKA/
        powerplantDeck.unshift(powerplantMarket.pop())
        updateMarket(powerplantMarket, powerplantDeck)
        players.sort((a, b) => (a.cities < b.cities ? 1 : -1))
        turnCount++
        ready = 0
        //reset auction
        curAuction = {
          active: false,
          curPlayer: -1,
          curBid: 0,
          curCard: -1,
          turnOrder: [0, 1, 2, 3],
          didBuy: false
        }
        io.in('GAME').emit('GAME_STATE_UPDATE', {
          players: players,
          powerplantMarket: powerplantMarket,
          resourceMarket: resources.market,
          turn: turnCount
        })
      }
    }
  })

  //Send prices to clients, start with last player, clients send purchases, go until all clients are complete

  //Build phase 1, normal order, players choose starting city (broadcast to others),

  //Powerphase -> calculate where resources are and what gets powered

  //repeat with some changes

  //when mostCities === 17 end phase
})
