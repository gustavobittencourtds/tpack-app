import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

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
    <div style={{ padding: '20px' }}>
      <h1>Administração de Questionários</h1>

      {/* Lista de Professores */}
      <h2>Professores</h2>
      <ul>
        {professors.map(professor => (
          <li key={professor._id}>
            <button onClick={() => fetchQuestionnaires(professor._id)}>
              {professor.email}
            </button>
          </li>
        ))}
      </ul>

      {/* Lista de Questionários */}
      {selectedProfessor && (
        <>
          <h2>Questionários</h2>
          {loading ? <p>Carregando...</p> : (
            <ul>
              {questionnaires.length > 0 ? (
                questionnaires.map(q => (
                  <li key={q._id}>
                    <button onClick={() => fetchAnswers(q._id)}>
                      {q.title} {q.completed ? '(Respondido)' : '(Não Respondido)'}
                    </button>
                  </li>
                ))
              ) : (
                <p>Nenhum questionário encontrado para este professor.</p>
              )}
            </ul>
          )}
        </>
      )}

      {/* Lista de Respostas */}
      {selectedQuestionnaire && (
        <>
          <h2>Respostas</h2>
          {loading ? <p>Carregando...</p> : (
            <ul>
              {Array.isArray(answers) && answers.length > 0 ? (
                answers.map((answer, index) => (
                  <li key={index}>
                    <strong>{answer.questionText}</strong>: {Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer}
                  </li>
                ))
              ) : (
                <p>Nenhuma resposta encontrada para este questionário.</p>
              )}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
