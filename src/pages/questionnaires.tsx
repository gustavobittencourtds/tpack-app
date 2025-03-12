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
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token não encontrado, redirecionando para login...');
          router.push('/login');
          return;
        }

        console.log('Buscando professor pelo ID:', professorId);

        const professorResponse = await fetch(`/api/professors?id=${professorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const professorData = await professorResponse.json();

        if (!professorResponse.ok || !professorData.professors) {
          throw new Error('Erro ao buscar professor');
        }

        // Agora buscamos o professor correto pelo ID específico
        const selectedProfessor = professorData.professors.find((p: Professor) => p._id === professorId);
        if (!selectedProfessor) {
          throw new Error('Professor não encontrado na resposta da API');
        }

        console.log('Professor correto selecionado:', selectedProfessor);
        setProfessor(selectedProfessor);

        console.log('Buscando questionários do professor:', professorId);
        const questionnairesResponse = await fetch(`/api/get-questionnaires?professorId=${professorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const questionnairesData = await questionnairesResponse.json();

        if (!questionnairesResponse.ok) {
          throw new Error('Erro ao buscar questionários');
        }

        console.log('Questionários carregados:', questionnairesData.questionnaires);
        setQuestionnaires(questionnairesData.questionnaires);
      } catch (error) {
        console.error(error);
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