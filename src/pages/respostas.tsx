import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/respostas.module.css';
import Breadcrumbs from '../components/Breadcrumbs';

interface Answer {
  questionId: string;
  questionText: string;
  answer: string | string[];
}

export default function Respostas() {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questionnaireTitle, setQuestionnaireTitle] = useState('');
  const [professorEmail, setProfessorEmail] = useState('');
  const [sentDate, setSentDate] = useState<Date | null>(null);
  const [responseDate, setResponseDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { questionnaireId, professorId, roundId } = router.query;

  useEffect(() => {
    const fetchAnswers = async () => {
      if (!questionnaireId) return;

      try {
        const response = await fetch(`/api/get-answers?questionnaireId=${questionnaireId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Erro ao buscar respostas');

        setAnswers(data.answers || []);
        setQuestionnaireTitle(data.questionnaireTitle || 'Questionário');
        setProfessorEmail(data.professorEmail || 'Professor');
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
  }, [questionnaireId]);

  const handleBack = () => {
    // Redireciona para a tela de rodadas com o roundId
    if (roundId) {
      router.push(`/round?roundId=${roundId}`); 
    }
    // Caso contrário, redireciona para a tela de Questionários com o professorId
    else if (professorId) {
      router.push(`/questionnaires?professorId=${professorId}`); // Redireciona para a tela de professores com o professorId
    }
    // Se nenhum dos dois estiver presente, redireciona para a tela padrão de professores
    else {
      router.push('/professors');
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={`${styles.respostasContainer} ${styles.fadeIn}`}>
      <Breadcrumbs title="Respostas" />
      <h1 className={styles.respostasHeader}>{questionnaireTitle}</h1>

      <button
        onClick={handleBack}
        className={styles.backButton}
      >
        Voltar
      </button>

      <p>Professor: {professorEmail}</p>
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
              <td className={styles.respostasTableCell}>{Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}