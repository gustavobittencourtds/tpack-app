import styled from 'styled-components';

export const AdminContainer = styled.div`
  background-color: #ffffff;
  padding: 1.5rem;
  max-width: 1100px;
  margin: auto;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  font-family: 'Poppins', sans-serif;
`;

export const AdminHeader = styled.h1`
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
  text-align: center;
  margin-bottom: 1rem;
`;

export const RoundCard = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const RoundCardHeader = styled.h2`
  font-size: 1.25rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
`;

export const RoundCardContent = styled.div`
  font-size: 0.875rem;
  color: #555;
  margin-bottom: 1rem;
`;

export const RoundCardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const AdminButton = styled.button`
  background: #6c5ce7;
  color: white;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 400;
  transition: background 0.2s, box-shadow 0.2s;

  &:hover {
    background: #5948d6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

export const LoadingText = styled.p`
  font-style: italic;
  text-align: center;
  color: #222;
  font-size: 0.875rem;
  margin-top: 2rem;
`;