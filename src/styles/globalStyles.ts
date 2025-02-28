import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';
import 'normalize.css';

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(135deg, #f0f2f5, #ebedf0);
  }
`;

export const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const ContentContainer = styled.div`
  flex: 1;
  padding: 20px;
`;
