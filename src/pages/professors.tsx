import { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import dynamic from 'next/dynamic';
import styles from '../styles/professorsStyles.module.css';
import { useRouter } from 'next/router';
import Breadcrumbs from '../components/Breadcrumbs';
import { useToast } from '../contexts/ToastContext';

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
  const [uploadLoading, setUploadLoading] = useState(false);
  const [visibleActions, setVisibleActions] = useState<string | null>(null); // Controla ações visíveis
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controla o menu flutuante no mobile
  const [showUploadMenu, setShowUploadMenu] = useState(false); // Controla o menu de upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProfessors = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/professors', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setProfessors(data.professors || []);
      } catch (error) {
        console.error('Erro ao buscar professores:', error);
        setProfessors([]);
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
    if (!newProfessorEmail) {
      showToast('Por favor, informe o e-mail do professor.', 'error');
      return;
    }

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
        showToast('Professor adicionado com sucesso!', 'success');
      } else {
        showToast(data.message || 'Erro ao adicionar professor', 'error');
      }
    } catch (error) {
      showToast('Erro ao adicionar professor.', 'error');
    }
  };
  const handleUploadCSV = async () => {
    if (!fileInputRef.current?.files?.length) {
      showToast('Por favor, selecione um arquivo CSV para upload.', 'error');
      return;
    }

    const file = fileInputRef.current.files[0];
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      showToast('Por favor, selecione um arquivo CSV válido.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploadLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/uploadProfessors', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}` 
        },
        body: formData,
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Se houver professores adicionados com sucesso, recarregar a lista
        if (data.success) {
          showToast(data.message, 'success');
            // Mostrar detalhes se houver erros
          if (data.errors && data.errors.length > 0) {
            console.log('Erros no processamento do CSV:', data.errors);
            showToast(`Atenção: ${data.errors.length} linhas não foram processadas. Verifique o console para detalhes.`, 'error');
          }
          
          // Recarregar a lista de professores
          const response = await fetch('/api/professors', { 
            headers: { Authorization: `Bearer ${token}` } 
          });
          const newData = await response.json();
          setProfessors(newData.professors || []);
          
          // Limpar o campo de arquivo
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          
          // Fechar o menu de upload
          setShowUploadMenu(false);
        } else {
          showToast('Nenhum professor foi adicionado. Verifique o console para erros.', 'error');
          console.log('Erros no processamento do CSV:', data.errors);
        }
      } else {
        showToast(data.message || 'Erro ao processar o arquivo CSV', 'error');
      }
    } catch (error) {
      console.error('Erro ao fazer upload de CSV:', error);
      showToast('Erro ao processar o arquivo CSV', 'error');
    } finally {
      setUploadLoading(false);
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
        showToast('Professor editado com sucesso!', 'success');
      } else {
        showToast('Erro ao editar professor.', 'error');
      }
    } catch (error) {
      showToast('Erro ao editar professor.', 'error');
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
        showToast('Professor removido com sucesso!', 'success');
      } else {
        showToast('Erro ao remover professor.', 'error');
      }
    } catch (error) {
      showToast('Erro ao remover professor.', 'error');
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
        showToast('Questionários enviados com sucesso!', 'success');
      } else {
        showToast('Erro ao enviar questionários.', 'error');
      }
    } catch (error) {
      showToast('Erro ao enviar questionários.', 'error');
    }
  };  const handleToggleActions = (professorId: string) => {
    setVisibleActions(visibleActions === professorId ? null : professorId);
  };

  const toggleUploadMenu = () => {
    setShowUploadMenu(!showUploadMenu);
  };

  const scrollToAddForm = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false); // Fecha o menu ao rolar
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleFileChange = () => {
    if (fileInputRef.current?.files?.length) {
      handleUploadCSV();
    }
  };

  return (
    <ProtectedRoute>      <div className={styles.professorsContainer}>
        <Breadcrumbs title="Professores" />
        <h1 className={styles.professorsHeader}>Professores</h1>
        <div className={styles.addProfessorContainer}>
          <form className={styles.addProfessorForm} onSubmit={handleAddProfessor}>
            <input
              type="email"
              placeholder="Email do professor"
              value={newProfessorEmail}
              onChange={(e) => setNewProfessorEmail(e.target.value)}
              className={styles.addProfessorInput}
            />
            <button type="submit" className={styles.addProfessorButton} title="Adicionar professor">
              <FeatherIcon icon="plus" size={25} />
            </button>
            <div className={styles.uploadButtonContainer}>
              <button 
                type="button" 
                className={styles.uploadButton} 
                onClick={toggleUploadMenu}
                title="Upload de professores"
              >
                <FeatherIcon icon="upload" size={25} />
              </button>
              {showUploadMenu && (
                <div className={styles.uploadMenu}>
                  <div className={styles.uploadMenuItem}>
                    <label htmlFor="csvFileInput" className={styles.uploadMenuItemLabel}>
                      <FeatherIcon icon="file-text" size={20} /> Upload via CSV
                    </label>
                    <input
                      type="file"
                      id="csvFileInput"
                      accept=".csv"
                      ref={fileInputRef}
                      className={styles.fileInput}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
        <div className={styles.actionBar}>
          <button
            className={styles.selectAllButton}
            onClick={handleSelectAll}
            disabled={professors.length === 0}
          >
            <FeatherIcon icon="check-square" size={22} />
            {selectedProfessors.length === professors.length ? 'Desmarcar todos' : 'Selecionar todos'}
          </button>
          
          <button
            className={styles.sendButton}
            onClick={() => handleSendQuestionnaires(true)}
            disabled={selectedProfessors.length === 0}
          >
            <FeatherIcon icon="send" size={20} /> Enviar para selecionados
          </button>        </div>
        {loading || uploadLoading ? (
          <p style={{ textAlign: 'center', color: '#636e72' }}>
            {uploadLoading ? 'Processando arquivo...' : 'Carregando...'}
          </p>
        ) : professors.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Nenhum professor cadastrado ainda.</p>
            <p>Comece adicionando professores para enviar questionários.</p>
          </div>
        ) : (
          professors.map((professor) => (
            <div key={professor._id} className={styles.professorCard} style={{ position: 'relative' }}>
              <div className={styles.professorInfos}>
                <input
                  type="checkbox"
                  checked={selectedProfessors.includes(professor._id)}
                  onChange={() => handleSelectProfessor(professor._id)}
                />
                <span>{professor.email}</span>
                <button
                  className={styles.toggleActions}
                  onClick={() => handleToggleActions(professor._id)}
                >
                  <FeatherIcon icon="more-vertical" size={18} />
                </button>
              </div>
              <div className={`${styles.actions} ${visibleActions === professor._id ? styles.visible : ''}`}>
                <button className={styles.editButton} onClick={() => handleEditProfessor(professor)}>
                  <FeatherIcon icon="edit" size={18} /> Editar
                </button>
                <button className={styles.deleteButton} onClick={() => handleDeleteProfessor(professor._id)}>
                  <FeatherIcon icon="trash-2" size={18} /> Remover
                </button>
                <button className={styles.viewButton} onClick={() => handleViewQuestionnaires(professor._id)}>
                  <FeatherIcon icon="list" size={18} /> Questionários
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <button className={styles.floatingButton} onClick={toggleMenu}>
        <FeatherIcon icon={isMenuOpen ? 'x' : 'grid'} size={24} />
      </button>
      <div className={`${styles.floatingMenu} ${isMenuOpen ? styles.visible : ''}`}>
        <button
          className={styles.selectAllButton}
          onClick={() => {
            handleSelectAll();
            setIsMenuOpen(false);
          }}
          disabled={professors.length === 0}
        >
          <FeatherIcon icon="check-square" size={22} />
          {selectedProfessors.length === professors.length ? 'Desmarcar todos' : 'Selecionar todos'}
        </button>
        <button
          className={styles.sendButton}
          onClick={() => {
            handleSendQuestionnaires(true);
            setIsMenuOpen(false);
          }}
          disabled={selectedProfessors.length === 0}
        >
          <FeatherIcon icon="send" size={22} /> Enviar para selecionados
        </button>        <button className={styles.addProfessorButton} onClick={scrollToAddForm}>
          <FeatherIcon icon="plus" size={22} /> Adicionar professor
        </button>
        <button className={styles.uploadButton} onClick={() => {
          scrollToAddForm();
          setTimeout(() => setShowUploadMenu(true), 300);
          setIsMenuOpen(false);
        }}>
          <FeatherIcon icon="upload" size={22} /> Upload via CSV
        </button>
      </div>
    </ProtectedRoute>
  );
}