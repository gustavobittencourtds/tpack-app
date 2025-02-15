import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const AdminContainer = styled.div`
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

export const AdminHeader = styled.h1`
  font-size: 2rem;
  color: #2d3436;
  margin-bottom: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;

  @media (prefers-color-scheme: dark) {
    color: #ffffff;
  }
`;

export const AdminSection = styled.section`
  margin-bottom: 2rem;
`;

export const AdminSectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #2d3436;
  margin-bottom: 1rem;
  font-weight: 600;

  @media (prefers-color-scheme: dark) {
    color: #ffffff;
  }
`;

export const AdminList = styled.ul`
  list-style: none;
  padding: 0;
`;

export const AdminListItem = styled.li`
  margin-bottom: 0.75rem;
`;

export const AdminButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 500;
  background: linear-gradient(135deg, #6c5ce7, #8e7cf3);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px rgba(108, 92, 231, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(108, 92, 231, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #e0e0e0;
    color: #666;
    box-shadow: none;
  }
`;

export const LoadingText = styled.p`
  font-size: 1rem;
  color: #636e72;
  text-align: center;

  @media (prefers-color-scheme: dark) {
    color: #b2bec3;
  }
`;