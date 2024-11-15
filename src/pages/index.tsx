// pages/index.tsx
import { NextPage } from 'next';
import Link from 'next/link';

const HomePage: NextPage = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Bem-vindo ao Questionário TPACK</h1>
      <p>
        Este questionário tem como objetivo avaliar as práticas pedagógicas e o uso de tecnologias
        no contexto educacional. Por favor, verifique o link enviado para o seu e-mail para acessar
        as questões.
      </p>
      <p>
        Caso tenha recebido o link, clique no botão abaixo para iniciar a pesquisa. Certifique-se de
        estar conectado ao mesmo dispositivo onde recebeu o e-mail.
      </p>
      <Link href="/survey">
        <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
          Iniciar Questionário
        </button>
      </Link>
    </div>
  );
};

export default HomePage;
