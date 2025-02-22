import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PieChart } from '@mui/x-charts/PieChart';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
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
  LegendContainer,
  LegendItem,
  LegendColor,
  LegendText,
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

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, Arial, sans-serif',
  },
});

interface LegendProps {
  data: { label: string; value: number }[];
  colors: string[];
  title: string;
}

const Legend = ({ data, colors, title }: LegendProps) => {
  return (
    <LegendContainer>
      {title && <ChartTitle>{title}</ChartTitle>}
      {data.map((item, index) => (
        <LegendItem key={index}>
          <LegendColor color={colors[index % colors.length]} />
          <LegendText>
            {item.label}
            <br />
            <span style={{ fontWeight: 'bold' }}>Média: {item.value.toFixed(2)}</span>
          </LegendText>
        </LegendItem>
      ))}
    </LegendContainer>
  );
};

// Paleta de cores padrão do Chart.js
const chartJsColors = ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

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
  }, [roundId]);

  const sessionsMap = sessions.reduce((acc, session) => {
    acc[session._id] = session.title;
    return acc;
  }, {} as Record<string, string>);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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

        <RoundHeader>Relatório da Rodada</RoundHeader>
        {sessionAverages.map(({ sessionId, questionAverages }) => {
          const sessionTitle = sessionsMap[sessionId];
          const questionTexts = questionAverages.map((qa) => {
            const question = questions.find((q) => q._id === qa.questionId);
            return question ? question.text : "Questão desconhecida";
          });

          const pieChartData = questionAverages.map((qa, index) => ({
            id: qa.questionId,
            value: qa.average,
            label: questionTexts[index],
            color: chartJsColors[index % chartJsColors.length], // Usando a paleta do Chart.js
          }));

          return (
            <ChartContainer key={sessionId}>
              <div>
                <PieChart
                  series={[
                    {
                      data: pieChartData,
                      innerRadius: 40,
                    },
                  ]}
                  height={320}
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
                />
              </div>
              <Legend data={pieChartData} colors={chartJsColors} title={sessionTitle} />
            </ChartContainer>
          );
        })}
      </RoundContainer>
    </ThemeProvider>
  );
}