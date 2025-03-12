import { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import dynamic from 'next/dynamic';
import styles from '../styles/professorsStyles.module.css';
import { useRouter } from 'next/router';
import Breadcrumbs from '../components/Breadcrumbs';

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
  const router = useRouter();

  useEffect(() => {
    const fetchProfessors = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/professors', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setProfessors(data.professors || []); // Garante que seja um array
      } catch (error) {
        console.error('Erro ao buscar professores:', error);
        setProfessors([]); // Define como array vazio em caso de erro
      } finally {
        setLoading(false);
      }
    };
    fetchProfessors();
  }, []);

  const handleViewQuestionnaires = (professorId: string) => {
    router.push(`/questionnaires?professorId=${professorId}`);
  };

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
      <div className={styles.professorsContainer}>
        <Breadcrumbs title="Professores" />
        <h1 className={styles.professorsHeader}>Professores</h1>
        <form className={styles.addProfessorForm} onSubmit={handleAddProfessor}>
          <input
            type="email"
            placeholder="Email do professor"
            value={newProfessorEmail}
            onChange={(e) => setNewProfessorEmail(e.target.value)}
            className={styles.addProfessorInput}
          />
          <button type="submit" className={styles.addProfessorButton}>
            <FeatherIcon icon="plus" /> Adicionar
          </button>
        </form>
        {message && <p style={{ color: message.includes('Erro') ? '#e74c3c' : '#00b894', textAlign: 'center' }}>{message}</p>}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '4rem' }}>
          <button
            className={styles.selectAllButton}
            onClick={handleSelectAll}
            disabled={professors.length === 0} // Desabilita o botão se não houver professores
          >
            {selectedProfessors.length === professors.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
          </button>
          <button
            className={styles.sendButton}
            onClick={() => handleSendQuestionnaires(false)}
            disabled={professors.length === 0} // Desabilita o botão se não houver professores
          >
            Enviar para Todos
          </button>
          <button
            className={styles.sendButton}
            onClick={() => handleSendQuestionnaires(true)}
            disabled={selectedProfessors.length === 0} // Desabilita o botão se nenhum professor estiver selecionado
          >
            <FeatherIcon icon="send" />
            Enviar para Selecionados
          </button>
        </div>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#636e72' }}>Carregando...</p>
        ) : professors.length === 0 ? ( // Verifica se não há professores
          <div className={styles.emptyState}>
            <p>Nenhum professor cadastrado ainda.</p>
            <p>Comece adicionando professores para enviar questionários.</p>
          </div>
        ) : (
          professors.map((professor) => (
            console.log(professor),
            <div key={professor._id} className={styles.professorCard}>
              <div className={styles.professorInfos}>
                <input
                  type="checkbox"
                  checked={selectedProfessors.includes(professor._id)}
                  onChange={() => handleSelectProfessor(professor._id)}
                />
                <span>{professor.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button className={styles.editButton} onClick={() => handleEditProfessor(professor)}>
                  <FeatherIcon icon="edit" /> Editar
                </button>
                <button className={styles.deleteButton} onClick={() => handleDeleteProfessor(professor._id)}>
                  <FeatherIcon icon="trash-2" /> Remover
                </button>
                <button className={styles.viewButton} onClick={() => handleViewQuestionnaires(professor._id)}>
                  <FeatherIcon icon="list" /> Questionários
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </ProtectedRoute>
  );
}