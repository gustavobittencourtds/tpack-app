// Login.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/login.module.css';
import Image from 'next/image';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        router.push('/admin');
      } else {
        setError(data.message || 'Erro ao fazer login');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
    }
  };

  const handleRegisterRedirect = () => {
    router.push('/register').then(() => {
      console.log('Redirecionamento para /register concluído');
    }).catch((err) => {
      console.error('Erro ao redirecionar:', err);
    });
  };

  return (
    <div className={styles.loginContainer}>
      <div>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <Image src="/images/logo.svg" alt="Tpack App Logo" width={150} height={150} style={{ borderRadius: '16px', margin: '0 auto' }}/>

          <h2>Login</h2>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.loginInput}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.loginInput}
          />
          <button type="submit" className={styles.loginButton}>Entrar</button>
          <button type="button" className={styles.registerButton} onClick={handleRegisterRedirect}>
            Cadastre-se
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;