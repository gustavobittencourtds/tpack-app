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
  questionAverages: { questionId: string; average: number }[];
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
  const [visibleActions, setVisibleActions] = useState<string | null>(null); // Controla a box flutuante

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
                  <strong>Data de Envio:</strong> {new Date(round.sentDate).toLocaleDateString("pt-BR")}
                </div>
                <div className={styles.roundInfoItem}>
                  <strong>Professores Respondentes:</strong> {professors.length}
                </div>
              </div>

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
                          Ver Respostas
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
                              Ver Respostas
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
                    series={[{ data: pieChartData, innerRadius: 40 }]}
                    height={320}
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    slotProps={{ legend: { hidden: true } }}
                  />
                  <div className={styles.legendContainer}>
                    <h3 className={styles.chartTitle}>{sessionTitle}</h3>
                    {pieChartData.map((item, index) => {
                      const colors = ["#02B2AF", "#2E96FF", "#B800D8", "#60009B"];
                      const color = colors[index % colors.length];

                      return (
                        <div key={index} className={styles.legendItem}>
                          <div className={styles.legendColor} style={{ backgroundColor: color }} />
                          <span className={styles.legendText}>
                            {item.label}: <strong>{item.value.toFixed(2)}</strong>
                          </span>
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