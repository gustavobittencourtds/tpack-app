// pages/index.tsx
import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '../styles/surveyStyles.module.css';

const HomePage: NextPage = () => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <Image src="/images/logo.svg" alt="Tpack App Logo" width={150} height={150} />
      <h1 style={{ fontSize: '2rem', margin: '20px 0' }}>Tpack App</h1>
      <p style={{ fontSize: '1.25rem' }}>
        Bem-vindo ao TPACK App!
      </p>
      <p style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>
        Aplique o questionário para começar a avaliar os professores com o TPACK.
      </p>
      <div style={{ marginTop: '4rem' }}>
        <button onClick={() => navigateTo('/admin')} className={styles.navigationButton} style={{ marginRight: '4rem' }}>
          Rodadas
        </button>
        <button onClick={() => navigateTo('/professors')} className={styles.navigationButton}>
          Professores
        </button>
      </div>
    </div>
  );
};

export default HomePage;
