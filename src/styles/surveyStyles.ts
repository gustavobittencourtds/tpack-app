// src/styles/surveyStyles.ts
import styled from 'styled-components';

export const SurveyContainer = styled.div`
  font-family: 'Open Sans', sans-serif;
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

export const IntroContainer = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  text-align: left;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 15px;
  }

  p {
    font-size: 1rem;
    color: #555;
    line-height: 1.5;
  }

  a {
    color: #0070f3;
    text-decoration: underline;

    &:hover {
      color: #005bb5;
    }
  }
`;

export const ProgressContainer = styled.div`
  margin-bottom: 20px;

  p {
    text-align: center;
    margin-top: 5px;
    font-size: 0.9rem;
    color: #555;
  }
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
  font-size: 1.25rem;
  margin-bottom: 10px;
`;

export const ChoiceLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 1rem;

  input {
    margin-right: 10px;
  }
`;

export const NavigationButton = styled.button`
  padding: 10px 20px;
  margin: 5px;
  font-size: 16px;
  color: #ffffff;
  background-color: #0070f3;
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

export const Note = styled.p`
  font-size: 0.9rem;
  color: #777;
  margin-top: -10px;
  margin-bottom: 20px;
  font-style: italic;
`;

export const ContentWrapper = styled.div`
  display: flex;
  height: 100vh;
`;

export const SidebarContainer = styled.div`
  width: 80px;
  background: #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
`;

export const SidebarItem = styled.button<{ isActive: boolean; isAnswered: boolean }>`
  width: 50px;
  height: 50px;
  margin: 5px;
  border-radius: 50%;
  border: 2px solid ${({ isActive }) => (isActive ? '#0070f3' : '#ccc')};
  background-color: ${({ isAnswered }) => (isAnswered ? '#0070f3' : '#fff')};
  color: ${({ isAnswered }) => (isAnswered ? '#fff' : '#000')};
  font-size: 18px;
  font-weight: bold;
  cursor: ${({ isAnswered }) => (isAnswered ? 'pointer' : 'default')};
  transition: background 0.3s, border 0.3s;

  &:hover {
    background-color: ${({ isAnswered }) => (isAnswered ? '#005bb5' : '#fff')};
  }
`;
