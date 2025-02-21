import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  AdminContainer,
  AdminHeader,
  TableContainer,
  Table,
  TableRow,
  TableHeader,
  TableCell,
  BackButton,
  AdminButton,
  LoadingText,
} from '../styles/adminStyles';

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!roundId) return;

    const fetchRoundData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/report?roundId=${roundId}`);
        const data = await res.json();
        setQuestionnaires(data.questionnaires);
      } catch (error) {
        console.error('Erro ao buscar dados da rodada:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoundData();
  }, [roundId]);

  return (
    <AdminContainer>
      {loading && <LoadingText>Carregando...</LoadingText>}

      <BackButton onClick={() => router.push('/admin')}>Voltar</BackButton>

      {round && (
        <>
          <AdminHeader>Rodada {round.roundNumber}</AdminHeader>
          <p>Data de Envio: <strong>{new Date(round.sentDate).toLocaleDateString('pt-BR')}</strong></p>
        </>
      )}

      <TableContainer>
        <Table>
          <thead>
            <TableRow>
              <TableHeader>Questionário</TableHeader>
              <TableHeader>Enviado em</TableHeader>
              <TableHeader>Respondido em</TableHeader>
              <TableHeader>Ações</TableHeader>
            </TableRow>
          </thead>
          <tbody>
            {questionnaires.map((q) => (
              <TableRow key={q._id}>
                <TableCell>{q.title}</TableCell>
                <TableCell>{new Date(q.sentDate).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>{q.responseDate ? new Date(q.responseDate).toLocaleDateString('pt-BR') : 'Pendente'}</TableCell>
                <TableCell>
                  {q.completed ? (
                    <AdminButton
                      onClick={() => router.push(`/respostas?questionnaireId=${q._id}&roundId=${roundId}`)}
                    >
                      Ver Respostas
                    </AdminButton>
                  ) : (
                    '-'
                  )}
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </AdminContainer>
  );
}
