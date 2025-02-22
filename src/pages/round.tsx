import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {
  RoundContainer,
  RoundHeader,
  RoundSubheader,
  TableContainer,
  Table,
  TableRow,
  TableHeader,
  TableCell,
  BackButton,
  ChartContainer,
  ChartTitle,
} from "../styles/roundStyles";

interface Answer {
  questionId: string;
  answer: string;
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

interface SessionAverage {
  sessionId: string;
  questionAverages: { questionId: string; average: number }[];
}

ChartJS.register(ArcElement, Tooltip, Legend);

export default function RoundPage() {
  const router = useRouter();
  const { roundId } = router.query;

  const [round, setRound] = useState<Round | null>(null);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionAverages, setSessionAverages] = useState<SessionAverage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!roundId) return;

    const fetchRoundData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/report?roundId=${roundId}`);
        const data = await res.json();
        setQuestionnaires(data.questionnaires);
        setAnswers(data.answers);
        setQuestions(data.questions);
        setSessions(data.sessions);
        setSessionAverages(data.sessionAverages);
        console.log("Dados da rodada:", data);
      } catch (error) {
        console.error("Erro ao buscar dados da rodada:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoundData();

    return () => {
      // Função de limpeza para destruir a instância do gráfico
      const chart = ChartJS.getChart(roundId as string);
      if (chart) {
        chart.destroy();
      }
    };
  }, [roundId]);

  // Agrupar questões por sessão
  const sessionsMap = sessions.reduce((acc, session) => {
    acc[session._id] = session.title;
    return acc;
  }, {} as Record<string, string>);

  console.log("Categorias e questões:", sessionAverages); // Log para depuração

  return (
    <RoundContainer>
      {loading && <p>Carregando...</p>}

      <BackButton onClick={() => router.push("/admin")}>Voltar</BackButton>

      {round && (
        <>
          <RoundHeader>Rodada {round.roundNumber}</RoundHeader>
          <RoundSubheader>
            Data de Envio: <strong>{new Date(round.sentDate).toLocaleDateString("pt-BR")}</strong>
          </RoundSubheader>
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
                  {q.responseDate ? (
                    new Date(q.responseDate).toLocaleDateString("pt-BR")
                  ) : (
                    "Pendente"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      {/* Gráficos de Rosca */}
      <RoundHeader>Relatório da Rodada</RoundHeader>
      {sessionAverages.map(({ sessionId, questionAverages }) => {
        const sessionTitle = sessionsMap[sessionId];
        const questionTexts = questionAverages.map((qa) => {
          const question = questions.find((q) => q._id === qa.questionId);
          return question ? question.text : "Questão desconhecida";
        });

        console.log(`Médias das questões para a categoria ${sessionTitle}:`, questionAverages);

        return (
          <ChartContainer key={sessionId}>
            <ChartTitle>{sessionTitle}</ChartTitle>
            <div style={{ width: '100%', height: '500px', margin: '0 auto' }}>
              <Doughnut
                data={{
                  labels: questionTexts,
                  datasets: [
                    {
                      label: "Média",
                      data: questionAverages.map((qa) => qa.average),
                      backgroundColor: ["#6a89cc", "#ffce56", "#ff6384", "#36a2eb", "#cc65fe", "#ff9f40", "#4bc0c0"],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: {
                      displayColors: true,
                      bodyFont: {
                        size: 14,
                        weight: 'normal',
                      },
                      boxPadding: 10,
                      padding: 10,
                      caretPadding: 10,
                      cornerRadius: 4,
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleFont: {
                        size: 14,
                        weight: 'normal',
                      },
                      titleMarginBottom: 10,
                    },
                    legend: {
                      display: true,
                      position: "left",
                      align: 'start',
                      labels: {
                        boxWidth: 20,
                        padding: 10,
                        font: {
                          size: 12,
                        },
                        usePointStyle: true,
                      },
                    },
                  },
                }}
              />
            </div>
          </ChartContainer>
        );
      })}
    </RoundContainer>
  );
}
