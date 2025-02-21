import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Pie } from "react-chartjs-2";
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
  value: number;
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

export default function RoundPage() {
  const router = useRouter();
  const { roundId } = router.query;

  const [round, setRound] = useState<Round | null>(null);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
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
      } catch (error) {
        console.error("Erro ao buscar dados da rodada:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoundData();
  }, [roundId]);

  // Definir categorias e perguntas associadas
  const categories = {
    "Conhecimento pedagógico tecnológico do conteúdo": [
      "Pergunta 1",
      "Pergunta 2",
    ],
    "Conhecimento do conteúdo tecnológico": ["Pergunta 3", "Pergunta 4"],
    "Conhecimento pedagógico tecnológico": ["Pergunta 5", "Pergunta 6"],
    "Conhecimento pedagógico do conteúdo": ["Pergunta 7", "Pergunta 8"],
    "Conhecimento em tecnologia": ["Pergunta 9", "Pergunta 10"],
    "Conhecimento de conteúdo": ["Pergunta 11", "Pergunta 12"],
    "Conhecimento pedagógico": ["Pergunta 13", "Pergunta 14"],
  };

  // Calcular médias para cada categoria
  const categoryAverages = Object.entries(categories).map(([category, questions]) => {
    const filteredAnswers = answers.filter((answer) =>
      questions.includes(answer.questionId)
    );

    const total = filteredAnswers.reduce((sum, ans) => sum + ans.value, 0);
    const count = filteredAnswers.length;
    const average = count > 0 ? total / count : 0;

    return { category, average };
  });

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
      {categoryAverages.map(({ category, average }) => (
        <ChartContainer key={category}>
          <ChartTitle>{category}</ChartTitle>
          <Pie
            data={{
              labels: ["1", "2", "3", "4", "5"],
              datasets: [
                {
                  data: [average, 5 - average], // Média vs. diferença para o total máximo (5)
                  backgroundColor: ["#6a89cc", "#ffce56"],
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
      ))}
    </RoundContainer>
  );
}
