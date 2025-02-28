import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const ProfessorsContainer = styled.div`
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

export const ProfessorsHeader = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
`;

export const ProfessorCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.3s ease-out;
`;

export const AddProfessorForm = styled.form`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const AddProfessorInput = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  width: 300px;

  &:focus {
    border-color: #6c5ce7;
    outline: none;
  }
`;

export const AddProfessorButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background: linear-gradient(135deg, #6c5ce7, #8e7cf3);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
  }

  svg {
    margin-right: 8px;
  }
`;

export const EditButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 0.5rem;
  display: flex;
  align-items: center;

  &:hover {
    background: #2980b9;
  }

  svg {
    margin-right: 6px;
  }
`;

export const DeleteButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background: #c0392b;
  }

  svg {
    margin-right: 6px;
  }
`;

export const SendButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background: linear-gradient(135deg, #00b894, #00cec9);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 184, 148, 0.3);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const SelectAllButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background: #2980b9;
  }
`;