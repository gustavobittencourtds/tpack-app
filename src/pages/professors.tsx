// ProfessorsPage.tsx
import { useState, useEffect } from 'react';
import {
  ProfessorsContainer,
  ProfessorsHeader,
  ProfessorCard,
  AddProfessorForm,
  AddProfessorInput,
  AddProfessorButton,
  EditButton,
  DeleteButton,
  SendButton,
  SelectAllButton,
} from '../styles/professorsStyles';
import ProtectedRoute from '../components/ProtectedRoute';
import dynamic from 'next/dynamic';

const FeatherIcon = dynamic(() => import('feather-icons-react'), { ssr: false });

interface Professor {
  _id: string;
  email: string;
}

export default function ProfessorsPage() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [newProfessorEmail, setNewProfessorEmail] = useState('');
  const [selectedProfessors, setSelectedProfessors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessors = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/professors', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setProfessors(data.professors);
      } catch (error) {
        console.error('Erro ao buscar professores:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessors();
  }, []);

  const handleAddProfessor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfessorEmail) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/professors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: newProfessorEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfessors((prev) => [...prev, data]);
        setNewProfessorEmail('');
        setMessage('Professor adicionado com sucesso!');
      } else {
        setMessage(data.message || 'Erro ao adicionar professor');
      }
    } catch (error) {
      setMessage('Erro ao adicionar professor.');
    }
  };

  const handleEditProfessor = async (professor: Professor) => {
    const newEmail = prompt('Digite o novo email:', professor.email);
    if (!newEmail) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/professors?id=${professor._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: newEmail }),
      });
      if (res.ok) {
        setProfessors(professors.map((p) => (p._id === professor._id ? { ...p, email: newEmail } : p)));
        setMessage('Professor editado com sucesso!');
      } else {
        setMessage('Erro ao editar professor.');
      }
    } catch (error) {
      setMessage('Erro ao editar professor.');
    }
  };

  const handleDeleteProfessor = async (professorId: string) => {
    if (!confirm('Tem certeza que deseja remover este professor?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/professors?id=${professorId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProfessors(professors.filter((p) => p._id !== professorId));
        setMessage('Professor removido com sucesso!');
      } else {
        setMessage('Erro ao remover professor.');
      }
    } catch (error) {
      setMessage('Erro ao remover professor.');
    }
  };

  const handleSelectProfessor = (professorId: string) => {
    setSelectedProfessors((prev) =>
      prev.includes(professorId) ? prev.filter((id) => id !== professorId) : [...prev, professorId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProfessors.length === professors.length) {
      setSelectedProfessors([]);
    } else {
      setSelectedProfessors(professors.map((p) => p._id));
    }
  };

  const handleSendQuestionnaires = async (selectedOnly: boolean) => {
    const professorIds = selectedOnly ? selectedProfessors : professors.map((p) => p._id);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/sendEmails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ professorIds }),
      });
      if (res.ok) {
        setMessage('Questionários enviados com sucesso!');
      } else {
        setMessage('Erro ao enviar questionários.');
      }
    } catch (error) {
      setMessage('Erro ao enviar questionários.');
    }
  };

  return (
    <ProtectedRoute>
      <ProfessorsContainer>
        <ProfessorsHeader>Professores</ProfessorsHeader>
        <AddProfessorForm onSubmit={handleAddProfessor}>
          <AddProfessorInput
            type="email"
            placeholder="Email do professor"
            value={newProfessorEmail}
            onChange={(e) => setNewProfessorEmail(e.target.value)}
          />
          <AddProfessorButton type="submit">
            <FeatherIcon icon="plus" /> Adicionar
          </AddProfessorButton>
        </AddProfessorForm>
        {message && <p style={{ color: message.includes('Erro') ? '#e74c3c' : '#00b894', textAlign: 'center' }}>{message}</p>}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <SelectAllButton onClick={handleSelectAll}>
            {selectedProfessors.length === professors.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
          </SelectAllButton>
          <SendButton onClick={() => handleSendQuestionnaires(false)}>
            Enviar para Todos
          </SendButton>
          <SendButton onClick={() => handleSendQuestionnaires(true)} disabled={selectedProfessors.length === 0}>
            Enviar para Selecionados
          </SendButton>
        </div>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#636e72' }}>Carregando...</p>
        ) : (
          professors.map((professor) => (
            <ProfessorCard key={professor._id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input
                  type="checkbox"
                  checked={selectedProfessors.includes(professor._id)}
                  onChange={() => handleSelectProfessor(professor._id)}
                />
                <span>{professor.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <EditButton onClick={() => handleEditProfessor(professor)}>
                  <FeatherIcon icon="edit" /> Editar
                </EditButton>
                <DeleteButton onClick={() => handleDeleteProfessor(professor._id)}>
                  <FeatherIcon icon="trash-2" /> Remover
                </DeleteButton>
              </div>
            </ProfessorCard>
          ))
        )}
      </ProfessorsContainer>
    </ProtectedRoute>
  );
}