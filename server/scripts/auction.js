function updateMarket(market, next) {
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
