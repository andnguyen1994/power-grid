import React from 'react'
import styled from 'styled-components'
import Card from '@material-ui/core/Card'
import { Coal, Oil, Garbage, Uranium } from './Icons'

const CardStyled = styled(Card)`
  display: flex;
  height: 100%;
  width: 100%;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  grid-template-areas: 'number type cost power';
  justify-items: stretch;
  align-items: center;
  border: 1px solid #cccccc;
`

const NumberDisplay = styled.div`
  font: bold 14px;
  grid-area: number;
  width: 100%;
`

const TypeDisplay = styled.div`
  grid-area: type;
  width: 100%;
  height: 95%;
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    'coal oil'
    'garbage uranium';
  justify-content: stretch;
  grid-gap: 2px;
  min-height: 0;
`

const TypeContainer = styled.div`
  display: inline-block;
  grid-area: ${(props) => props.type};
  min-width: 0;
  min-height: 0;
`

const CostDisplay = styled.div`
  grid-area: cost;
  width: 100%;
`

const PowerDisplay = styled.div`
  grid-area: power;
  width: 100%;
`

const PowerplantCard = ({ powerplant }) => {
  const { number, type, cost, power } = powerplant
  return (
    <CardStyled>
      <NumberDisplay>{number}</NumberDisplay>
      <TypeDisplay>
        <TypeContainer type="coal">
          <Coal fill={type[0]} />
        </TypeContainer>
        <TypeContainer type="oil">
          <Oil fill={type[1]} />
        </TypeContainer>
        <TypeContainer type="garbage">
          <Garbage fill={type[2]} />
        </TypeContainer>
        <TypeContainer type="uranium">
          <Uranium fill={type[3]} />
        </TypeContainer>
      </TypeDisplay>
      <CostDisplay>{cost}</CostDisplay>
      <PowerDisplay>{power}</PowerDisplay>
    </CardStyled>
  )
}

export default PowerplantCard
