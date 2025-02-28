import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const RoundContainer = styled.div`
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

export const RoundHeader = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 0.25;
`;

export const RoundSubheader = styled.p`
  font-size: 1rem;
  text-align: center;
  color: #555;
  margin-bottom: 01.875rem;
  margin-top: 0;
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

  &:first-child {
    border-right: solid 1px #FFF;
  }
`;

export const TableCell = styled.td`
  padding: 0.8rem;
  font-size: 0.875rem;
`;

export const BackButton = styled.button`
  background: #d63031;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
  transition: background 0.2s;

  &:hover {
    background: #b71c1c;
  }
`;

export const ChartContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: flex-start;
  justify-content: space-between;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  width: 100%;
  margin-bottom: 20px;
`;

export const ChartTitle = styled.h3`
  font-size: 1rem;
  text-align: center;
  margin-bottom: 2rem;
  color: #2d3436;
`;

export const LegendContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const LegendColor = styled.div`
  min-width: 1rem;
  width: 1rem;
  height: 1rem;
  background-color: ${(props) => props.color};
  margin-right: 16px;
  border-radius: 100%;
`;

export const LegendText = styled.span`
  font-size: 0.75rem;
  color: #333;
`;

export const RoundInfoContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
`;

export const RoundInfoItem = styled.div`
  font-size: 1rem;
  background: #f5f5f5;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  font-weight: bold;
`;

export const ProfessorsListContainer = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
`;

export const ProfessorItem = styled.p`
  font-size: 0.9rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;

  &:last-child {
    border-bottom: none;
  }
`;

export const ProfessorActions = styled.div`
  margin-left: 10px;
  display: inline-block;
`;
