import styled from 'styled-components';

export const AdminContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Poppins', sans-serif;
`;

export const AdminHeader = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
`;

export const RoundCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  }
`;

export const RoundCardHeader = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.75rem;
`;

export const RoundCardContent = styled.div`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 1rem;
`;

export const RoundCardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const AdminButton = styled.button`
  background: linear-gradient(135deg, #6c5ce7, #8e7cf3);
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
  }

  svg {
    margin-right: 8px;
  }
`;

export const LoadingText = styled.p`
  font-style: italic;
  text-align: center;
  color: #636e72;
  font-size: 1rem;
  margin-top: 2rem;
`;