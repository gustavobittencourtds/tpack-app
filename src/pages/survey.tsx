import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  SurveyContainer,
  ProgressContainer,
  ProgressBar,
  QuestionContainer,
  QuestionText,
  ChoiceLabel,
  NavigationButton,
  SubmitButton,
  Note,
  IntroContainer,
} from '../styles/surveyStyles';
import { Question } from '../types';

const Survey: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [intro, setIntro] = useState<Question | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // -1 para exibir a introdução primeiro
  const [answers, setAnswers] = useState<{ [questionId: string]: string | string[] }>({});
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/api/questions?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
          console.error('Erro na resposta da API:', data);
          setError(data.message || 'Erro ao buscar o questionário.');
          return;
        }

        console.log('Dados recebidos do backend:', data);
        const introQuestion = data.find((q: any) => q.type === 'intro') || null;
        const validQuestions = data.filter(
          (q: any) =>
            q.type !== 'intro' &&
            (q.type !== 'multiple_choice' || (q.choices && q.choices.length > 0))
        );

        setIntro(introQuestion);
        setQuestions(validQuestions);

        if (validQuestions.length !== data.length) {
          console.warn('Algumas perguntas foram ignoradas por estarem incompletas.');
        }
      } catch (err) {
        console.error('Erro ao buscar questões:', err);
        setError('Erro ao buscar o questionário. Tente novamente mais tarde.');
      }
    };

    if (token) fetchQuestions();
  }, [token]);


  if (error) return <SurveyContainer>{error}</SurveyContainer>;

  const handleAnswerChange = (value: string | string[]) => {
    const questionId = questions[currentQuestionIndex]._id;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => setCurrentQuestionIndex((prev) => prev + 1);
  const handleBack = () => setCurrentQuestionIndex((prev) => (prev === 0 ? -1 : prev - 1));
  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (response.ok) {
        alert('Respostas enviadas com sucesso!');
        router.push('/thanks');
      } else {
        console.error('Erro ao enviar respostas:', await response.text());
      }
    } catch (err) {
      console.error('Erro ao enviar respostas:', err);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = currentQuestionIndex >= 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  // Tela de introdução
  if (currentQuestionIndex === -1 && intro) {
    return (
      <SurveyContainer>
        <IntroContainer>
          <h2>Bem-vindo ao Questionário</h2>
          <p dangerouslySetInnerHTML={{ __html: intro.text }} />
          {intro.note && <Note>{intro.note}</Note>}
        </IntroContainer>
        <NavigationButton onClick={() => setCurrentQuestionIndex(0)}>Começar</NavigationButton>
      </SurveyContainer>
    );
  }

  return (
    <SurveyContainer>
      <ProgressContainer>
        <ProgressBar progress={progress} />
        <p>{`Progresso: ${currentQuestionIndex + 1}/${questions.length}`}</p>
      </ProgressContainer>
      {currentQuestion && (
        <QuestionContainer>
          <QuestionText>{currentQuestion.text}</QuestionText>
          {currentQuestion.note && <Note>{currentQuestion.note}</Note>}
          {currentQuestion.type === 'multiple_choice' && currentQuestion.choices && currentQuestion.choices.length > 0 && (
            <div>
              {currentQuestion.choices.map((choice) => (
                <ChoiceLabel key={choice._id}>
                  <input
                    type="checkbox"
                    value={choice._id}
                    checked={(answers[currentQuestion._id] as string[])?.includes(choice._id)}
                    onChange={(e) => {
                      const value = e.target.checked
                        ? [...((answers[currentQuestion._id] as string[]) || []), choice._id]
                        : (answers[currentQuestion._id] as string[]).filter((id) => id !== choice._id);
                      handleAnswerChange(value);
                    }}
                  />
                  {choice.text}
                </ChoiceLabel>
              ))}
            </div>
          )}
          {['text', 'number'].includes(currentQuestion.type) && (
            <input
              type={currentQuestion.type}
              value={answers[currentQuestion._id] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
            />
          )}
          {currentQuestion.type === 'scale' && (
            <input
              type="range"
              min="1"
              max="5"
              value={answers[currentQuestion._id] || '3'}
              onChange={(e) => handleAnswerChange(e.target.value)}
            />
          )}
        </QuestionContainer>
      )}
      <div>
        <NavigationButton onClick={handleBack}>
          {currentQuestionIndex === 0 ? 'Voltar à Introdução' : 'Voltar'}
        </NavigationButton>
        {currentQuestionIndex < questions.length - 1 && (
          <NavigationButton
            onClick={handleNext}
            disabled={!answers[currentQuestion._id] || answers[currentQuestion._id].length === 0}
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
