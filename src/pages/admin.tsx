import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import ProtectedRoute from '../components/ProtectedRoute';
import styles from '../styles/Admin.module.css';

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
        setProfessors(professorData.professors || []);

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
        setProfessors([]);
        setRounds([]);
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

      // Conta os professores únicos que responderam aos questionários da rodada
      const uniqueProfessorIds = new Set(data.data.map((q: any) => q.professorId));
      return uniqueProfessorIds.size;
    } catch {
      return 0;
    }
  };

  return (
    <ProtectedRoute>
      <div className={styles.adminContainer}>
        <h1 className={styles.adminHeader}>Avaliação TPACK</h1>

        <button
          className={styles.adminButton}
          style={{ margin: '2rem auto' }}
          onClick={() => router.push('/professors')}
        >
          <FeatherIcon icon="send" /> Nova rodada de aplicação
        </button>

        {loading ? (
          <p className={styles.loadingText}>Carregando...</p>
        ) : professors.length > 0 && rounds.length === 0 ? ( // Professores cadastrados, mas sem rodadas
          <div className={styles.emptyState}>
            <p>Nenhuma rodada de aplicação dos questionários foi realizada ainda.</p>
            <p>Envie o questionário para começar a avaliar os professores com o TPACK.</p>
          </div>
        ) : (
          <div className={styles.roundsGrid}>
            {rounds.map((round) => (
              <div key={round._id} className={styles.roundCard}>
                <div className={styles.roundCardHeader}>Rodada {round.roundNumber}</div>
                <div className={styles.roundCardContent}>
                  <p>Data de aplicação: {new Date(round.sentDate).toLocaleDateString('pt-BR')}</p>
                  <p>Professores participantes: {participants[round._id] ?? 'Carregando...'}</p>
                </div>
                <div className={styles.roundCardFooter}>
                  <button className={styles.adminButton} onClick={() => router.push(`/round?roundId=${round._id}`)}>
                    Ver Detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}