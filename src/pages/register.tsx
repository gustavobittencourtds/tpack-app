// Register.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { RegisterContainer, RegisterForm, RegisterInput, RegisterButton, ErrorMessage } from '../styles/registerStyles';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    console.log('Tela de Registro renderizada');
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        console.log('Registro bem-sucedido, redirecionando para /admin');
        router.push('/admin').then(() => {
          console.log('Redirecionamento para /admin concluído');
        }).catch((err) => {
          console.error('Erro ao redirecionar para /admin:', err);
        });
      } else {
        setError(data.message || 'Erro ao registrar');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
    }
  };

  return (
    <RegisterContainer>
      <div>
        <RegisterForm onSubmit={handleRegister}>
          <h2>Registro</h2>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <RegisterInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <RegisterInput
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <RegisterButton type="submit">Registrar</RegisterButton>
        </RegisterForm>
      </div>
    </RegisterContainer>
  );
};

export default Register;