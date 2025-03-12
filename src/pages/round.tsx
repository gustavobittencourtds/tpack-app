import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PieChart } from "@mui/x-charts/PieChart";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import styles from "../styles/roundStyles.module.css";
import ProtectedRoute from "../components/ProtectedRoute";
import Breadcrumbs from "../components/Breadcrumbs";

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
  professorId: string; // Adicionado professorId
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

  // Instead of fetching professors by userIds:
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

        // Get only the professors who have a questionnaire in this specific round
        if (data.questionnaires && data.questionnaires.length > 0) {
          // Get unique professorIds from the questionnaires of this round
          const professorIds = [...new Set(data.questionnaires.map((q: { professorId: string }) => q.professorId))];

          if (professorIds.length > 0) {
            const profRes = await fetch(`/api/professors?professorIds=${professorIds.join(",")}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const profData = await profRes.json();
            setProfessors(profData.professors || []);
          }
        }

        console.log("Dados da rodada:", data);
      } catch (error) {
        console.error("Erro ao buscar dados da rodada:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoundData();
  }, [roundId]);

  useEffect(() => {
    if (questionnaires.length > 0 && professors.length > 0) {
      console.log("Dados carregados:");
      console.log("Questionários:", questionnaires);
      console.log("Professores:", professors);

      questionnaires.forEach(q => {
        console.log(`Questionário ${q._id} associado ao usuário: ${q.userId}`);
        const professorMatch = professors.find(p => p.userId === q.userId);
        console.log("Professor correspondente:", professorMatch);
      });
    }
  }, [questionnaires, professors]);

  return (
    <ProtectedRoute>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={styles.roundContainer}>
          <Breadcrumbs title="Relatórios" />

          {loading && <p>Carregando...</p>}

          <button className={styles.backButton} onClick={() => router.push("/admin")}>Voltar</button>

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
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.tableRow}>
                      <th className={styles.tableHeader}>Professor</th>
                      <th className={styles.tableHeader}>Enviado em</th>
                      <th className={styles.tableHeader}>Respondido em</th>
                      <th className={styles.tableHeader}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {professors.map((professor) => {
                      console.log(`🔍 Verificando professor: ${professor.email} (professorId: ${professor._id}, userId: ${professor.userId})`);

                      // Filtra o questionário pelo professorId e roundId
                      const professorQuestionnaire = questionnaires.find(
                        (q) => q.professorId === professor._id && q.roundId === roundId
                      );

                      return (
                        <tr key={professor._id} className={styles.tableRow}>
                          <td className={styles.tableCell}>{professor.email}</td>
                          <td className={styles.tableCell}>
                            {professorQuestionnaire ? new Date(professorQuestionnaire.sentDate).toLocaleDateString("pt-BR") : "N/A"}
                          </td>
                          <td className={styles.tableCell}>
                            {professorQuestionnaire?.responseDate
                              ? new Date(professorQuestionnaire.responseDate).toLocaleDateString("pt-BR")
                              : "Pendente"}
                          </td>
                          <td className={styles.tableCell}>
                            <button
                              className={styles.viewAnswersButton}
                              onClick={() => {
                                if (!professorQuestionnaire) {
                                  console.log(`Não foi possível encontrar questionário para o professor ${professor.email} nesta rodada.`);
                                  return;
                                }
                                router.push(`/respostas?questionnaireId=${professorQuestionnaire._id}&professorId=${professor._id}&roundId=${roundId}`);
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
              const sessionTitle = sessions.find(s => s._id === sessionId)?.title || "Sessão desconhecida";
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
                    slotProps={{ legend: { hidden: true } }}
                  />
                  <div className={styles.legendContainer}>
                    <h3 className={styles.chartTitle}>{sessionTitle}</h3>
                    {pieChartData.map((item, index) => {
                      // Defina as cores fixas para as legendas
                      const colors = ["#02B2AF", "#2E96FF", "#B800D8", "#60009B"];
                      const color = colors[index % colors.length]; // Use o índice para selecionar a cor correta

                      return (
                        <div key={index} className={styles.legendItem}>
                          <div className={styles.legendColor} style={{ backgroundColor: color }} />
                          <span className={styles.legendText}>{item.label}: <strong>{item.value.toFixed(2)}</strong></span>
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