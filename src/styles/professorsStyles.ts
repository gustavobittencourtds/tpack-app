import styled from 'styled-components';

export const ProfessorsContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
`;

export const ProfessorsHeader = styled.h1`
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
  text-align: center;
  margin-bottom: 1.5rem;
`;

export const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fcfcfc;
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f8f8f8;
  }
`;

export const TableHeader = styled.th`
  background: #6c5ce7;
  color: #FFF;
  padding: 0.8rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 400;
`;

export const TableCell = styled.td`
  padding: 0.8rem;
  font-size: 0.875rem;
`;

export const AddProfessorForm = styled.form`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

export const AddProfessorInput = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 0.5rem;
`;

export const AddProfessorButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #6c5ce7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #5a4dbf;
  }
`;

export const EditButton = styled.button`
  padding: 0.3rem 0.6rem;
  font-size: 0.875rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;

  &:hover {
    background-color: #2980b9;
  }
`;

export const DeleteButton = styled.button`
  padding: 0.3rem 0.6rem;
  font-size: 0.875rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #c0392b;
  }
`;

export const SendButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #6c5ce7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0.5rem;

  &:hover {
    background-color: #5a4dbf;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const SelectAllButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0.5rem;

  &:hover {
    background-color: #2980b9;
  }
`;
