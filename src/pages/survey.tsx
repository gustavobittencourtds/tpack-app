import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import {
  SurveyContainer,
  SidebarContainer,
  SidebarButton,
  ProgressContainer,
  ProgressBar,
  QuestionContainer,
  QuestionText,
  ChoiceLabel,
  InputField,
  NavigationButton,
  SubmitButton,
  Note,
  IntroContainer,
  StyledRangeInput,
} from '../styles/surveyStyles';
import { Question } from '../types';

const Survey: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sessions, setSessions] = useState<{ [key: string]: Question[] }>({});
  const [sessionTitles, setSessionTitles] = useState<{ [key: string]: string }>({});
  const [intro, setIntro] = useState<Question | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [answers, setAnswers] = useState<{ [questionId: string]: string | string[] }>({});
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const router = useRouter();
  const { token } = router.query;

  // Decodifica o token para obter o questionnaireId
  const decodedToken = token ? jwt.decode(token as string) as { userId: string; questionnaireId: string } : null;
  const questionnaireId = decodedToken?.questionnaireId;

  useEffect(() => {
    const fetchQuestionsAndSessions = async () => {
      try {
        // Busca as perguntas
        const questionsResponse = await fetch(`/api/questions?token=${token}`);
        if (!questionsResponse.ok) {
          const errorData = await questionsResponse.json();
          console.error('Erro na resposta da API:', errorData);
          setError(errorData.message || 'Erro ao buscar o questionário.');
          return;
        }
        const questionsData = await questionsResponse.json();

        // Busca as sessões
        const sessionsResponse = await fetch('/api/sessions');
        if (!sessionsResponse.ok) {
          console.error('Erro ao buscar sessões:', sessionsResponse.statusText);
          setError('Erro ao buscar as sessões.');
          return;
        }
        const sessionsData = await sessionsResponse.json();

        // Mapeia os IDs das sessões para seus títulos
        const titlesMap = sessionsData.reduce((acc: { [key: string]: string }, session: any) => {
          acc[session._id] = session.title;
          return acc;
        }, {});

        // Processa as perguntas
        const introQuestion = questionsData.find((q: any) => q.type === 'intro') || null;
        const validQuestions = questionsData.filter(
          (q: any) =>
            q.type !== 'intro' &&
            (q.type !== 'multiple_choice' || (q.choices && q.choices.length > 0))
        );

        // Agrupaa as questões por sessão
        interface SessionMap {
          [key: string]: Question[];
        }

        const groupedSessions: SessionMap = validQuestions.reduce((acc: SessionMap, question: Question) => {
          const sessionId = question.session_id;
          if (!acc[sessionId]) {
            acc[sessionId] = [];
          }
          acc[sessionId].push(question);
          return acc;
        }, {});

        setIntro(introQuestion);
        setQuestions(validQuestions);
        setSessions(groupedSessions);
        setSessionTitles(titlesMap);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Erro ao buscar o questionário. Tente novamente mais tarde.');
      }
    };

    if (token) fetchQuestionsAndSessions();
  }, [token]);

  if (error) return <SurveyContainer>{error}</SurveyContainer>;

  const handleAnswerChange = (value: string | string[]) => {
    const questionId = questions[currentQuestionIndex]?._id;
    if (questionId) {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    }
  };

  const isQuestionAnswered = (index: number) => {
    const questionId = questions[index]?._id;
    if (questions[index].text.includes("comentário")) {
      return true; // Não é obrigatória
    }
    return questionId && answers[questionId] && answers[questionId].length > 0;
  };

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
          'Authorization': `Bearer ${token}`,
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
      setIsCompleted(true);

      // Redireciona para a tela de respostas com o questionnaireId
      router.push({
        pathname: '/respostas',
        query: { questionnaireId }, // Passa o questionnaireId na URL
      });
    } catch (error) {
      console.error('Erro ao enviar respostas:', error);
    }
  };

  const currentQuestion = questions[currentQuestionIndex] || null;
  const progress = currentQuestionIndex >= 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const handleQuestionSelect = (index: number) => {
    const allPreviousAnswered = questions
      .slice(0, index)
      .every((_, i) => isQuestionAnswered(i));

    if (allPreviousAnswered) {
      setCurrentQuestionIndex(index);
    }
  };

  return (
    <SurveyContainer>
      <SidebarContainer>
        <h4>Navegação</h4>
        {Object.entries(sessions).map(([sessionId, sessionQuestions]) => (
          <div key={sessionId}>
            <h5 style={{ margin: '1rem 0 0.5rem', color: '#6c5ce7', padding: '0.75rem', backgroundColor: 'rgba(108, 92, 231, 0.1)', borderRadius: '12px' }}>
              {sessionTitles[sessionId] || `Sessão ${sessionId}`}
            </h5>
            <ul>
              {sessionQuestions.map((q, index) => (
                <li key={q._id}>
                  <SidebarButton
                    onClick={() => handleQuestionSelect(questions.indexOf(q))}
                    disabled={!questions.slice(0, questions.indexOf(q)).every((_, i) => isQuestionAnswered(i))}
                    isActive={questions.indexOf(q) === currentQuestionIndex}
                    isAnswered={!!isQuestionAnswered(questions.indexOf(q))}
                    title={q.text}
                  >
                    {q.text.slice(0, 35)}... {/* Trecho da pergunta */}
                  </SidebarButton>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </SidebarContainer>

      <div style={{ flex: 1 }}>
        <ProgressContainer>
          <ProgressBar progress={progress} />
          <p>{`Progresso: ${currentQuestionIndex + 1}/${questions.length}`}</p>
        </ProgressContainer>

        {currentQuestionIndex === -1 && intro && (
          <IntroContainer>
            <h2>Bem-vindo ao Questionário</h2>
            <p dangerouslySetInnerHTML={{ __html: intro.text.replace(/<br \/>/g, '<br />') }} />
            {intro.note && <Note>{intro.note}</Note>}
            <NavigationButton className="start-button" onClick={() => setCurrentQuestionIndex(0)}>
              Começar
            </NavigationButton>
          </IntroContainer>
        )}

        {currentQuestion && (
          <QuestionContainer>
            <QuestionText>{currentQuestion.text}</QuestionText>
            {currentQuestion.note && <Note>{currentQuestion.note}</Note>}

            {currentQuestion.type === 'multiple_choice' && currentQuestion.choices && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: currentQuestion.choices.length > 4 ? '1fr 1fr' : '1fr',
                  gap: '0.75rem',
                }}
              >
                {currentQuestion.choices.map((choice) => (
                  <ChoiceLabel
                    key={choice._id}
                    isSelected={(answers[currentQuestion._id] as string[])?.includes(choice._id)}
                  >
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

            {currentQuestion.type === 'single_choice' && currentQuestion.choices && (
              <div>
                {currentQuestion.choices.map((choice) => (
                  <ChoiceLabel
                    key={choice._id}
                    isSelected={answers[currentQuestion._id] === choice.text}
                  >
                    <input
                      type="radio"
                      name={currentQuestion._id}
                      value={choice.text}
                      checked={answers[currentQuestion._id] === choice.text}
                      onChange={() => handleAnswerChange(choice.text)}
                    />
                    {choice.text}
                  </ChoiceLabel>
                ))}
              </div>
            )}

            {['text', 'number'].includes(currentQuestion.type) && (
              <InputField
                type={currentQuestion.type}
                value={answers[currentQuestion._id] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                style={
                  currentQuestion.type === 'number' && currentQuestion.text.includes('idade')
                    ? { width: '100px' }
                    : currentQuestion.type === 'number' && currentQuestion.text.includes('ano')
                      ? { width: '120px' }
                      : {}
                }
                min={
                  currentQuestion.type === 'number' && currentQuestion.text.includes('idade')
                    ? 18
                    : currentQuestion.type === 'number' && currentQuestion.text.includes('ano')
                      ? 1970
                      : undefined
                }
                max={
                  currentQuestion.type === 'number' && currentQuestion.text.includes('idade')
                    ? 100
                    : currentQuestion.type === 'number' && currentQuestion.text.includes('ano')
                      ? new Date().getFullYear()
                      : undefined
                }
              />
            )}

            {currentQuestion.type === 'scale' && (
              <div style={{ position: 'relative' }}>
                <StyledRangeInput
                  min="1"
                  max="5"
                  step={0.1}
                  value={answers[currentQuestion._id] || '3'}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    left: `calc(${(Number(answers[currentQuestion._id]) || 3) - 1} / 4 * 100% - 10px)`,
                    backgroundColor: '#6c5ce7',
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                  }}
                >
                  {answers[currentQuestion._id] || '3'}
                </div>
              </div>
            )}
          </QuestionContainer>
        )}

        {isCompleted && (
          <div
            style={{
              textAlign: 'center',
              marginTop: '2rem',
              padding: '2rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <p style={{ fontSize: '1.25rem', color: '#2d3436', marginBottom: '1rem' }}>
              Questionário enviado com sucesso! Redirecionando...
            </p>
          </div>
        )}

        {!isCompleted && currentQuestionIndex !== -1 && (
          <div>
            <NavigationButton className="back-button" onClick={handleBack} disabled={currentQuestionIndex === -1}>
              {currentQuestionIndex === 0 ? 'Voltar à Introdução' : 'Voltar'}
            </NavigationButton>

            {currentQuestionIndex !== questions.length - 1 && (
              <NavigationButton onClick={handleNext} disabled={!isQuestionAnswered(currentQuestionIndex)}>
                Próximo
              </NavigationButton>
            )}

            {currentQuestionIndex === questions.length - 1 && (
              <SubmitButton onClick={handleSubmit}>Enviar Respostas</SubmitButton>
            )}
          </div>
        )}
      </div>
    </SurveyContainer>
  );
};

export default Survey;