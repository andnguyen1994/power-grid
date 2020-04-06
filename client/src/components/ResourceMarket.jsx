import React from 'react'
import styled from 'styled-components'
import { Coal, Oil, Garbage, Uranium } from './Icons'
import Paper from '@material-ui/core/Paper'
import socketIOClient from 'socket.io-client'

const ResourceMarketContainer = styled(Paper)`
  display: grid;
  height: 60%;
  grid-template-columns: repeat(4, 3fr) 1fr;
  grid-template-rows: 8fr 1fr;
  grid-template-areas:
    'coal oil garbage uranium value'
    'u3 u2 u1 u0 u4';
`

const ResourceBlockContainer = styled.div`
  grid-area: ${(props) => props.type};
  max-height: 100%;
  display: flex;
  min-height: 0;
  flex-direction: column;
`

const ResourceGroupContainer = styled.div`
  min-height: 0;
  height: 12.5%;
  flex-shrink: 1;
  border: 1px solid black;
  padding: 2px 0px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const IconContainer = styled.div`
  height: 25%;
`

const UraniumExtraContainer = styled.div`
  grid-area: ${(props) => props.loc};
  height: 100%;
  width: 100%;
  border: 1px solid black;
`

const getResourceGroup = (Type, resource) => {
  let outer = []
  let total = resource.market + resource.count
  let n = parseInt(total / 8)
  for (let i = 0; i < 8; i++) {
    let inner = []
    for (let j = i * n + 1; j <= i * n + n; j++) {
      inner.push(
        <IconContainer>
          <Type fill={resource.market >= j} />
        </IconContainer>
      )
    }
    outer.push(<ResourceGroupContainer>{inner}</ResourceGroupContainer>)
  }

  return outer.reverse()
}

const ResourceMarket = (props) => {
  let [coal, oil, garbage, uranium] = props.resources
  let x = [1, 2, 3, 4, 5, 6, 7, 8]
  let uraniumCosts = [10, 12, 14, 16]

  return (
    <ResourceMarketContainer variant="outlined">
      <ResourceBlockContainer type="coal">
        {getResourceGroup(Coal, coal)}
      </ResourceBlockContainer>
      <ResourceBlockContainer type="oil">
        {getResourceGroup(Oil, oil)}
      </ResourceBlockContainer>
      <ResourceBlockContainer type="garbage">
        {getResourceGroup(Garbage, garbage)}
      </ResourceBlockContainer>
      <ResourceBlockContainer type="uranium">
        {getResourceGroup(Uranium, uranium)}
      </ResourceBlockContainer>
      <ResourceBlockContainer type="value">
        {x.map((i) => (
          <ResourceGroupContainer>{i}</ResourceGroupContainer>
        ))}
      </ResourceBlockContainer>
      {uraniumCosts.map((val, index) => {
        return (
          <UraniumExtraContainer loc={`u${index}`}>
            {val}
            <IconContainer>
              <Uranium fill={uranium.market >= 9 + index ? 1 : 0} />
            </IconContainer>
          </UraniumExtraContainer>
        )
      })}
    </ResourceMarketContainer>
  )
}

export default ResourceMarket
