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
} from '../styles/adminStyles';

interface Professor {
  _id: string;
  email: string;
}

interface Questionnaire {
  _id: string;
  title: string;
  completed: boolean;
}

export default function AdminDashboard() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [questionnaires, setQuestionnaires] = useState<{ [key: string]: Questionnaire[] }>({});
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
        setQuestionnaires(questionnaireData);
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
      <AdminHeader>Aplicações realizadas</AdminHeader>

      {loading ? (
        <LoadingText>Carregando...</LoadingText>
      ) : (
        <TableContainer>
          <Table>
            <thead>
              <TableRow>
                <TableHeader>Professores</TableHeader>
                <TableHeader>Questionários</TableHeader>
              </TableRow>
            </thead>
            <tbody>
              {professors.map((professor) => (
                <TableRow key={professor._id}>
                  <ProfessorCell>{professor.email}</ProfessorCell>
                  <QuestionCell>
                    {questionnaires[professor._id]?.length > 0 ? (
                      questionnaires[professor._id].map((q) => (
                        <AdminButton key={q._id} onClick={() => router.push(`/respostas?questionnaireId=${q._id}`)}>
                          {q.title}
                        </AdminButton>
                      ))
                    ) : (
                      <LoadingText>Sem questionários</LoadingText>
                    )}
                  </QuestionCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}
    </AdminContainer>
  );
}
