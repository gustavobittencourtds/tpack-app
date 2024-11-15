// src/styles/surveyStyles.ts
import styled from 'styled-components';

export const SurveyContainer = styled.div`
  font-family: 'Open Sans', sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fefefe;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

export const ProgressContainer = styled.div`
  margin-bottom: 20px;
`;

export const ProgressBar = styled.div<{ progress: number }>`
  height: 10px;
  width: 100%;
  background-color: #ddd;
  border-radius: 5px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${(props) => props.progress}%;
    background-color: #0070f3;
    transition: width 0.3s ease-in-out;
  }
`;

export const QuestionContainer = styled.div`
  margin-bottom: 20px;
`;

export const QuestionText = styled.h3`
  margin-bottom: 10px;
`;

export const ChoiceLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  input {
    margin-right: 10px;
  }
`;

export const NavigationButton = styled.button`
  padding: 10px 20px;
  margin: 5px;
  font-size: 16px;
  background-color: #0070f3;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #005bb5;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const SubmitButton = styled(NavigationButton)`
  background-color: #28a745;

  &:hover {
    background-color: #218838;
  }
`;
