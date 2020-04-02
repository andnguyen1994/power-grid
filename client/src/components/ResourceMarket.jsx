import React from 'react'
import styled from 'styled-components'
import { Coal, Oil, Garbage, Uranium } from './Icons'
import socketIOClient from 'socket.io-client'

const ResourceMarketContainer = styled.div`
  display: grid;
  height: 55%;
  grid-template-columns: repeat(4, 3fr) 1fr;
  grid-template-areas: 'coal oil garbage uranium value';
`

const ResourceBlockContainer = styled.div`
  grid-area: ${props => props.type};
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
  display: flex;
`

const getResourceGroup = (Type, resource) => {
  let outer = []
  let total = resource.market + resource.count
  let n = parseInt(total / 8)
  console.log(n)
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

const ResourceMarket = props => {
  let [coal, oil, garbage, uranium] = props.resources
  let x = [1, 2, 3, 4, 5, 6, 7, 8]

  return (
    <ResourceMarketContainer>
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
        {x.map(i => (
          <ResourceGroupContainer>{i}</ResourceGroupContainer>
        ))}
      </ResourceBlockContainer>
    </ResourceMarketContainer>
  )
}

export default ResourceMarket
