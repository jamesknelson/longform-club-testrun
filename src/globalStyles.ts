import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

	/* These styles make the body full-height */
  html {
    font-size: 16px;
		min-height: 100%;
    height: 100%;
  }

  body {
    display: flex;
    margin: 0;
    padding: 0;
    font-family: "Roboto", sans-serif;
    font-size: 1rem;
    line-height: 1.5rem;
    height: 100%;
    min-height: 100%;
  }

  #root {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
`
