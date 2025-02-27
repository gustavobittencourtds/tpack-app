import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  AdminContainer,
  AdminHeader,
  RoundCard,
  RoundCardHeader,
  RoundCardContent,
  RoundCardFooter,
  AdminButton,
  LoadingText,
} from '../styles/adminStyles';
import ProtectedRoute from '../components/ProtectedRoute';

interface Professor {
  _id: string;
  email: string;
}

interface Round {
  _id: string;
  roundNumber: number;
  sentDate: Date | string;
}

export default function AdminDashboard() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [participants, setParticipants] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token não encontrado');
        }

        const professorRes = await fetch('/api/professors', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const professorData = await professorRes.json();
        setProfessors(professorData.professors);

        const roundsRes = await fetch('/api/rounds', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const roundsData = await roundsRes.json();
        const sortedRounds = roundsData.sort((a: Round, b: Round) => b.roundNumber - a.roundNumber);
        setRounds(sortedRounds);

        const participantsData: Record<string, number> = {};
        for (const round of sortedRounds) {
          participantsData[round._id] = await getParticipatingProfessorsCount(round._id, token);
        }
        setParticipants(participantsData);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getParticipatingProfessorsCount = async (roundId: string, token: string): Promise<number> => {
    try {
      const res = await fetch(`/api/questionnaires?roundId=${roundId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!Array.isArray(data.data)) {
        return 0;
      }

      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.userId;
      const userQuestionnaires = data.data.filter((q: any) => q.userId === userId);
      const uniqueProfessorIds = new Set(userQuestionnaires.map((q: any) => q.userId?.toString()));

      return uniqueProfessorIds.size;
    } catch {
      return 0;
    }
  };

  return (
    <ProtectedRoute>
      <AdminContainer>
        <AdminHeader>Avaliação TPACK</AdminHeader>

        {loading ? (
          <LoadingText>Carregando...</LoadingText>
        ) : !professors.length ? (
          <div>
            <p>Nenhum professor cadastrado ainda.</p>
            <AdminButton onClick={() => router.push('/professors')}>Cadastrar Professor</AdminButton>
          </div>
        ) : (
          <div>
            {rounds.map((round) => (
              <RoundCard key={round._id}>
                <RoundCardHeader>Rodada {round.roundNumber}</RoundCardHeader>
                <RoundCardContent>
                  <p>Data de aplicação: {new Date(round.sentDate).toLocaleDateString('pt-BR')}</p>
                  <p>Professores participantes: {participants[round._id] ?? 'Carregando...'}</p>
                </RoundCardContent>
                <RoundCardFooter>
                  <AdminButton onClick={() => router.push(`/round?roundId=${round._id}`)}>
                    Ver Detalhes
                  </AdminButton>
                </RoundCardFooter>
              </RoundCard>
            ))}
          </div>
        )}
      </AdminContainer>
    </ProtectedRoute>
  );
}
