import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const RespostasContainer = styled.div`
  font-family: 'Inter', sans-serif;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: ${fadeIn} 0.6s ease-out;

  @media (prefers-color-scheme: dark) {
    background: rgba(30, 30, 30, 0.95);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

export const RespostasHeader = styled.h1`
  font-size: 2rem;
  color: #2d3436;
  margin-bottom: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;

  @media (prefers-color-scheme: dark) {
    color: #ffffff;
  }
`;

export const RespostasContent = styled.div`
  margin-top: 2rem;
  text-align: left;
  max-width: 800px;
  margin: 0 auto;
`;

export const RespostaItem = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);

  h3 {
    font-size: 1.25rem;
    color: #2d3436;
    margin-bottom: 0.75rem;
    font-weight: 600;
  }

  p {
    font-size: 1rem;
    color: #636e72;
    line-height: 1.6;
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(40, 40, 40, 0.9);
    border-color: rgba(255, 255, 255, 0.1);

    h3 {
      color: #ffffff;
    }

    p {
      color: #b2bec3;
    }
  }
`;

export const ContactLink = styled.a`
  color: #6c5ce7;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;