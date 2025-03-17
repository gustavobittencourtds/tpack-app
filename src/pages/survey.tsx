import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import styles from '../styles/surveyStyles.module.css';
import { Question } from '../types';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const FeatherIcon = dynamic(() => import('feather-icons-react'), { ssr: false });

const Survey: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sessions, setSessions] = useState<{ [key: string]: Question[] }>({});
  const [sessionTitles, setSessionTitles] = useState<{ [key: string]: string }>({});
  const [intro, setIntro] = useState<Question | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [answers, setAnswers] = useState<{ [questionId: string]: string | string[] }>({});
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [activelyAnswered, setActivelyAnswered] = useState<{ [questionId: string]: boolean }>({});
  const [highestVisitedIndex, setHighestVisitedIndex] = useState(-1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado para controlar a visibilidade da sidebar

  const router = useRouter();
  const { token, professorEmail } = router.query;

  const currentQuestionRef = useRef<HTMLDivElement | null>(null);
  const activeSidebarButtonRef = useRef<HTMLButtonElement | null>(null);

  const decodedToken = token ? jwt.decode(token as string) as { userId: string; questionnaireId: string } : null;
  const questionnaireId = decodedToken?.questionnaireId;

  useEffect(() => {
    if (currentQuestionRef.current) {
      currentQuestionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (activeSidebarButtonRef.current) {
      activeSidebarButtonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    const fetchQuestionsAndSessions = async () => {
      try {
        const questionsResponse = await fetch(`/api/questions?token=${token}`);
        if (!questionsResponse.ok) {
          const errorData = await questionsResponse.json();
          setError(errorData.message || 'Erro ao buscar o questionário.');
          return;
        }
        const questionsData = await questionsResponse.json();

        const sessionsResponse = await fetch('/api/sessions');
        if (!sessionsResponse.ok) {
          setError('Erro ao buscar as sessões.');
          return;
        }
        const sessionsData = await sessionsResponse.json();

        const titlesMap = sessionsData.reduce((acc: { [key: string]: string }, session: any) => {
          acc[session._id] = session.title;
          return acc;
        }, {});

        const introQuestion = questionsData.find((q: any) => q.type === 'intro') || null;
        const validQuestions = questionsData.filter(
          (q: any) =>
            q.type !== 'intro' &&
            (q.type !== 'multiple_choice' || (q.choices && q.choices.length > 0))
        );

        const initialAnswers = validQuestions.reduce((acc: { [key: string]: string | string[] }, question: Question) => {
          if (question.type === 'scale') {
            acc[question._id] = '3';
          }
          return acc;
        }, {});

        const groupedSessions: { [key: string]: Question[] } = validQuestions.reduce((acc: { [key: string]: Question[] }, question: Question) => {
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
        setAnswers(initialAnswers);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Erro ao buscar o questionário. Tente novamente mais tarde.');
      }
    };

    if (token) fetchQuestionsAndSessions();
  }, [token]);

  const handleAnswerChange = (value: string | string[]) => {
    const questionId = questions[currentQuestionIndex]?._id;
    if (questionId) {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
      setActivelyAnswered((prev) => ({ ...prev, [questionId]: true }));
    }
  };

  const isQuestionAnswered = (index: number) => {
    const questionId = questions[index]?._id;
    if (!questionId) return false;

    const question = questions[index];
    if (question.text.includes("comentário")) {
      return true;
    }

    return answers[questionId] && answers[questionId].length > 0;
  };

  const handleNext = () => {
    if (isQuestionAnswered(currentQuestionIndex)) {
      setCurrentQuestionIndex((prev) => {
        const newIndex = prev + 1;
        setHighestVisitedIndex((prevHighest) => Math.max(prevHighest, newIndex));
        return newIndex;
      });
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
        body: JSON.stringify({
          questionnaireId: questionnaireId,
          answers: answers,
        }),
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

      const professorEmail = data.professorEmail;

      const requestBody = {
        to: professorEmail,
        questionnaireId,
      };
      console.log('Enviando requisição POST para /api/sendConfirmationEmail com corpo:', requestBody);

      const confirmationResponse = await fetch('/api/sendConfirmationEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!confirmationResponse.ok) {
        throw new Error('Erro ao enviar e-mail de confirmação.');
      }

      console.log('E-mail de confirmação enviado com sucesso');
    } catch (error) {
      console.error('Erro ao enviar respostas:', error);
    }
  };

  const currentQuestion = questions[currentQuestionIndex] || null;
  const progress = currentQuestionIndex >= 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const handleQuestionSelect = (index: number) => {
    if (index <= highestVisitedIndex) {
      setCurrentQuestionIndex(index);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.surveyContainer}>
      {isCompleted ? (
        <div className={styles.surveyWarning}>
          <Image src="/images/logo.svg" alt="TPACK App" width={65} height={65} style={{ borderRadius: '16px', marginBottom: '2rem' }} />
          <p style={{ fontSize: '1.25rem', color: '#2d3436', marginBottom: '1rem' }}>
            Questionário enviado com sucesso!
          </p>
          <p style={{ fontSize: '1.25rem', color: '#2d3436', marginBottom: '1rem' }}>
            Você receberá um e-mail de confirmação em breve.
          </p>
          <p style={{ fontSize: '1.25rem', color: '#2d3436', marginBottom: '1rem' }}>
            Agradecemos por sua participação!
          </p>
        </div>
      ) : (
        <>
          {/* Botão flutuante para abrir/fechar a sidebar */}
          <button
            className={styles.hamburgerButton}
            onClick={toggleSidebar}
            aria-label="Menu"
          >
            <FeatherIcon icon={isSidebarOpen ? "x" : "menu"} size={24} />
          </button>

          {/* Overlay para fechar a sidebar ao clicar fora */}
          {isSidebarOpen && (
            <div className={styles.mobileOverlay} onClick={toggleSidebar} />
          )}

          {/* Sidebar - condicionalmente renderizada com base no estado isSidebarOpen */}
          <div className={`${styles.sidebarContainer} ${isSidebarOpen ? styles.mobileMenuOpen : ''}`}>
            <h4>Navegação</h4>
            {Object.entries(sessions).map(([sessionId, sessionQuestions]) => (
              <div key={sessionId}>
                <h5 style={{ margin: '1rem 0 0.5rem', color: '#6c5ce7', padding: '0.75rem', fontSize: '1rem', fontWeight: '600', backgroundColor: 'rgba(108, 92, 231, 0.1)', borderRadius: '12px' }}>
                  {sessionTitles[sessionId] || `Sessão ${sessionId}`}
                </h5>
                <ul>
                  {sessionQuestions.map((q, index) => {
                    const isActive = questions.indexOf(q) === currentQuestionIndex;
                    return (
                      <li key={q._id}>
                        <button
                          ref={isActive ? activeSidebarButtonRef : null}
                          className={`${styles.sidebarButton} ${isActive ? styles.isActive : ''} ${isQuestionAnswered(questions.indexOf(q)) ? styles.isAnswered : ''}`}
                          onClick={() => handleQuestionSelect(questions.indexOf(q))}
                          disabled={questions.indexOf(q) > highestVisitedIndex}
                          title={q.text}
                        >
                          {q.text}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }}>
            <Image src="/images/logo.svg" alt="Tpack App Logo" width={60} height={60} style={{ display: 'block', borderRadius: '16px', margin: '0 auto 2rem' }} />
            <div className={styles.progressContainer}>
              <div className={styles.progressBar} style={{ '--progress': `${progress}%` } as React.CSSProperties} />
              <p>{`Progresso: ${currentQuestionIndex + 1}/${questions.length}`}</p>
            </div>

            {currentQuestionIndex === -1 && intro && (
              <div className={styles.introContainer}>
                <h2>Bem-vindo ao Questionário</h2>
                <p dangerouslySetInnerHTML={{ __html: intro.text.replace(/<br \/>/g, '<br />') }} />
                {intro.note && <p className={styles.note}>{intro.note}</p>}
                <button
                  className={`${styles.navigationButton} ${styles.startButton}`}
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setHighestVisitedIndex(0);
                  }}
                >
                  Começar
                </button>
              </div>
            )}

            {currentQuestion && (
              <div ref={currentQuestionRef} className={styles.questionContainer}>
                <h3 className={styles.questionText}>{currentQuestion.text}</h3>
                {currentQuestion.note && <p className={styles.note}>{currentQuestion.note}</p>}

                {currentQuestion.type === 'multiple_choice' && currentQuestion.choices && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: currentQuestion.choices.length > 4 ? '1fr 1fr' : '1fr',
                      gap: '0.75rem',
                    }}
                  >
                    {currentQuestion.choices.map((choice) => (
                      <label
                        key={choice._id}
                        className={`${styles.choiceLabel} ${(answers[currentQuestion._id] as string[])?.includes(choice._id) ? styles.isSelected : ''}`}
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
                      </label>
                    ))}
                  </div>
                )}

                {currentQuestion.type === 'single_choice' && currentQuestion.choices && (
                  <div>
                    {currentQuestion.choices.map((choice) => (
                      <label
                        key={choice._id}
                        className={`${styles.choiceLabel} ${answers[currentQuestion._id] === choice.text ? styles.isSelected : ''}`}
                      >
                        <input
                          type="radio"
                          name={currentQuestion._id}
                          value={choice.text}
                          checked={answers[currentQuestion._id] === choice.text}
                          onChange={() => handleAnswerChange(choice.text)}
                        />
                        {choice.text}
                      </label>
                    ))}
                  </div>
                )}

                {currentQuestion.type === 'text' ? (
                  <textarea
                    className={styles.inputField}
                    value={answers[currentQuestion._id] || ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                  />
                ) : currentQuestion.type === 'scale' && (
                  <div style={{ position: 'relative' }}>
                    <input
                      className={styles.rangeInput}
                      type="range"
                      min="1"
                      max="5"
                      step={0.1}
                      value={answers[currentQuestion._id] || '3'}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                    />
                    <div
                      className={styles.scaleValue}
                      style={{
                        left: `calc(${(Number(answers[currentQuestion._id]) || 3) - 1} / 4 * 100% - 10px)`,
                      }}
                    >
                      {answers[currentQuestion._id] || '3'}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!isCompleted && currentQuestionIndex !== -1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button
                  className={`${styles.navigationButton} ${styles.backButton}`}
                  onClick={handleBack}
                  disabled={currentQuestionIndex === -1}
                >
                  {currentQuestionIndex === 0 ? 'Voltar à Introdução' : 'Voltar'}
                </button>

                {currentQuestionIndex !== questions.length - 1 && (
                  <button
                    className={styles.navigationButton}
                    onClick={handleNext}
                    disabled={!isQuestionAnswered(currentQuestionIndex)}
                  >
                    Próximo
                  </button>
                )}

                {currentQuestionIndex === questions.length - 1 && (
                  <button className={`${styles.navigationButton} ${styles.submitButton}`} onClick={handleSubmit}>
                    Enviar Respostas
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Survey;