import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/respostas.module.css';
import ProtectedRoute from '../components/ProtectedRoute';
import Breadcrumbs from '../components/Breadcrumbs';

interface Questionnaire {
  _id: string;
  title: string;
  responseDate: Date;
}

interface Professor {
  _id: string;
  email: string;
}

export default function ProfessorQuestionnaires() {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { professorId } = router.query;

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      if (!professorId) return;

      try {
        const token = localStorage.getItem('token');

        // Busca as informações do professor
        const professorResponse = await fetch(`/api/professors?id=${professorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const professorData = await professorResponse.json();

        if (!professorResponse.ok) throw new Error(professorData.message || 'Erro ao buscar informações do professor');

        // Acessa o primeiro professor do array
        const professor = professorData.professors[0];
        setProfessor(professor);

        // Busca os questionários respondidos pelo professor
        const questionnairesResponse = await fetch(`/api/get-questionnaires?professorId=${professorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const questionnairesData = await questionnairesResponse.json();

        if (!questionnairesResponse.ok) throw new Error(questionnairesData.message || 'Erro ao buscar questionários');

        // Ordena os questionários pela data de resposta (do mais recente para o mais antigo)
        const sortedQuestionnaires = questionnairesData.questionnaires.sort(
          (a: Questionnaire, b: Questionnaire) =>
            new Date(b.responseDate).getTime() - new Date(a.responseDate).getTime()
        );

        setQuestionnaires(sortedQuestionnaires);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Erro ao buscar dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionnaires();
  }, [professorId]);

  const handleBack = () => {
    router.push('/professors');
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ProtectedRoute>
      <div className={styles.respostasContainer}>
        <Breadcrumbs title="Questionários" />
        <div>
          <h1 className={styles.respostasHeader}>Questionários Respondidos</h1>
          <button
            onClick={handleBack}
            className={styles.backButton}
          >
            Voltar
          </button>
        </div>

        {/* Exibe o e-mail do professor */}
        {professor && (
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            Professor: <strong>{professor.email}</strong>
          </p>
        )}

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
                <td className={styles.respostasTableCell}>
                  {new Date(questionnaire.responseDate).toLocaleDateString('pt-BR')}
                </td>
                <td className={styles.respostasTableCell}>
                  <button
                    className={styles.viewAnswersButton}
                    onClick={() => router.push(`/respostas?questionnaireId=${questionnaire._id}&professorId=${professorId}`)}
                  >
                    Ver Respostas
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ProtectedRoute>
  );
}