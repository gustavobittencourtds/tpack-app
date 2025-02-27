import { useState, useEffect } from 'react';
import {
  ProfessorsContainer,
  ProfessorsHeader,
  TableContainer,
  Table,
  TableRow,
  TableHeader,
  TableCell,
  AddProfessorForm,
  AddProfessorInput,
  AddProfessorButton,
  EditButton,
  DeleteButton,
  SendButton,
  SelectAllButton,
} from '../styles/professorsStyles';
import ProtectedRoute from '../components/ProtectedRoute';

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
        const res = await fetch('/api/professors', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newProfessorEmail }),
      });

      const data = await res.json(); // Lê o corpo da resposta uma vez
      if (res.ok) {
        // Adiciona o novo professor ao array existente
        setProfessors((prevProfessors) => Array.isArray(prevProfessors) ? [...prevProfessors, data] : [data]);
        setNewProfessorEmail('');
        setMessage('Professor adicionado com sucesso!');
      } else {
        setMessage(data.message || 'Erro ao adicionar professor');
      }
    } catch (error) {
      console.error('Erro ao adicionar professor:', error);
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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: newEmail }),
      });

      if (res.ok) {
        setProfessors(professors.map((p) => (p._id === professor._id ? { ...p, email: newEmail } : p)));
        setMessage('Professor editado com sucesso!');
      } else {
        const errorText = await res.text();
        console.error('Erro ao editar professor:', errorText);
        setMessage(`Erro ao editar professor: ${errorText}`);
      }
    } catch (error) {
      console.error('Erro ao editar professor:', error);
      setMessage('Erro ao editar professor.');
    }
  };

  const handleDeleteProfessor = async (professorId: string) => {
    if (!confirm('Tem certeza que deseja remover este professor?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/professors?id=${professorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setProfessors(professors.filter((p) => p._id !== professorId));
        setMessage('Professor removido com sucesso!');
      } else {
        const errorText = await res.text();
        console.error('Erro ao remover professor:', errorText);
        setMessage(`Erro ao remover professor: ${errorText}`);
      }
    } catch (error) {
      console.error('Erro ao remover professor:', error);
      setMessage('Erro ao remover professor.');
    }
  };

  const handleSelectProfessor = (professorId: string) => {
    setSelectedProfessors((prevSelected) =>
      prevSelected.includes(professorId)
        ? prevSelected.filter((id) => id !== professorId)
        : [...prevSelected, professorId]
    );
  };

  const handleSelectAll = () => {
    if (!professors || selectedProfessors.length === professors.length) {
      setSelectedProfessors([]);
    } else {
      setSelectedProfessors(professors.map((professor) => professor._id));
    }
  };

  const handleSendQuestionnaires = async (selectedOnly: boolean) => {
    const professorIds = selectedOnly ? selectedProfessors : professors.map((professor) => professor._id);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/sendEmails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ professorIds }),
      });

      if (res.ok) {
        alert('Questionários enviados com sucesso!');
        setMessage('Questionários enviados com sucesso!');
      } else {
        const errorText = await res.text();
        console.error('Erro ao enviar questionários:', errorText);
        setMessage(`Erro ao enviar questionários: ${errorText}`);
      }
    } catch (error) {
      console.error('Erro ao enviar questionários:', error);
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
          <AddProfessorButton type="submit">Adicionar</AddProfessorButton>
        </AddProfessorForm>

        {message && <p>{message}</p>}

        <SelectAllButton onClick={handleSelectAll}>
          {!professors || selectedProfessors.length === professors.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
        </SelectAllButton>

        <SendButton onClick={() => handleSendQuestionnaires(false)}>Enviar Questionário para Todos</SendButton>
        <SendButton onClick={() => handleSendQuestionnaires(true)} disabled={selectedProfessors.length === 0}>
          Enviar Questionário para Selecionados
        </SendButton>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <TableContainer>
            <Table>
              <thead>
                <TableRow>
                  <TableHeader>Selecionar</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Ações</TableHeader>
                </TableRow>
              </thead>
              <tbody>
                {professors && professors.map((professor) => (
                  <TableRow key={professor._id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedProfessors.includes(professor._id)}
                        onChange={() => handleSelectProfessor(professor._id)}
                      />
                    </TableCell>
                    <TableCell>{professor.email}</TableCell>
                    <TableCell>
                      <EditButton onClick={() => handleEditProfessor(professor)}>Editar</EditButton>
                      <DeleteButton onClick={() => handleDeleteProfessor(professor._id)}>Remover</DeleteButton>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        )}
      </ProfessorsContainer>
    </ProtectedRoute>
  );
}
