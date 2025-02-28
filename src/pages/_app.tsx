// pages/_app.tsx
import { AppProps } from 'next/app';
import { useRouter } from 'next/router'; // Importar useRouter
import Sidebar from '../components/Sidebar';
import { GlobalStyle, AppContainer, ContentContainer } from '../styles/globalStyles';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Definir quais rotas são públicas (não requerem Sidebar ou autenticação)
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.includes(router.pathname);

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        {!isPublicRoute && <Sidebar />}
        <ContentContainer>
          <Component {...pageProps} />
        </ContentContainer>
      </AppContainer>
    </>
  );
}

export default MyApp;