import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const RespostasContainer = styled.div`
  padding: 1.5rem 5%;
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 1480px;
  animation: ${fadeIn} 0.4s ease-out;
  margin: 0 auto;

  @media (prefers-color-scheme: dark) {
    background: #1e1e1e;
    color: #f1f1f1;
  }
`;

// Outros estilos permanecem iguais

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

export const RespostasTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

export const RespostasTableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;

    @media (prefers-color-scheme: dark) {
      background-color: #2a2a2a;
    }
  }
`;

export const RespostasTableHeader = styled.th`
  background-color: #6c5ce7;
  color: white;
  padding: 0.75rem;
  text-align: left;
  border-bottom: 2px solid #ddd;

  @media (prefers-color-scheme: dark) {
    border-bottom: 2px solid #444;
  }
`;

export const RespostasTableCell = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #ddd;

  @media (prefers-color-scheme: dark) {
    border-bottom: 1px solid #444;
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

export const BackButton = styled.button`
  background-color: #6c5ce7;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 1rem;
  &:hover {
    background-color: #5a4dbf;
  }
`;
