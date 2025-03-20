import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PieChart } from "@mui/x-charts/PieChart";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import styles from "../styles/roundStyles.module.css";
import ProtectedRoute from "../components/ProtectedRoute";
import Breadcrumbs from "../components/Breadcrumbs";
import dynamic from "next/dynamic";

const FeatherIcon = dynamic(() => import("feather-icons-react"), { ssr: false });

interface Answer {
  questionId: string;
  answer: string;
  userId: string;
}

interface Questionnaire {
  _id: string;
  title: string;
  completed: boolean;
  sentDate: string;
  responseDate?: string;
  userId: string;
  roundId: string;
  professorId: string;
}

interface Round {
  _id: string;
  roundNumber: number;
  sentDate: string;
}

interface Question {
  _id: string;
  text: string;
  session_id: string;
}

interface Session {
  _id: string;
  title: string;
}

interface Professor {
  _id: string;
  email: string;
  userId: string;
}

interface SessionAverage {
  sessionId: string;
  questionAverages: { questionId: string; average: number; stdDeviation: number }[];
}

const theme = createTheme({
  typography: {
    fontFamily: "Inter, sans-serif",
  },
});

export default function RoundPage() {
  const router = useRouter();
  const { roundId } = router.query;

  const [round, setRound] = useState<Round | null>(null);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionAverages, setSessionAverages] = useState<SessionAverage[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(false);
  const [visibleActions, setVisibleActions] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);


  useEffect(() => {
    if (!roundId) return;

    const fetchRoundData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token não encontrado");
        }

        const res = await fetch(`/api/report?roundId=${roundId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Erro ao buscar relatório: ${res.statusText}`);
        }

        const data = await res.json();
        
        console.log("Dados da rodada:", data);

        setQuestionnaires(data.questionnaires || []);
        setAnswers(data.answers || []);
        setQuestions(data.questions || []);
        setSessions(data.sessions || []);
        setSessionAverages(data.sessionAverages || []);
        setRound(data.round || null);

        if (data.questionnaires && data.questionnaires.length > 0) {
          const professorIds = [...new Set(data.questionnaires.map((q: { professorId: string }) => q.professorId))];
          if (professorIds.length > 0) {
            const profRes = await fetch(`/api/professors?professorIds=${professorIds.join(",")}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const profData = await profRes.json();
            setProfessors(profData.professors || []);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados da rodada:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoundData();
  }, [roundId]);

  const handleToggleActions = (professorId: string) => {
    setVisibleActions(visibleActions === professorId ? null : professorId);
  };

  const handleResendQuestionnaire = async (professorId: string, questionnaireId?: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token não encontrado");
      }

      const res = await fetch("/api/resendQuestionnaire", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          professorId,
          roundId,
          questionnaireId,
        }),
      });

      if (!res.ok) {
        throw new Error(`Erro ao reenviar questionário: ${res.statusText}`);
      }

      const data = await res.json();

      // Atualiza o estado local para refletir o novo questionário
      if (questionnaireId) {
        // Remove o questionário antigo
        setQuestionnaires((prev) => prev.filter((q) => q._id !== questionnaireId));
      }

      // Adiciona o novo questionário ao estado
      setQuestionnaires((prev) => [...prev, data.newQuestionnaire]);

      setMessage("Questionário reenviado com sucesso!");
    } catch (error) {
      console.error("Erro ao reenviar questionário:", error);
      setMessage("Erro ao reenviar questionário.");
    }
  };

  // Efeito para remover a mensagem após 3 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <ProtectedRoute>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={styles.roundContainer}>
          <Breadcrumbs title="Relatórios" />

          {loading && <p>Carregando...</p>}

          <button className={styles.backButton} onClick={() => router.push("/admin")}>
            Voltar
          </button>

          {round && (
            <>
              <h1 className={styles.roundHeader}>Rodada {round.roundNumber}</h1>

              <div className={styles.roundInfoContainer}>
                <div className={styles.roundInfoItem}>
                  <strong>Criação da rodada:</strong> {new Date(round.sentDate).toLocaleDateString("pt-BR")}
                </div>
                <div className={styles.roundInfoItem}>
                  <strong>Professores participantes:</strong> {professors.length}
                </div>
              </div>

              {message && (
                <p
                  style={{
                    color: message.includes('Erro') ? '#e74c3c' : '#00b894',
                    textAlign: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  {message}
                </p>
              )}

              <div className={styles.professorListContainer}>
                {/* Lista para Mobile */}
                {professors.map((professor) => {
                  const professorQuestionnaire = questionnaires.find(
                    (q) => q.professorId === professor._id && q.roundId === roundId
                  );

                  return (
                    <div key={professor._id} className={styles.professorItem}>
                      <span className={styles.professorEmail}>{professor.email}</span>
                      <button
                        className={styles.toggleActions}
                        onClick={() => handleToggleActions(professor._id)}
                      >
                        <FeatherIcon icon="more-vertical" size={18} />
                      </button>
                      <div
                        className={`${styles.actionsBox} ${visibleActions === professor._id ? styles.visible : ''}`}
                      >
                        <span className={styles.actionText}>
                          <strong>Data de Resposta:</strong>{" "}
                          {professorQuestionnaire?.responseDate
                            ? new Date(professorQuestionnaire.responseDate).toLocaleDateString("pt-BR")
                            : "Pendente"}
                        </span>
                        <button
                          className={styles.viewAnswersButton}
                          onClick={() => {
                            if (!professorQuestionnaire) return;
                            router.push(
                              `/respostas?questionnaireId=${professorQuestionnaire._id}&professorId=${professor._id}&roundId=${roundId}`
                            );
                          }}
                          disabled={!professorQuestionnaire || !professorQuestionnaire.responseDate}
                        >
                          <FeatherIcon icon="file-text" size={20} />
                          Respostas
                        </button>

                        <button
                          aria-label="Reenviar Questionário"
                          className={styles.resendButton}
                          onClick={() => handleResendQuestionnaire(professor._id, professorQuestionnaire?._id)}
                        >
                          <FeatherIcon icon="rotate-cw" size={18} />

                          Reenviar
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Tabela para Desktop */}
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.tableRow}>
                      <th className={styles.tableHeader}>Professor</th>
                      <th className={styles.tableHeader}>Respondido em</th>
                      <th className={styles.tableHeader}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {professors.map((professor) => {
                      const professorQuestionnaire = questionnaires.find(
                        (q) => q.professorId === professor._id && q.roundId === roundId
                      );

                      return (
                        <tr key={professor._id} className={styles.tableRow}>
                          <td className={styles.tableCell}>{professor.email}</td>
                          <td className={styles.tableCell}>
                            {professorQuestionnaire?.responseDate
                              ? new Date(professorQuestionnaire.responseDate).toLocaleDateString("pt-BR")
                              : "Pendente"}
                          </td>
                          <td className={styles.tableCell}>
                            <button
                              className={styles.viewAnswersButton}
                              onClick={() => {
                                if (!professorQuestionnaire) return;
                                router.push(
                                  `/respostas?questionnaireId=${professorQuestionnaire._id}&professorId=${professor._id}&roundId=${roundId}`
                                );
                              }}
                              disabled={!professorQuestionnaire || !professorQuestionnaire.responseDate}
                            >
                              <FeatherIcon icon="file-text" size={20} />
                              Respostas
                            </button>

                            <button
                              className={styles.resendButton}
                              onClick={() => handleResendQuestionnaire(professor._id, professorQuestionnaire?._id)}
                            >
                              <FeatherIcon icon="rotate-cw" size={18} />

                              Reenviar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {sessionAverages.length > 0 && sessions.length > 0 && (
            sessionAverages.map(({ sessionId, questionAverages }) => {
              const sessionTitle = sessions.find((s) => s._id === sessionId)?.title || "Sessão desconhecida";
              const pieChartData = questionAverages.map((qa, index) => ({
                id: qa.questionId,
                value: qa.average,
                label: questions.find((q) => q._id === qa.questionId)?.text || "Questão desconhecida",
              }));

              return (
                <div key={sessionId} className={styles.chartContainer}>
                  <PieChart
                    series={[
                      {
                        data: pieChartData,
                        innerRadius: 40,
                        arcLabel: (item) => `${item.value.toFixed(2)}`,
                      },
                    ]}
                    height={320}
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    slotProps={{
                      legend: {
                        hidden: true,
                      },
                      popper: {
                        sx: {
                          fontSize: '0.875rem',
                          maxWidth: '48rem',
                          '& .MuiChartsTooltip-mark': {
                            width: '1rem',
                            height: '1rem',
                            marginRight: '0.5rem',
                          },
                          '& .MuiChartsTooltip-cell:last-of-type': {
                            fontSize: '1rem',
                            fontWeight: 700,
                          },
                        }
                      },
                    }}
                    sx={{ 
                      "& .MuiPieArcLabel-root": { fill: '#FFFFFF', fontSize: '16px', fontWeight: 'bold' },
                     }}
                  />
                  <div className={styles.legendContainer}>
                    <h3 className={styles.chartTitle}>{sessionTitle}</h3>
                    {pieChartData.map((item, index) => {
                      const colors = ["#02B2AF", "#2E96FF", "#B800D8", "#60009B"];
                      const color = colors[index % colors.length];
                      const questionAverage = questionAverages.find((qa) => qa.questionId === item.id);

                      return (
                        <div key={index} className={styles.legendItem}>
                          <div className={styles.legendColor} style={{ backgroundColor: color }} />
                          <div className={styles.legendText}>
                            <p className={styles.question}>{item.label}:</p>
                            <p className={styles.average}>Média: <strong>{item.value.toFixed(2)}</strong></p>
                            <p className={styles.stdDeviation}>
                              Desvio Padrão: <strong>{questionAverage?.stdDeviation.toFixed(2)}</strong>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ThemeProvider>
    </ProtectedRoute>
  );
}