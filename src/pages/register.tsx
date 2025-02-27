import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { RegisterContainer, RegisterForm, RegisterInput, RegisterButton, ErrorMessage } from '../styles/registerStyles';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

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
        router.push('/admin');
      } else {
        setError(data.message || 'Erro ao registrar');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
    }
  };

  return (
    <RegisterContainer>
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
    </RegisterContainer>
  );
};

export default Register;