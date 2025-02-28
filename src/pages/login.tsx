// Login.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  LoginContainer,
  LoginForm,
  LoginInput,
  LoginButton,
  RegisterButton,
  ErrorMessage,
} from '../styles/loginStyles';

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
    console.log('Clicou em Cadastre-se'); // Para depuração
    router.push('/register').then(() => {
      console.log('Redirecionamento para /register concluído');
    }).catch((err) => {
      console.error('Erro ao redirecionar:', err);
    });
  };

  return (
    <LoginContainer>
      <div>
        <LoginForm onSubmit={handleLogin}>
          <h2>Login</h2>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <LoginInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <LoginInput
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <LoginButton type="submit">Entrar</LoginButton>
          <RegisterButton type="button" onClick={handleRegisterRedirect}>
            Cadastre-se
          </RegisterButton>
        </LoginForm>
      </div>
    </LoginContainer>
  );
};

export default Login;