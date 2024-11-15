// src/pages/survey.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  SurveyContainer,
  QuestionContainer,
  ChoiceLabel,
  NavigationButton,
  SubmitButton,
  ProgressContainer,
  ProgressBar,
  QuestionText,
} from '../styles/surveyStyles';
import { Question } from '../types';

const Survey: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: string | string[] }>({});
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/api/questions?token=${token}`);
        if (response.status === 401) {
          setError('Este link expirou. Por favor, solicite um novo link para acessar o questionário.');
        } else {
          const data: Question[] = await response.json();
          setQuestions(data);
        }
      } catch (error) {
        console.error('Erro ao buscar questões:', error);
        setError('Erro ao buscar o questionário.');
      }
    };

    if (token) fetchQuestions();
  }, [token]);

  if (error) {
    return <SurveyContainer>{error}</SurveyContainer>;
  }

  const handleAnswerChange = (value: string | string[]) => {
    const questionId = questions[currentQuestionIndex]._id;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      if (response.ok) {
        alert('Respostas enviadas com sucesso!');
        router.push('/thanks');
      } else {
        console.error('Erro ao enviar respostas:', await response.text());
      }
    } catch (error) {
      console.error('Erro de rede ao enviar respostas:', error);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <SurveyContainer>
      <ProgressContainer>
        <ProgressBar progress={progress} />
        <p>{`Progresso: ${currentQuestionIndex + 1}/${questions.length}`}</p>
      </ProgressContainer>
      {currentQuestion && (
        <QuestionContainer>
          <QuestionText>{currentQuestion.text}</QuestionText>
          {currentQuestion.note && <p>{currentQuestion.note}</p>}
          {currentQuestion.type === 'multiple_choice' && currentQuestion.choices && (
            <div>
              {currentQuestion.choices.map((choice) => (
                <ChoiceLabel key={choice._id}>
                  <input
                    type="checkbox"
                    value={choice.text}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                  />
                  {choice.text}
                </ChoiceLabel>
              ))}
            </div>
          )}
          {['text', 'number'].includes(currentQuestion.type) && (
            <input
              type={currentQuestion.type}
              onChange={(e) => handleAnswerChange(e.target.value)}
            />
          )}
          {currentQuestion.type === 'scale' && (
            <input
              type="range"
              min="1"
              max="5"
              onChange={(e) => handleAnswerChange(e.target.value)}
            />
          )}
        </QuestionContainer>
      )}
      <div>
        {currentQuestionIndex > 0 && (
          <NavigationButton onClick={handleBack}>Voltar</NavigationButton>
        )}
        {currentQuestionIndex < questions.length - 1 && (
          <NavigationButton
            onClick={handleNext}
            disabled={!answers[currentQuestion._id]}
          >
            Próximo
          </NavigationButton>
        )}
        {currentQuestionIndex === questions.length - 1 && (
          <SubmitButton onClick={handleSubmit}>Enviar Respostas</SubmitButton>
        )}
      </div>
    </SurveyContainer>
  );
};

export default Survey;
