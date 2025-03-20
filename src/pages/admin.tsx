import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import ProtectedRoute from '../components/ProtectedRoute';
import styles from '../styles/Admin.module.css';
import { jwtDecode } from 'jwt-decode'; // Importe jwtDecode

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
      // Busca os questionários desta rodada específica
      const res = await fetch(`/api/questionnaires?roundId=${roundId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error(`Erro na requisição: ${res.status} ${res.statusText}`);
        return 0;
      }

      const data = await res.json();

      // Verifica o formato da resposta e extrai os questionários
      const questionnaires = data.questionnaires || data.data || [];

      if (!Array.isArray(questionnaires)) {
        console.error('Formato de resposta inesperado:', data);
        return 0;
      }

      // Verifica se há questionários
      if (questionnaires.length === 0) {
        return 0;
      }

      // Conta professores únicos para esta rodada
      const uniqueProfessorIds = new Set(questionnaires.map((q: any) => q.professorId));
      // console.log(`Rodada ${roundId}: encontrados ${uniqueProfessorIds.size} professores participantes`);
      return uniqueProfessorIds.size;
    } catch (error) {
      console.error('Erro ao buscar contagem de professores:', error);
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
          <p className={styles.loadingText}>Carregando dados...</p>
        ) : rounds.length === 0 ? ( // Professores cadastrados, mas sem rodadas
          <div className={styles.emptyState}>
            <p>Nenhuma rodada de aplicação dos questionários foi realizada ainda.</p>
            <p>Aplique o questionário para começar a avaliar os professores com o TPACK.</p>
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