// pages/professor-questionnaires.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/respostas.module.css';
import ProtectedRoute from '../components/ProtectedRoute';

interface Questionnaire {
  _id: string;
  title: string;
  responseDate: Date;
}

export default function ProfessorQuestionnaires() {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { professorId } = router.query;

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      if (!professorId) return;

      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/get-questionnaires?professorId=${professorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Erro ao buscar questionários');

        setQuestionnaires(data.questionnaires);
      } catch (error) {
        console.error('Erro ao buscar questionários:', error);
        setError('Erro ao buscar questionários. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionnaires();
  }, [professorId]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ProtectedRoute>
      <div className={styles.respostasContainer}>
        <h1 className={styles.respostasHeader}>Questionários Respondidos</h1>
        <table className={styles.respostasTable}>
          <thead>
            <tr className={styles.respostasTableRow}>
              <th className={styles.respostasTableHeader}>Título</th>
              <th className={styles.respostasTableHeader}>Data de Resposta</th>
              <th className={styles.respostasTableHeader}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {questionnaires.map((questionnaire) => (
              <tr key={questionnaire._id} className={styles.respostasTableRow}>
                <td className={styles.respostasTableCell}>{questionnaire.title}</td>
                <td className={styles.respostasTableCell}>{new Date(questionnaire.responseDate).toLocaleDateString('pt-BR')}</td>
                <td className={styles.respostasTableCell}>
                  <button onClick={() => router.push(`/respostas?questionnaireId=${questionnaire._id}`)}>Ver Respostas</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ProtectedRoute>
  );
}