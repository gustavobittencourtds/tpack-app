import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Poppins', sans-serif;
  }
`;

export const AppContainer = styled.div`
  display: flex;
`;

export const ContentContainer = styled.div`
  flex: 1;
  padding: 20px;
`;
