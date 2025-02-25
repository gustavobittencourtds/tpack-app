import { AppProps } from 'next/app';
import Sidebar from '../components/Sidebar';
import { GlobalStyle, AppContainer, ContentContainer } from '../styles/globalStyles';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Sidebar />
        <ContentContainer>
          <Component {...pageProps} />
        </ContentContainer>
      </AppContainer>
    </>
  );
}

export default MyApp;
