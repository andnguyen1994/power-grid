import React from 'react'
import styled from 'styled-components'

const Test = styled.div`
  display: block;
  width: 100%;
  height: 100%;
`

export const Oil = ({ fill }) => (
  <svg height="100%" width="100%" viewBox={'0 0 32 32'}>
    <circle
      cx={16}
      cy={16}
      r={15}
      stroke={'#297045'}
      stroke-width=""
      fill={fill ? '#297045' : 'white'}
    />
  </svg>
)

export const Uranium = ({ fill }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    height="100%"
    width="100%"
    viewBox="0 0 51 48"
  >
    <path
      fill={fill ? '#9A031E' : 'white'}
      stroke="#9A031E"
      stroke-width="4"
      d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"
    />
  </svg>
)

export const Garbage = ({ fill }) => {
  console.log(fill)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      height="100%"
      width="100%"
      viewBox="0 0 60 60"
    >
      <polygon
        fill={fill ? '#FB8B24' : 'white'}
        stroke="#FB8B24"
        stroke-width="4"
        points="0 51.961, 60 51.961, 30 0"
      />
    </svg>
  )
}

export const Coal = ({ fill }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    height="100%"
    width="100%"
    viewBox="0 0 60 60"
  >
    <polygon
      fill={fill ? '#004777' : 'white'}
      stroke="#004777"
      stroke-width="4"
      points="0 60, 60 60, 60 0, 0 0"
    />
  </svg>
)
