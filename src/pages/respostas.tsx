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
  BackButton,
} from '../styles/respostasStyle';

const Respostas: React.FC = () => {
  const router = useRouter();
  const { questionnaireId, roundId, fromAdmin } = router.query;

  const [answers, setAnswers] = useState<{ questionId: string; questionText: string; answer: string | string[] }[]>([]);
  const [questionnaireTitle, setQuestionnaireTitle] = useState<string | null>(null);
  const [professorEmail, setProfessorEmail] = useState<string | null>(null);
  const [sentDate, setSentDate] = useState<string | null>(null);
  const [responseDate, setResponseDate] = useState<string | null>(null);
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
        setSentDate(data.sentDate ? new Date(data.sentDate).toLocaleDateString('pt-BR') : 'Data não disponível');
        setResponseDate(data.responseDate ? new Date(data.responseDate).toLocaleDateString('pt-BR') : 'Pendente');
      } catch (err: any) {
        console.error('Erro ao buscar respostas:', err);
        setError('Erro ao carregar as respostas.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [questionnaireId]);

  const handleBack = () => {
    if (fromAdmin) {
      router.push('/admin');
    } else if (roundId) {
      router.push(`/round?roundId=${roundId}`);
    } else {
      router.push('/');
    }
  };

  return (
    <RespostasContainer>
      <BackButton onClick={handleBack}>Voltar</BackButton>

      <RespostasHeader>
        Respostas do Questionário - {questionnaireTitle}
      </RespostasHeader>
      <RespostasSubheader>
        Respondido por <strong>{professorEmail}</strong> em <strong>{responseDate}</strong>
      </RespostasSubheader>
      <RespostasSubheader>
        Enviado em: <strong>{sentDate}</strong>
      </RespostasSubheader>

      <p style={{ margin: '2rem 0', fontSize: '0.75rem', textAlign: 'center' }}>
        Caso deseje entrar em contato, envie um e-mail para:{' '}
        <ContactLink href="mailto:gustavo.bittencourtds@gmail.com">
          gustavo.bittencourtds@gmail.com
        </ContactLink>
      </p>

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
    </RespostasContainer>
  );
};

export default Respostas;
