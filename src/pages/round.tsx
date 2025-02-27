import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PieChart } from "@mui/x-charts/PieChart";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import {
  RoundContainer,
  RoundHeader,
  RoundInfoContainer,
  RoundInfoItem,
  TableContainer,
  Table,
  TableRow,
  TableHeader,
  TableCell,
  BackButton,
  ChartContainer,
  ChartTitle,
  LegendContainer,
  LegendItem,
  LegendColor,
  LegendText,
  ProfessorsListContainer,
  ProfessorItem,
  ProfessorActions,
} from "../styles/roundStyles";
import ProtectedRoute from "../components/ProtectedRoute";

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
}

interface SessionAverage {
  sessionId: string;
  questionAverages: { questionId: string; average: number }[];
}

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, Arial, sans-serif",
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

        // Buscar professores que responderam
        const professorIds = [...new Set(data.answers.map((a: Answer) => a.userId))];

        if (professorIds.length > 0) {
          const profRes = await fetch(`/api/professors?ids=${professorIds.join(",")}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const profData = await profRes.json();
          setProfessors(profData.professors || []);
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

  return (
    <ProtectedRoute>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RoundContainer>
          {loading && <p>Carregando...</p>}

          <BackButton onClick={() => router.push("/admin")}>Voltar</BackButton>

          {round && (
            <>
              <RoundHeader>Rodada {round.roundNumber}</RoundHeader>

              <RoundInfoContainer>
                <RoundInfoItem>
                  <strong>Data de Envio:</strong> {new Date(round.sentDate).toLocaleDateString("pt-BR")}
                </RoundInfoItem>
                <RoundInfoItem>
                  <strong>Professores Respondentes:</strong> {professors.length}
                </RoundInfoItem>
              </RoundInfoContainer>

              {professors.length > 0 && (
                <ProfessorsListContainer>
                  <strong>Professores que responderam:</strong>
                  {professors.map((professor) => {
                    const professorQuestionnaire = questionnaires.find(q => q.userId === professor._id);

                    return (
                      <ProfessorItem key={professor._id}>
                        {professor.email}
                        {professorQuestionnaire && (
                          <ProfessorActions>
                            <button onClick={() => router.push(`/respostas?questionnaireId=${professorQuestionnaire._id}`)}>
                              Ver Respostas
                            </button>
                          </ProfessorActions>
                        )}
                      </ProfessorItem>
                    );
                  })}
                </ProfessorsListContainer>
              )}
            </>
          )}

          <TableContainer>
            <Table>
              <thead>
                <TableRow>
                  <TableHeader>Questionário</TableHeader>
                  <TableHeader>Enviado em</TableHeader>
                  <TableHeader>Respondido em</TableHeader>
                </TableRow>
              </thead>
              <tbody>
                {questionnaires.map((q) => (
                  <TableRow key={q._id}>
                    <TableCell>{q.title}</TableCell>
                    <TableCell>{new Date(q.sentDate).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>
                      {q.responseDate ? new Date(q.responseDate).toLocaleDateString("pt-BR") : "Pendente"}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableContainer>

          {sessionAverages.length > 0 && sessions.length > 0 && (
            sessionAverages.map(({ sessionId, questionAverages }) => {
              const sessionTitle = sessions.find(s => s._id === sessionId)?.title || "Sessão desconhecida";
              const pieChartData = questionAverages.map((qa, index) => ({
                id: qa.questionId,
                value: qa.average,
                label: questions.find((q) => q._id === qa.questionId)?.text || "Questão desconhecida",
              }));

              return (
                <ChartContainer key={sessionId}>
                  <PieChart
                    series={[{ data: pieChartData, innerRadius: 40 }]}
                    height={320}
                    slotProps={{ legend: { hidden: true } }}
                  />
                  <LegendContainer>
                    <ChartTitle>{sessionTitle}</ChartTitle>
                    {pieChartData.map((item, index) => (
                      <LegendItem key={index}>
                        <LegendColor color={`hsl(${index * 30}, 70%, 50%)`} />
                        <LegendText>{item.label}: <strong>{item.value.toFixed(2)}</strong></LegendText>
                      </LegendItem>
                    ))}
                  </LegendContainer>
                </ChartContainer>
              );
            })
          )}
        </RoundContainer>
      </ThemeProvider>
    </ProtectedRoute>
  );
}
