import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  RespostasContainer,
  RespostasHeader,
  RespostasSubheader,
  RespostasContent,
  RespostaItem,
  PerguntaHeader,
  RespostaBody,
  ContactLink,
} from '../styles/respostasStyle';

const Respostas: React.FC = () => {
  const router = useRouter();
  const { questionnaireId } = router.query;
  const [answers, setAnswers] = useState<{ questionId: string; questionText: string; answer: string | string[] }[]>([]);
  const [questionnaireTitle, setQuestionnaireTitle] = useState<string | null>(null);
  const [professorEmail, setProfessorEmail] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!questionnaireId) return;

    const fetchAnswers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/get-answers?questionnaireId=${questionnaireId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Erro ao buscar respostas');

        setAnswers(data.answers || []);
        setQuestionnaireTitle(data.questionnaireTitle || 'Questionário');
        setProfessorEmail(data.professorEmail || 'Desconhecido');
        setDate(data.date ? new Date(data.date).toLocaleDateString('pt-BR') : 'Data não disponível');
      } catch (err: any) {
        console.error('Erro ao buscar respostas:', err);
        setError('Erro ao carregar as respostas.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [questionnaireId]);

  return (
    <RespostasContainer>
      <RespostasHeader>
        Respostas do Questionário - {questionnaireTitle}
      </RespostasHeader>
      <RespostasSubheader>
        Respondido por <strong>{professorEmail}</strong> em <strong>{date}</strong>
      </RespostasSubheader>

      {loading ? (
        <p>Carregando respostas...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : answers.length > 0 ? (
        <RespostasContent>
          {answers.map(({ questionId, questionText, answer }) => (
            <RespostaItem key={questionId}>
              <PerguntaHeader>{questionText}</PerguntaHeader>
              <RespostaBody>{Array.isArray(answer) ? answer.join(', ') : answer}</RespostaBody>
            </RespostaItem>
          ))}
        </RespostasContent>
      ) : (
        <p>Nenhuma resposta encontrada.</p>
      )}

      <p style={{ marginTop: '2rem', fontSize: '0.75rem', textAlign: 'center' }}>
        Caso deseje entrar em contato, envie um e-mail para:{' '}
        <ContactLink href="mailto:gustavo.bittencourtds@gmail.com">
          gustavo.bittencourtds@gmail.com
        </ContactLink>
      </p>
    </RespostasContainer>
  );
};

export default Respostas;
