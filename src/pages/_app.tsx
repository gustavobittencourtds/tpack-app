// pages/_app.tsx
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';
import Head from 'next/head';
import '../styles/global.css';
import styles from '../styles/App.module.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Rotas públicas (não requerem Sidebar ou autenticação)
  const publicRoutes = ['/login', '/register', '/survey'];
  const isPublicRoute = publicRoutes.includes(router.pathname);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>TPACK App</title>
      </Head>

      <div className={styles.appContainer}>
        {/* {!isPublicRoute && <Sidebar />} */}
        <div className={styles.contentContainer}>
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
}

export default MyApp;