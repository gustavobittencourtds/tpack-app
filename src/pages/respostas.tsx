import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/respostas.module.css';
import Breadcrumbs from '../components/Breadcrumbs';

interface Answer {
  questionId: string;
  questionText: string;
  answer: string | string[];
}

interface Professor {
  _id: string;
  email: string;
}

export default function Respostas() {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questionnaireTitle, setQuestionnaireTitle] = useState('');
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [sentDate, setSentDate] = useState<Date | null>(null);
  const [responseDate, setResponseDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { questionnaireId, professorId, roundId } = router.query;

  useEffect(() => {
    if (!questionnaireId || !professorId) return;

    console.log('Buscando respostas para:', { questionnaireId, professorId });

    setAnswers([]); // Reset para evitar dados antigos

    const fetchAnswers = async () => {
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

        // Selecionar o professor correto
        const selectedProfessor = professorData.professors.find((p: Professor) => p._id === professorId);
        if (!selectedProfessor) {
          throw new Error('Professor não encontrado na resposta da API');
        }

        console.log('Professor correto selecionado:', selectedProfessor);
        setProfessor(selectedProfessor);

        console.log('Buscando respostas do questionário:', questionnaireId);
        const response = await fetch(`/api/get-answers?questionnaireId=${questionnaireId}&professorId=${professorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Erro ao buscar respostas');

        console.log('Respostas carregadas:', data.answers);
        setAnswers(data.answers || []);
        setQuestionnaireTitle(data.questionnaireTitle || 'Questionário');
        setSentDate(data.sentDate ? new Date(data.sentDate) : null);
        setResponseDate(data.responseDate ? new Date(data.responseDate) : null);
      } catch (error) {
        console.error('Erro ao buscar respostas:', error);
        setError('Erro ao buscar respostas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [questionnaireId, professorId]);

  const handleBack = () => {
    if (roundId) {
      // Se roundId estiver presente, volta para a tela de rodadas
      router.push(`/round?roundId=${roundId}`);
    } else if (professorId) {
      // Se professorId estiver presente, volta para a tela de questionários do professor
      router.push(`/questionnaires?professorId=${professorId}`);
    } else {
      // Caso contrário, volta para a tela de professores
      router.push('/professors');
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={`${styles.respostasContainer} ${styles.fadeIn}`}>
      <Breadcrumbs title="Respostas" />
      <h1 className={styles.respostasHeader}>{questionnaireTitle}</h1>

      <button onClick={handleBack} className={styles.backButton}>
        Voltar
      </button>

      {professor && <p>Professor: {professor.email}</p>}
      {sentDate && <p>Data de envio: {sentDate.toLocaleDateString('pt-BR')}</p>}
      {responseDate && <p>Data de resposta: {responseDate.toLocaleDateString('pt-BR')}</p>}

      <table className={styles.respostasTable}>
        <thead>
          <tr className={styles.respostasTableRow}>
            <th className={styles.respostasTableHeader}>Pergunta</th>
            <th className={styles.respostasTableHeader}>Resposta</th>
          </tr>
        </thead>
        <tbody>
          {answers.map((answer) => (
            <tr key={answer.questionId} className={styles.respostasTableRow}>
              <td className={styles.respostasTableCell}>{answer.questionText}</td>
              <td className={styles.respostasTableCell}>
                {Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}