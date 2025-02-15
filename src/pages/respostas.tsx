import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  RespostasContainer,
  RespostasHeader,
  RespostasContent,
  RespostaItem,
  ContactLink,
} from '../styles/respostasStyle';

const Respostas: React.FC = () => {
  const router = useRouter();
  const { token, answers } = router.query;
  const [questions, setQuestions] = useState<any[]>([]);
  const [choices, setChoices] = useState<{ [key: string]: any[] }>({});

  // Buscar perguntas e opções do banco de dados
  useEffect(() => {
    const fetchQuestionsAndChoices = async () => {
      try {
        // Buscar perguntas
        const questionsResponse = await fetch(`/api/questions?token=${token}`);
        if (!questionsResponse.ok) {
          console.error('Erro ao buscar perguntas:', await questionsResponse.json());
          return;
        }
        const questionsData = await questionsResponse.json();
        setQuestions(questionsData);

        // Buscar opções (choices)
        const choicesResponse = await fetch('/api/choices');
        if (!choicesResponse.ok) {
          console.error('Erro ao buscar opções:', await choicesResponse.json());
          return;
        }
        const choicesData = await choicesResponse.json();

        // Mapear opções por questão
        const choicesMap = choicesData.reduce((acc: { [key: string]: any[] }, choice: any) => {
          if (!acc[choice.question_id]) {
            acc[choice.question_id] = [];
          }
          acc[choice.question_id].push(choice);
          return acc;
        }, {});
        setChoices(choicesMap);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    if (token) fetchQuestionsAndChoices();
  }, [token]);

  // Converter as respostas de string para objeto
  const parsedAnswers = answers ? JSON.parse(answers as string) : {};

  // Função para obter o texto da resposta com base no ID
  const getAnswerText = (questionId: string, answer: string | string[]) => {
    if (Array.isArray(answer)) {
      return answer
        .map((id) => {
          const choice = choices[questionId]?.find((c) => c._id === id);
          return choice ? choice.text : id;
        })
        .join(', ');
    } else {
      const choice = choices[questionId]?.find((c) => c._id === answer);
      return choice ? choice.text : answer;
    }
  };

  return (
    <RespostasContainer>
      <RespostasHeader>Respostas Enviadas com Sucesso!</RespostasHeader>
      <p>Obrigado por participar do questionário.</p>

      <RespostasContent>
        <h2>Suas Respostas:</h2>
        {Object.entries(parsedAnswers).map(([questionId, answer]) => {
          const question = questions.find((q) => q._id === questionId);
          return (
            <RespostaItem key={questionId}>
              <h3>{question ? question.text : `Pergunta ${questionId}`}</h3>
              <p>
                <strong>Resposta:</strong>{' '}
                {getAnswerText(questionId, answer as string | string[])}
              </p>
            </RespostaItem>
          );
        })}
      </RespostasContent>

      <p style={{ marginTop: '2rem' }}>
        Caso deseje entrar em contato, envie um e-mail para:{' '}
        <ContactLink href="mailto:gustavo.bittencourtds@gmail.com">
          gustavo.bittencourtds@gmail.com
        </ContactLink>
      </p>
    </RespostasContainer>
  );
};

export default Respostas;