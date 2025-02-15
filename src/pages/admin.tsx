import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  AdminContainer,
  AdminHeader,
  AdminSection,
  AdminSectionTitle,
  AdminList,
  AdminListItem,
  AdminButton,
  LoadingText,
  RespostaItem,
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

interface Answer {
  questionText: string;
  answer: string | number | string[];
}

export default function AdminDashboard() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<string | null>(null);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Buscar professores
  useEffect(() => {
    fetch('/api/professors')
      .then(res => res.json())
      .then(data => setProfessors(data.professors))
      .catch(err => console.error('Erro ao buscar professores:', err));
  }, []);

  // Buscar questionários do professor
  const fetchQuestionnaires = async (professorId: string) => {
    setLoading(true);
    setSelectedProfessor(professorId);
    setSelectedQuestionnaire(null);
    setAnswers([]);

    try {
      console.log(` Buscando questionários para o professor: ${professorId}`);

      const response = await fetch(`/api/questionnaires?userId=${professorId}`);
      const data = await response.json();

      console.log('Resposta da API:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao buscar questionários');
      }

      setQuestionnaires(data.data || []); // Garante que sempre será um array
    } catch (error) {
      console.error('Erro ao buscar questionários:', error);
      setQuestionnaires([]); // Evita undefined
    } finally {
      setLoading(false);
    }
  };

  // Buscar respostas do questionário
  const fetchAnswers = async (questionnaireId: string) => {
    setLoading(true);
    setSelectedQuestionnaire(questionnaireId);

    try {
      console.log(`Buscando respostas para o questionário: ${questionnaireId}`);

      const response = await fetch(`/api/get-answers?questionnaireId=${questionnaireId}`);
      const data = await response.json();

      console.log('Resposta da API:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao buscar respostas');
      }

      setAnswers(data.answers || []); // Garante que sempre será uma array
    } catch (error) {
      console.error('Erro ao buscar respostas:', error);
      setAnswers([]); // Evita undefined
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContainer>
      <AdminHeader>Administração de Questionários</AdminHeader>

      {/* Lista de Professores */}
      <AdminSection>
        <AdminSectionTitle>Professores</AdminSectionTitle>
        <AdminList>
          {professors.map(professor => (
            <AdminListItem key={professor._id}>
              <AdminButton onClick={() => fetchQuestionnaires(professor._id)}>
                {professor.email}
              </AdminButton>
            </AdminListItem>
          ))}
        </AdminList>
      </AdminSection>

      {/* Lista de Questionários */}
      {selectedProfessor && (
        <AdminSection>
          <AdminSectionTitle>Questionários</AdminSectionTitle>
          {loading ? <LoadingText>Carregando...</LoadingText> : (
            <AdminList>
              {questionnaires.length > 0 ? (
                questionnaires.map(q => (
                  <AdminListItem key={q._id}>
                    <AdminButton onClick={() => fetchAnswers(q._id)}>
                      {q.title} {q.completed ? '(Respondido)' : '(Não Respondido)'}
                    </AdminButton>
                  </AdminListItem>
                ))
              ) : (
                <LoadingText>Nenhum questionário encontrado para este professor.</LoadingText>
              )}
            </AdminList>
          )}
        </AdminSection>
      )}

      {/* Lista de Respostas */}
      {selectedQuestionnaire && (
        <AdminSection>
          <AdminSectionTitle>Respostas</AdminSectionTitle>
          {loading ? <LoadingText>Carregando...</LoadingText> : (
            <AdminList>
              {Array.isArray(answers) && answers.length > 0 ? (
                answers.map((answer, index) => (
                  <RespostaItem key={index}>
                    <h3>{answer.questionText}</h3>
                    <p>
                      <strong>Resposta:</strong>{' '}
                      {Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer}
                    </p>
                  </RespostaItem>
                ))
              ) : (
                <LoadingText>Nenhuma resposta encontrada para este questionário.</LoadingText>
              )}
            </AdminList>
          )}
        </AdminSection>
      )}
    </AdminContainer>
  );
}