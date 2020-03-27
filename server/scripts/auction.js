function updateMarket(market, powerplantDeck) {
  next = powerplantDeck.pop()
  if (next.number === 999) {
    //shuffle
  }
  market.push(next)
  market.sort((a, b) => {
    if (a.number > b.number) {
      return 1
    } else {
      return -1
    }
  })
}

exports.updateMarket = updateMarket
