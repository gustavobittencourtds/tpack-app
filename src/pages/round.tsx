import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Pie } from "react-chartjs-2";
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
        setAnswers(data.answers); // Pegamos todas as respostas da rodada
        setQuestions(data.questions); // Pegamos todas as questões da rodada
        setSessions(data.sessions); // Pegamos todas as sessões
        setSessionAverages(data.sessionAverages); // Pegamos as médias das sessões
        console.log("Dados da rodada:", data); // Log para depuração
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

      {/* Gráficos de Pizza */}
      <RoundHeader>Relatório da Rodada</RoundHeader>
      {sessionAverages.map(({ sessionId, questionAverages }) => {
        const sessionTitle = sessionsMap[sessionId];
        const questionTexts = questionAverages.map((qa) => {
          const question = questions.find((q) => q._id === qa.questionId);
          return question ? question.text : "Questão desconhecida";
        });

        console.log(`Médias das questões para a categoria ${sessionTitle}:`, questionAverages); // Log para depuração

        return (
          <ChartContainer key={sessionId}>
            <ChartTitle>{sessionTitle}</ChartTitle>
            <Pie
              data={{
                labels: questionTexts,
                datasets: [
                  {
                    data: questionAverages.map((qa) => qa.average),
                    backgroundColor: ["#6a89cc", "#ffce56", "#ff6384", "#36a2eb", "#cc65fe", "#ff9f40", "#4bc0c0"],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false, // Corrige problema do tamanho infinito
              }}
              width={400}
              height={400}
            />
          </ChartContainer>
        );
      })}
    </RoundContainer>
  );
}
