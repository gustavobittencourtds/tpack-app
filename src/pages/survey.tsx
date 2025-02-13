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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
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
      } catch (err) {
        console.error('Erro ao buscar questões:', err);
        setError('Erro ao buscar o questionário. Tente novamente mais tarde.');
      }
    };

    if (token) fetchQuestions();
  }, [token]);

  if (error) return <SurveyContainer>{error}</SurveyContainer>;

  const handleAnswerChange = (value: string | string[]) => {
    const questionId = questions[currentQuestionIndex]?._id;
    if (questionId) {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    }
  };

  // Verifica se a questão foi respondida
  const isQuestionAnswered = (index: number) => {
    const questionId = questions[index]?._id;
    return questionId && answers[questionId] && answers[questionId].length > 0;
  };

  // O botão "Próximo" só avança se a questão atual tiver resposta
  const handleNext = () => {
    if (isQuestionAnswered(currentQuestionIndex)) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentQuestionIndex((prev) => (prev === 0 ? -1 : prev - 1));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers }),
      });

      if (response.status === 401) {
        throw new Error('Seu token expirou ou é inválido. Tente novamente.');
      }

      if (!response.ok) {
        throw new Error('Ocorreu um erro ao enviar suas respostas.');
      }

      const data = await response.json();
      console.log('Respostas enviadas com sucesso:', data);
      alert('Questionário finalizado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar respostas:', error);
    }
  };

  const currentQuestion = questions[currentQuestionIndex] || null;
  const progress = currentQuestionIndex >= 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const handleQuestionSelect = (index: number) => {
    // O usuário só pode clicar na próxima questão se todas as anteriores forem respondidas
    const allPreviousAnswered = questions
      .slice(0, index)
      .every((_, i) => isQuestionAnswered(i));

    if (allPreviousAnswered) {
      setCurrentQuestionIndex(index);
    }
  };

  return (
    <SurveyContainer>
      <div style={{ display: 'flex' }}>
        {/* Barra lateral de navegação */}
        <div style={{ width: '250px', padding: '10px', borderRight: '1px solid #ddd' }}>
          <h4>Navegação</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {questions.map((q, index) => (
              <li key={q._id} style={{ marginBottom: '5px' }}>
                <button
                  onClick={() => handleQuestionSelect(index)}
                  disabled={!questions.slice(0, index).every((_, i) => isQuestionAnswered(i))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: index === currentQuestionIndex ? '#0070f3' : '#f0f0f0',
                    color: index === currentQuestionIndex ? '#fff' : '#000',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: questions.slice(0, index).every((_, i) => isQuestionAnswered(i))
                      ? 'pointer'
                      : 'not-allowed',
                  }}
                >
                  Pergunta {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Área do questionário */}
        <div style={{ flex: 1, padding: '20px' }}>
          <ProgressContainer>
            <ProgressBar progress={progress} />
            <p>{`Progresso: ${currentQuestionIndex + 1}/${questions.length}`}</p>
          </ProgressContainer>

          {/* Exibir introdução antes do questionário começar */}
          {currentQuestionIndex === -1 && intro && (
            <IntroContainer>
              <h2>Bem-vindo ao Questionário</h2>
              <p dangerouslySetInnerHTML={{ __html: intro.text }} />
              {intro.note && <Note>{intro.note}</Note>}
              <NavigationButton onClick={() => setCurrentQuestionIndex(0)}>Começar</NavigationButton>
            </IntroContainer>
          )}

          {/* Exibir a pergunta atual e as opções de resposta */}
          {currentQuestion && (
            <QuestionContainer>
              <QuestionText>{currentQuestion.text}</QuestionText>
              {currentQuestion.note && <Note>{currentQuestion.note}</Note>}

              {/* Perguntas de múltipla escolha */}
              {currentQuestion.type === 'multiple_choice' && currentQuestion.choices && (
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

              {/* Perguntas de texto e número */}
              {['text', 'number'].includes(currentQuestion.type) && (
                <input
                  type={currentQuestion.type}
                  value={answers[currentQuestion._id] || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                />
              )}

              {/* Perguntas de escala */}
              {currentQuestion.type === 'scale' && (
                <input
                  type="range"
                  min="1"
                  max="5"
                  step={0.1}
                  value={answers[currentQuestion._id] || '3'}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                />
              )}
            </QuestionContainer>
          )}

          {/* Botões de navegação */}
          <div>
            <NavigationButton onClick={handleBack} disabled={currentQuestionIndex === -1}>
              {currentQuestionIndex === 0 ? 'Voltar à Introdução' : 'Voltar'}
            </NavigationButton>

            <NavigationButton onClick={handleNext} disabled={!isQuestionAnswered(currentQuestionIndex)}>
              Próximo
            </NavigationButton>

            {currentQuestionIndex === questions.length - 1 && (
              <SubmitButton onClick={handleSubmit}>Enviar Respostas</SubmitButton>
            )}
          </div>
        </div>
      </div>
    </SurveyContainer>
  );
};

export default Survey;
