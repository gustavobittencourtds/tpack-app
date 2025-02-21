import styled from "styled-components";

export const RoundContainer = styled.div`
  max-width: 1100px;
  margin: auto;
  padding: 1.5rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  font-family: "Poppins", sans-serif;
`;

export const RoundHeader = styled.h1`
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
  text-align: center;
  margin-bottom: 1rem;
`;

export const RoundSubheader = styled.p`
  font-size: 1rem;
  text-align: center;
  color: #555;
  margin-bottom: 2rem;
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

export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const ChartContainer = styled.div`
  width: 100%;
  max-width: 400px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
`;

export const ChartTitle = styled.h3`
  font-size: 1rem;
  text-align: center;
  margin-bottom: 10px;
  color: #2d3436;
`;
