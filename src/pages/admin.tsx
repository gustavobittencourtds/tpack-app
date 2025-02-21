import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  AdminContainer,
  AdminHeader,
  TableContainer,
  Table,
  TableRow,
  TableHeader,
  TableCell,
  AdminButton,
  LoadingText,
} from '../styles/adminStyles';

interface Professor {
  _id: string;
  email: string;
}

interface Questionnaire {
  _id: string;
  title: string;
  completed: boolean;
  sentDate: Date | string;
  responseDate?: Date | string;
  userId: string;
  roundId: string;
}

interface Round {
  _id: string;
  roundNumber: number;
}

export default function AdminDashboard() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [questionnairesByRound, setQuestionnairesByRound] = useState<{ [roundId: string]: { [profId: string]: Questionnaire[] } }>({});
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Buscar professores
        const professorRes = await fetch('/api/professors');
        const professorData = await professorRes.json();
        setProfessors(professorData.professors);

        // Buscar questionários
        const questionnaireData: { [key: string]: Questionnaire[] } = {};
        await Promise.all(
          professorData.professors.map(async (prof: Professor) => {
            const res = await fetch(`/api/questionnaires?userId=${prof._id}`);
            const data = await res.json();
            questionnaireData[prof._id] = data.data || [];
          })
        );

        // Buscar rodadas
        const roundsRes = await fetch('/api/rounds');
        const roundsData = await roundsRes.json();

        // Ordenar rodadas da mais recente para a mais antiga
        const sortedRounds = roundsData.sort((a: Round, b: Round) => b.roundNumber - a.roundNumber);
        setRounds(sortedRounds);

        // Agrupar questionários por rodada e professor
        const groupedByRound: { [roundId: string]: { [profId: string]: Questionnaire[] } } = {};
        Object.entries(questionnaireData).forEach(([profId, questionnaires]) => {
          questionnaires.forEach((q) => {
            const roundId = q.roundId;

            if (!groupedByRound[roundId]) {
              groupedByRound[roundId] = {};
            }
            if (!groupedByRound[roundId][profId]) {
              groupedByRound[roundId][profId] = [];
            }
            groupedByRound[roundId][profId].push(q);
          });
        });

        setQuestionnairesByRound(groupedByRound);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AdminContainer>
      <AdminHeader>Avaliação TPACK</AdminHeader>

      {loading ? (
        <LoadingText>Carregando...</LoadingText>
      ) : (
        <TableContainer>
          <Table>
            {/* Cabeçalho com professores */}
            <thead>
              <TableRow>
                <TableHeader>Rodadas</TableHeader>
                {professors.map((professor) => (
                  <TableHeader key={professor._id}>{professor.email}</TableHeader>
                ))}
              </TableRow>
            </thead>

            {/* Corpo da tabela com rodadas e questionários */}
            <tbody>
              {rounds.map((round) => (
                <TableRow key={round._id}>
                  {/* Nome da rodada como um botão para acessar sua página */}
                  <TableCell className="round-cell">
                    <AdminButton onClick={() => router.push(`/round?roundId=${round._id}`)}>
                      Rodada {round.roundNumber}
                    </AdminButton>
                  </TableCell>

                  {/* Questionários de cada professor nessa rodada */}
                  {professors.map((professor) => {
                    const questionnaires = questionnairesByRound[round._id]?.[professor._id] || [];
                    return (
                      <TableCell key={`${round._id}-${professor._id}`}>
                        {questionnaires.length > 0 ? (
                          questionnaires.map((q) => (
                            <div key={q._id}>
                              <AdminButton onClick={() => router.push(`/respostas?questionnaireId=${q._id}&fromAdmin=true`)}>
                                {q.title}
                              </AdminButton>
                              <p><strong>Enviado em:</strong> {new Date(q.sentDate).toLocaleDateString('pt-BR')}</p>
                              <p>
                                <strong>Status:</strong> {q.completed ? 'Respondido' : 'Pendente'}
                                {q.responseDate && q.completed && (
                                  <> em {new Date(q.responseDate).toLocaleDateString('pt-BR')}</>
                                )}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p>-</p>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}
    </AdminContainer>
  );
}
