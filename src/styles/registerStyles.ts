// styles/registerStyles.ts
import styled from 'styled-components';

export const RegisterContainer = styled.div`
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  overflow: hidden;

  > div {
    width: 100%;
    margin: auto;
    max-width: 420px;
    padding: 2.5rem;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

export const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  h2 {
    font-size: 1.75rem;
    color: #333;
    text-align: center;
    font-weight: 600;
  }
`;

export const RegisterInput = styled.input`
  padding: 1rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-size: 1rem;
  color: #2d3436;
  transition: all 0.3s ease;

  &:focus {
    border-color: #6c5ce7;
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.2);
    outline: none;
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: #dfe6e9;

    &:focus {
      border-color: #6c5ce7;
    }
  }
`;

export const RegisterButton = styled.button`
  padding: 0.9rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  background: linear-gradient(135deg, #00b894, #00cec9); /* Alinhado com o "Cadastre-se" do login */
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 184, 148, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #e0e0e0;
    color: #666;
    box-shadow: none;
  }
`;

export const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.9rem;
  text-align: center;
`;