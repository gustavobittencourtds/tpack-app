import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  RespostasContainer,
  RespostasHeader,
  RespostasTable,
  RespostasTableRow,
  RespostasTableHeader,
  RespostasTableCell,
} from '../styles/respostasStyles';

interface Answer {
  questionId: string;
  questionText: string;
  answer: string | string[];
}

export default function Respostas() {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questionnaireTitle, setQuestionnaireTitle] = useState('');
  const [professorEmail, setProfessorEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { questionnaireId } = router.query;

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
      } catch (error) {
        console.error('Erro ao buscar respostas:', error);
        setError('Erro ao buscar respostas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [questionnaireId]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <RespostasContainer>
      <RespostasHeader>{questionnaireTitle}</RespostasHeader>
      <p>Professor: {professorEmail}</p>
      <RespostasTable>
        <thead>
          <RespostasTableRow>
            <RespostasTableHeader>Pergunta</RespostasTableHeader>
            <RespostasTableHeader>Resposta</RespostasTableHeader>
          </RespostasTableRow>
        </thead>
        <tbody>
          {answers.map((answer) => (
            <RespostasTableRow key={answer.questionId}>
              <RespostasTableCell>{answer.questionText}</RespostasTableCell>
              <RespostasTableCell>{Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer}</RespostasTableCell>
            </RespostasTableRow>
          ))}
        </tbody>
      </RespostasTable>
    </RespostasContainer>
  );
}
