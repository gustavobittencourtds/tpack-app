import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(0.95); }
  50% { transform: scale(1.05); }
  100% { transform: scale(0.95); }
`;

export const SurveyContainer = styled.div`
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
  display: flex;
  gap: 2rem;

  @media (prefers-color-scheme: dark) {
    background: rgba(30, 30, 30, 0.95);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

export const IntroContainer = styled.div`
  text-align: center;
  padding: 2rem;
  border-radius: 16px;
  background: linear-gradient(135deg, #f8f9fa, #ffffff);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.6s ease-out;

  h2 {
    font-size: 2rem;
    color: #2d3436;
    margin-bottom: 1rem;
    font-weight: 700;
    letter-spacing: -0.5px;
  }

  p {
    font-size: 1.1rem;
    color: #636e72;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto;
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, #2d3436, #2b2b2b);
    h2 { color: #ffffff; }
    p { color: #dfe6e9; }
  }
`;

export const SidebarContainer = styled.div`
  width: 280px;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.6s ease-out;

  h4 {
    font-size: 1.25rem;
    color: #2d3436;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 0.75rem;
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(40, 40, 40, 0.9);
    border-color: rgba(255, 255, 255, 0.1);

    h4 {
      color: #ffffff;
    }
  }
`;

export const SidebarButton = styled.button<{ isActive: boolean; isAnswered: boolean }>`
  width: 100%;
  padding: 0.75rem;
  background: ${({ isActive, isAnswered }) =>
    isActive ? '#6c5ce7' : isAnswered ? 'rgba(108, 92, 231, 0.1)' : 'rgba(0, 0, 0, 0.03)'};
  color: ${({ isActive }) => (isActive ? '#fff' : '#2d3436')};
  border: none;
  border-radius: 12px;
  font-weight: 500;
  cursor: ${({ isAnswered }) => (isAnswered ? 'pointer' : 'not-allowed')};
  transition: all 0.3s ease;
  text-align: left;

  &:hover {
    transform: ${({ isAnswered }) => (isAnswered ? 'translateY(-2px)' : 'none')};
    box-shadow: ${({ isAnswered }) =>
    isAnswered ? '0 4px 12px rgba(0, 0, 0, 0.08)' : 'none'};
  }

  @media (prefers-color-scheme: dark) {
    color: ${({ isActive }) => (isActive ? '#fff' : '#dfe6e9')};
    background: ${({ isActive, isAnswered }) =>
    isActive ? '#6c5ce7' : isAnswered ? 'rgba(108, 92, 231, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  }
`;

export const ProgressContainer = styled.div`
  position: sticky;
  top: 1rem;
  z-index: 10;
  margin-bottom: 2rem;

  p {
    text-align: center;
    color: #636e72;
    font-weight: 500;
    margin-top: 0.5rem;
  }
`;

export const ProgressBar = styled.div<{ progress: number }>`
  height: 12px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    height: 100%;
    width: ${(props) => props.progress}%;
    background: linear-gradient(90deg, #6c5ce7, #a66efa);
    border-radius: 8px;
    transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 2px 8px rgba(108, 92, 231, 0.3);
  }
`;

export const QuestionContainer = styled.div`
  flex: 1;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  animation: ${fadeIn} 0.4s ease-out;
  border: 1px solid rgba(0, 0, 0, 0.05);

  @media (prefers-color-scheme: dark) {
    background: rgba(40, 40, 40, 0.9);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

export const QuestionText = styled.h3`
  font-size: 1.5rem;
  color: #2d3436;
  margin-bottom: 1.5rem;
  font-weight: 700;
  line-height: 1.4;

  @media (prefers-color-scheme: dark) {
    color: #ffffff;
  }
`;

export const ChoiceLabel = styled.label<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.75rem;
  background: ${(props) =>
    props.isSelected ? 'rgba(108, 92, 231, 0.1)' : 'rgba(0, 0, 0, 0.03)'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${(props) => (props.isSelected ? '#6c5ce7' : 'transparent')};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  input {
    margin-right: 1rem;
    width: 20px;
    height: 20px;
    accent-color: #6c5ce7;
  }

  @media (prefers-color-scheme: dark) {
    background: ${(props) =>
    props.isSelected ? 'rgba(108, 92, 231, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  }
`;

export const InputField = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 1rem;
  color: #2d3436;
  transition: all 0.3s ease;

  &:focus {
    border-color: #6c5ce7;
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.2);
    outline: none;
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: #dfe6e9;

    &:focus {
      border-color: #6c5ce7;
    }
  }
`;

export const NavigationButton = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
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

export const SubmitButton = styled(NavigationButton)`
  background: linear-gradient(135deg, #00b894, #00cec9);
  box-shadow: 0 4px 6px rgba(0, 184, 148, 0.2);

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 184, 148, 0.3);
  }
`;

export const Note = styled.p`
  font-size: 0.9rem;
  color: #636e72;
  margin: 1rem 0;
  padding-left: 1rem;
  border-left: 3px solid #6c5ce7;

  @media (prefers-color-scheme: dark) {
    color: #b2bec3;
  }
`;

export const StyledRangeInput = styled.input.attrs({ type: 'range' })`
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  outline: none;
  -webkit-appearance: none;
  margin: 1.5rem 0;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    background: #6c5ce7;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(108, 92, 231, 0.3);
    transition: all 0.3s ease;
  }

  &::-moz-range-thumb {
    width: 24px;
    height: 24px;
    background: #6c5ce7;
    border-radius: 50%;
    cursor: pointer;
  }

  &:hover::-webkit-slider-thumb {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(108, 92, 231, 0.4);
  }
`;