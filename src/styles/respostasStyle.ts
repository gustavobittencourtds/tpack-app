import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const RespostasContainer = styled.div`
  font-family: 'Inter', sans-serif;
  max-width: 1000px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  animation: ${fadeIn} 0.4s ease-out;

  @media (prefers-color-scheme: dark) {
    background: #1e1e1e;
    color: #f1f1f1;
  }
`;

export const RespostasHeader = styled.h1`
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
  text-align: center;
  margin-bottom: 0.5rem;

  @media (prefers-color-scheme: dark) {
    color: #f1f1f1;
  }
`;

export const RespostasSubheader = styled.p`
  font-size: 0.9rem;
  color: #636e72;
  text-align: center;
  margin-bottom: 1.5rem;

  strong {
    color: #6c5ce7;
  }

  @media (prefers-color-scheme: dark) {
    color: #b2bec3;
  }
`;

export const RespostasContent = styled.div`
  margin-top: 1rem;
  text-align: left;
  max-width: 800px;
  margin: 0 auto;
`;

export const RespostaItem = styled.div`
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

export const PerguntaHeader = styled.div`
  background: #6c5ce7;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.4;
`;

export const RespostaBody = styled.div`
  padding: 0.5rem 1rem;
  background: #fafafa;
  font-size: 0.75rem;
  color: #2d3436;
  line-height: 1.5;

  @media (prefers-color-scheme: dark) {
    background: #2a2a2a;
    color: #b2bec3;
  }
`;

export const ContactLink = styled.a`
  color: #6c5ce7;
  text-decoration: none;
  font-weight: 400;
  font-size: 0.75rem;

  &:hover {
    text-decoration: underline;
  }
`;
