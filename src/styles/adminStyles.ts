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
    background: #e8e8e8;
  }
`;

export const TableHeader = styled.th`
  background: #6c5ce7;
  color: #FFF;
  padding: 0.8rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 400;

  &:first-child {
    border-right: solid 1px #FFF;
  }
`;

export const TableCell = styled.td`
  padding: 0.8rem;
  font-size: 0.75rem;
`;

export const ProfessorCell = styled(TableCell)`
  font-weight: 500;
  color: #2d3436;
`;

export const QuestionCell = styled(TableCell)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
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

export const DateHeader = styled(TableHeader)`
  background-color: #6c5ce7;
  color: white;
`;