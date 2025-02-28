// AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
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

const FeatherIcon = dynamic(() => import('feather-icons-react'), { ssr: false });

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
          router.push('/login');
          return;
        }

        const professorRes = await fetch('/api/professors', { headers: { Authorization: `Bearer ${token}` } });
        const professorData = await professorRes.json();
        setProfessors(professorData.professors);

        const roundsRes = await fetch('/api/rounds', { headers: { Authorization: `Bearer ${token}` } });
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
  }, [router]);

  const getParticipatingProfessorsCount = async (roundId: string, token: string): Promise<number> => {
    try {
      const res = await fetch(`/api/questionnaires?roundId=${roundId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!Array.isArray(data.data)) return 0;

      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.userId;
      const uniqueProfessorIds = new Set(data.data.filter((q: any) => q.userId === userId).map((q: any) => q.userId));
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
          <div style={{ textAlign: 'center' }}>
            <p>Nenhum professor cadastrado ainda.</p>
            <AdminButton onClick={() => router.push('/professors')}>
              <FeatherIcon icon="user-plus" /> Cadastrar Professor
            </AdminButton>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
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