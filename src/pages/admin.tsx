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
  ProfessorCell,
  QuestionCell,
  AdminButton,
  LoadingText,
  DateHeader, // Adicione o estilo para o cabeçalho da data
} from '../styles/adminStyles';

interface Professor {
  _id: string;
  email: string;
}

interface Questionnaire {
  _id: string;
  title: string;
  completed: boolean;
  sentDate: Date;
  responseDate: Date;
  userId: string; // Add userId property
}

export default function AdminDashboard() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [questionnairesByDate, setQuestionnairesByDate] = useState<{ [key: string]: Questionnaire[] }>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfessorsAndQuestionnaires = async () => {
      setLoading(true);
      try {
        const professorRes = await fetch('/api/professors');
        const professorData = await professorRes.json();
        setProfessors(professorData.professors);

        const questionnaireData: { [key: string]: Questionnaire[] } = {};
        await Promise.all(
          professorData.professors.map(async (prof: Professor) => {
            const res: Response = await fetch(`/api/questionnaires?userId=${prof._id}`);
            const data: { data: Questionnaire[] } = await res.json();
            questionnaireData[prof._id] = data.data || [];
          })
        );

        // Agrupar questionários por data de envio
        const groupedByDate: { [key: string]: Questionnaire[] } = {};
        Object.values(questionnaireData).flat().forEach((q) => {
          const dateKey = new Date(q.sentDate).toLocaleDateString('pt-BR');
          if (!groupedByDate[dateKey]) {
            groupedByDate[dateKey] = [];
          }
          groupedByDate[dateKey].push(q);
        });

        setQuestionnairesByDate(groupedByDate);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessorsAndQuestionnaires();
  }, []);

  return (
    <AdminContainer>
      <AdminHeader>Avaliação TPACK</AdminHeader>

      {loading ? (
        <LoadingText>Carregando...</LoadingText>
      ) : (
        <TableContainer>
          <Table>
            <thead>
              <TableRow>
                <TableHeader>Professores</TableHeader>
                {Object.keys(questionnairesByDate).map((date) => (
                  <DateHeader key={date}>{date}</DateHeader> // Cabeçalho com a data de envio
                ))}
              </TableRow>
            </thead>
            <tbody>
              {professors.map((professor) => (
                <TableRow key={professor._id}>
                  <ProfessorCell>{professor.email}</ProfessorCell>
                  {Object.keys(questionnairesByDate).map((date) => (
                    <QuestionCell key={date}>
                      {questionnairesByDate[date]
                        .filter((q) => q.userId === professor._id) // Filtra questionários do professor
                        .map((q) => (
                          <div key={q._id}>
                            <AdminButton onClick={() => router.push(`/respostas?questionnaireId=${q._id}&fromAdmin=true`)}>
                              {q.title}
                            </AdminButton>
                            <p>Respondido em: {q.responseDate ? new Date(q.responseDate).toLocaleDateString('pt-BR') : 'Pendente'}</p>
                          </div>
                        ))}
                    </QuestionCell>
                  ))}
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}
    </AdminContainer>
  );
}