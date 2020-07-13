import styled from 'styled-components/macro'

export const UnstyledButtonControl = styled.button<{
  inline?: boolean
}>`
  display: ${(props) => (props.inline ? 'inline-' : '')}block;
  width: 100%;

  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;

  background-color: transparent;
  border-radius: 0;
  border-width: 0;
  color: inherit;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  height: auto;
  padding: 0;
  outline: none;
`
