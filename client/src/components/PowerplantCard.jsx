import React from 'react'
import styled from 'styled-components'

const Card = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  grid-template-areas: 'number type cost power';
  justify-items: stretch;
`

const NumberDisplay = styled.div`
  font: bold 14px;
  grid-area: number;
  width: 100%;
`

const TypeDisplay = styled.div`
  grid-area: type;
  width: 100%;
`

const CostDisplay = styled.div`
  grid-area: cost;
  width: 100%;
`

const PowerDisplay = styled.div`
  grid-area: power;
  width: 100%;
`

const PowerplantCard = ({ number, type, cost, power }) => {
  return (
    <Card>
      <NumberDisplay>{number}</NumberDisplay>
      <TypeDisplay></TypeDisplay>
      <CostDisplay>{cost}</CostDisplay>
      <PowerDisplay>{power}</PowerDisplay>
    </Card>
  )
}

export default PowerplantCard
