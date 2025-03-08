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

        // Buscar professores pelos userIds dos questionários
        if (data.questionnaires && data.questionnaires.length > 0) {
          const userIds = [...new Set(data.questionnaires.map((q: { userId: string }) => q.userId))];

          if (userIds.length > 0) {
            // Aqui buscamos professores pela propriedade userId, não pelo _id
            const profRes = await fetch(`/api/professors?userIds=${userIds.join(",")}`, {
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

      // Verifique se os IDs estão corretamente associados
      questionnaires.forEach(q => {
        console.log(`Questionário ${q._id} associado ao usuário: ${q.userId}`);
        // Aqui buscamos o professor pelo userId do questionário
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

              {professors.map((professor) => (
                <div key={professor._id} style={{
                  padding: "10px",
                  margin: "5px 0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #eee"
                }}>
                  <span>{professor.email}</span>
                  <button
                    onClick={() => {
                      // Encontre o questionário para este professor usando o userId
                      const questionnaireId = questionnaires.find(q => q.userId === professor.userId)?._id;
                      if (questionnaireId) {
                        router.push(`/respostas?questionnaireId=${questionnaireId}&roundId=${roundId}`);
                      } else {
                        alert("Não foi possível encontrar o questionário para este professor.");
                      }
                    }}
                    style={{
                      backgroundColor: "#4682B4",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
                  >
                    Ver Respostas
                  </button>
                </div>
              ))}
            </>
          )}

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableRow}>
                  <th className={styles.tableHeader}>Questionário</th>
                  <th className={styles.tableHeader}>Enviado em</th>
                  <th className={styles.tableHeader}>Respondido em</th>
                </tr>
              </thead>
              <tbody>
                {questionnaires.map((q) => (
                  <tr key={q._id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{q.title}</td>
                    <td className={styles.tableCell}>{new Date(q.sentDate).toLocaleDateString("pt-BR")}</td>
                    <td className={styles.tableCell}>
                      {q.responseDate ? new Date(q.responseDate).toLocaleDateString("pt-BR") : "Pendente"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
                    {pieChartData.map((item, index) => (
                      <div key={index} className={styles.legendItem}>
                        <div className={styles.legendColor} style={{ backgroundColor: `hsl(${index * 30}, 70%, 50%)` }} />
                        <span className={styles.legendText}>{item.label}: <strong>{item.value.toFixed(2)}</strong></span>
                      </div>
                    ))}
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
