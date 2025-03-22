import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PieChart } from "@mui/x-charts/PieChart";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import styles from "../styles/roundStyles.module.css";
import ProtectedRoute from "../components/ProtectedRoute";
import Breadcrumbs from "../components/Breadcrumbs";
import dynamic from "next/dynamic";

const FeatherIcon = dynamic(() => import("feather-icons-react"), { ssr: false });

interface Answer {
  questionId: string;
  answer: string;
  userId: string;
}

interface Questionnaire {
  _id: string;
  title: string;
  completed: boolean;
  sentDate: string;
  responseDate?: string;
  userId: string;
  roundId: string;
  professorId: string;
}

interface Round {
  _id: string;
  roundNumber: number;
  sentDate: string;
}

interface Question {
  _id: string;
  text: string;
  session_id: string;
}

interface Session {
  _id: string;
  title: string;
}

interface Professor {
  _id: string;
  email: string;
  userId: string;
}

interface SessionAverage {
  sessionId: string;
  questionAverages: { questionId: string; average: number; stdDeviation: number; median: number; mode: number; range: number; cv: number }[];
}

const theme = createTheme({
  typography: {
    fontFamily: "Inter, sans-serif",
  },
});

export default function RoundPage() {
  const router = useRouter();
  const { roundId } = router.query;

  const [round, setRound] = useState<Round | null>(null);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionAverages, setSessionAverages] = useState<SessionAverage[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(false);
  const [visibleActions, setVisibleActions] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);


  useEffect(() => {
    if (!roundId) return;

    const fetchRoundData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token não encontrado");
        }

        const res = await fetch(`/api/report?roundId=${roundId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Erro ao buscar relatório: ${res.statusText}`);
        }

        const data = await res.json();
        
        console.log("Dados da rodada:", data);

        setQuestionnaires(data.questionnaires || []);
        setAnswers(data.answers || []);
        setQuestions(data.questions || []);
        setSessions(data.sessions || []);
        setSessionAverages(data.sessionAverages || []);
        setRound(data.round || null);

        if (data.questionnaires && data.questionnaires.length > 0) {
          const professorIds = [...new Set(data.questionnaires.map((q: { professorId: string }) => q.professorId))];
          if (professorIds.length > 0) {
            const profRes = await fetch(`/api/professors?professorIds=${professorIds.join(",")}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const profData = await profRes.json();
            setProfessors(profData.professors || []);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados da rodada:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoundData();
  }, [roundId]);

  const handleToggleActions = (professorId: string) => {
    setVisibleActions(visibleActions === professorId ? null : professorId);
  };

  const handleResendQuestionnaire = async (professorId: string, questionnaireId?: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token não encontrado");
      }

      const res = await fetch("/api/resendQuestionnaire", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          professorId,
          roundId,
          questionnaireId,
        }),
      });

      if (!res.ok) {
        throw new Error(`Erro ao reenviar questionário: ${res.statusText}`);
      }

      const data = await res.json();

      // Atualiza o estado local para refletir o novo questionário
      if (questionnaireId) {
        // Remove o questionário antigo
        setQuestionnaires((prev) => prev.filter((q) => q._id !== questionnaireId));
      }

      // Adiciona o novo questionário ao estado
      setQuestionnaires((prev) => [...prev, data.newQuestionnaire]);

      setMessage("Questionário reenviado com sucesso!");
    } catch (error) {
      console.error("Erro ao reenviar questionário:", error);
      setMessage("Erro ao reenviar questionário.");
    }
  };

  // Efeito para remover a mensagem após 3 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <ProtectedRoute>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={styles.roundContainer}>
          <Breadcrumbs title="Relatórios" />

          {loading && <p>Carregando...</p>}

          <button className={styles.backButton} onClick={() => router.push("/admin")}>
            Voltar
          </button>

          {round && (
            <>
              <h1 className={styles.roundHeader}>Rodada {round.roundNumber}</h1>

              <div className={styles.roundInfoContainer}>
                <div className={styles.roundInfoItem}>
                  <strong>Criação da rodada:</strong> {new Date(round.sentDate).toLocaleDateString("pt-BR")}
                </div>
                <div className={styles.roundInfoItem}>
                  <strong>Professores participantes:</strong> {professors.length}
                </div>
              </div>

              {message && (
                <p
                  style={{
                    color: message.includes('Erro') ? '#e74c3c' : '#00b894',
                    textAlign: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  {message}
                </p>
              )}

              <div className={styles.professorListContainer}>
                {/* Lista para Mobile */}
                {professors.map((professor) => {
                  const professorQuestionnaire = questionnaires.find(
                    (q) => q.professorId === professor._id && q.roundId === roundId
                  );

                  return (
                    <div key={professor._id} className={styles.professorItem}>
                      <span className={styles.professorEmail}>{professor.email}</span>
                      <button
                        className={styles.toggleActions}
                        onClick={() => handleToggleActions(professor._id)}
                      >
                        <FeatherIcon icon="more-vertical" size={18} />
                      </button>
                      <div
                        className={`${styles.actionsBox} ${visibleActions === professor._id ? styles.visible : ''}`}
                      >
                        <span className={styles.actionText}>
                          <strong>Data de Resposta:</strong>{" "}
                          {professorQuestionnaire?.responseDate
                            ? new Date(professorQuestionnaire.responseDate).toLocaleDateString("pt-BR")
                            : "Pendente"}
                        </span>
                        <button
                          className={styles.viewAnswersButton}
                          onClick={() => {
                            if (!professorQuestionnaire) return;
                            router.push(
                              `/respostas?questionnaireId=${professorQuestionnaire._id}&professorId=${professor._id}&roundId=${roundId}`
                            );
                          }}
                          disabled={!professorQuestionnaire || !professorQuestionnaire.responseDate}
                        >
                          <FeatherIcon icon="file-text" size={20} />
                          Respostas
                        </button>

                        <button
                          aria-label="Reenviar Questionário"
                          className={styles.resendButton}
                          onClick={() => handleResendQuestionnaire(professor._id, professorQuestionnaire?._id)}
                        >
                          <FeatherIcon icon="rotate-cw" size={18} />

                          Reenviar
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Tabela para Desktop */}
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.tableRow}>
                      <th className={styles.tableHeader}>Professor</th>
                      <th className={styles.tableHeader}>Respondido em</th>
                      <th className={styles.tableHeader}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {professors.map((professor) => {
                      const professorQuestionnaire = questionnaires.find(
                        (q) => q.professorId === professor._id && q.roundId === roundId
                      );

                      return (
                        <tr key={professor._id} className={styles.tableRow}>
                          <td className={styles.tableCell}>{professor.email}</td>
                          <td className={styles.tableCell}>
                            {professorQuestionnaire?.responseDate
                              ? new Date(professorQuestionnaire.responseDate).toLocaleDateString("pt-BR")
                              : "Pendente"}
                          </td>
                          <td className={styles.tableCell}>
                            <button
                              className={styles.viewAnswersButton}
                              onClick={() => {
                                if (!professorQuestionnaire) return;
                                router.push(
                                  `/respostas?questionnaireId=${professorQuestionnaire._id}&professorId=${professor._id}&roundId=${roundId}`
                                );
                              }}
                              disabled={!professorQuestionnaire || !professorQuestionnaire.responseDate}
                            >
                              <FeatherIcon icon="file-text" size={20} />
                              Respostas
                            </button>

                            <button
                              className={styles.resendButton}
                              onClick={() => handleResendQuestionnaire(professor._id, professorQuestionnaire?._id)}
                            >
                              <FeatherIcon icon="rotate-cw" size={18} />

                              Reenviar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {sessionAverages.length > 0 && sessions.length > 0 && (
            <>
              {sessionAverages.every(({ questionAverages }) => questionAverages.every((qa) => qa.average === 0)) ? (
                <p className={styles.noDataMessage}>Aguardando respostas</p>
              ) : (
                sessionAverages.map(({ sessionId, questionAverages }) => {
                  const sessionTitle = sessions.find((s) => s._id === sessionId)?.title || "Sessão desconhecida";
                  const pieChartData = questionAverages.map((qa, index) => ({
                    id: qa.questionId,
                    value: qa.average,
                    label: questions.find((q) => q._id === qa.questionId)?.text || "Questão desconhecida",
                  }));

                  return (
                    <div key={sessionId} className={styles.chartContainer}>
                      <PieChart
                        series={[
                          {
                            data: pieChartData,
                            innerRadius: 40,
                            arcLabel: (item) => `${item.value.toFixed(2)}`,
                          },
                        ]}
                        height={320}
                        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                        slotProps={{
                          legend: {
                            hidden: true,
                          },
                          popper: {
                            sx: {
                              fontSize: '0.875rem',
                              maxWidth: '48rem',
                              '& .MuiChartsTooltip-mark': {
                                width: '1rem',
                                height: '1rem',
                                marginRight: '0.5rem',
                              },
                              '& .MuiChartsTooltip-cell:last-of-type': {
                                fontSize: '1rem',
                                fontWeight: 700,
                              },
                            }
                          },
                        }}
                        sx={{ 
                          "& .MuiPieArcLabel-root": { fill: '#FFFFFF', fontSize: '16px', fontWeight: 'bold' },
                        }}
                      />
                      <div className={styles.legendContainer}>
                        <h3 className={styles.chartTitle}>{sessionTitle}</h3>
                        {pieChartData.map((item, index) => {
                          const colors = ["#02B2AF", "#2E96FF", "#B800D8", "#60009B"];
                          const color = colors[index % colors.length];
                          const questionAverage = questionAverages.find((qa) => qa.questionId === item.id);

                          return (
                            <div key={index} className={styles.legendItem}>
                              <div className={styles.legendColor} style={{ backgroundColor: color }} />
                              <div className={styles.legendText}>
                                <p className={styles.question}>{item.label}:</p>
                                <p className={styles.statisticalData}>Média: <strong>{item.value.toFixed(2)}</strong></p>
                                <button
                                  className={styles.moreStatsButton}
                                  onClick={() => setExpandedQuestionId(item.id)}
                                >
                                  Ver mais dados estatísticos
                                </button>
                              </div>

                              {expandedQuestionId === item.id && (
                                <div
                                  className={styles.statsPopup}
                                  onClick={() => setExpandedQuestionId(null)} // Fecha o popup ao clicar no fundo
                                >
                                  <div
                                    className={styles.statsPopupContent}
                                    onClick={(e) => e.stopPropagation()} // Impede que o clique no conteúdo feche o popup
                                  >
                                    <button
                                      className={styles.closePopupButton}
                                      onClick={() => setExpandedQuestionId(null)}
                                    >
                                      &times; {/* Botão "X" */}
                                    </button>
                                    <h4>Dados Estatísticos</h4>
                                    <p className={styles.statisticalData}>
                                      <strong>Questão:</strong> {item.label}<br /><br />
                                      <strong>Média:</strong> {item.value.toFixed(2)}<br />
                                      <span className={styles.legend}>
                                        <strong>Definição:</strong> Este é o valor médio das respostas.<br /><br />
                                        <strong>Interpretação:</strong>{" "}
                                        {item.value < 3.5
                                          ? "Uma média baixa indica que o grupo não se sente confiante."
                                          : "Uma média alta mostra segurança na prática."}
                                        <br /><br />
                                        <strong>Sugestão:</strong>{" "}
                                        {item.value < 3.5
                                          ? "Considere oferecer treinamentos ou suporte para fortalecer essa prática entre os professores."
                                          : "Continue incentivando e aprimorando essa prática, pois está bem consolidada."}
                                      </span>
                                    </p>
                                    <p className={styles.statisticalData}>
                                      <strong>Desvio Padrão:</strong> {questionAverage?.stdDeviation?.toFixed(2) || 'N/A'}<br />
                                      <span className={styles.legend}>
                                        <strong>Definição:</strong> Mostra o quanto as respostas variaram.<br /><br />
                                        <strong>Interpretação:</strong>{" "}
                                        {questionAverage?.stdDeviation && questionAverage.stdDeviation > 1
                                          ? "Se for alto, significa que há muitas opiniões diferentes."
                                          : "Se for baixo, todos responderam de forma parecida."}
                                        <br /><br />
                                        <strong>Sugestão:</strong>{" "}
                                        {questionAverage?.stdDeviation && questionAverage.stdDeviation > 1
                                          ? "Promova discussões para alinhar as percepções."
                                          : "O grupo está alinhado; aproveite para consolidar essa prática."}
                                      </span>
                                    </p>
                                    <p className={styles.statisticalData}>
                                      <strong>Mediana:</strong> {questionAverage?.median?.toFixed(2) || 'N/A'}<br />
                                      <span className={styles.legend}>
                                        <strong>Definição:</strong> Representa a resposta do “meio”.<br /><br />
                                        <strong>Interpretação:</strong>{" "}
                                        {questionAverage?.median && Math.abs(questionAverage.median - item.value) > 0.5
                                          ? "Se for muito diferente da média, pode haver algumas respostas muito altas ou muito baixas."
                                          : "A maioria das respostas está próxima da média, indicando consistência."}
                                        <br /><br />
                                        <strong>Sugestão:</strong>{" "}
                                        {questionAverage?.median && Math.abs(questionAverage.median - item.value) > 0.5
                                          ? "Analise os extremos (respostas muito altas ou muito baixas) para entender as divergências."
                                          : "A consistência das respostas sugere que o grupo está alinhado."}
                                      </span>
                                    </p>
                                    <p className={styles.statisticalData}>
                                      <strong>Moda:</strong> {Array.isArray(questionAverage?.mode) ? questionAverage.mode.join(' e ') : questionAverage?.mode}<br />
                                      <span className={styles.legend}>
                                        <strong>Definição:</strong> É a resposta mais comum.<br /><br />
                                        <strong>Interpretação:</strong>{" "}
                                        {questionAverage?.mode && Math.abs(questionAverage.mode - item.value) > 0.5
                                          ? "Quando está longe da média, indica que a resposta mais escolhida não representa o grupo todo."
                                          : "A resposta mais comum reflete bem a opinião do grupo."}
                                        <br /><br />
                                        <strong>Sugestão:</strong>{" "}
                                        {questionAverage?.mode && Math.abs(questionAverage.mode - item.value) > 0.5
                                          ? "Identifique os motivos pelos quais a resposta mais comum não reflete o grupo."
                                          : "A resposta mais comum é representativa; use-a como base para decisões."}
                                      </span>
                                    </p>
                                    <p className={styles.statisticalData}>
                                      <strong>Amplitude:</strong> {questionAverage?.range?.toFixed(2) || 'N/A'}<br />
                                      <span className={styles.legend}>
                                        <strong>Definição:</strong> Diferença entre a menor e a maior resposta.<br /><br />
                                        <strong>Interpretação:</strong>{" "}
                                        {questionAverage?.range && questionAverage.range > 2
                                          ? "Uma amplitude grande mostra que as percepções são muito variadas."
                                          : "As respostas estão próximas, mostrando que o grupo pensa de forma semelhante."}
                                        <br /><br />
                                        <strong>Sugestão:</strong>{" "}
                                        {questionAverage?.range && questionAverage.range > 2
                                          ? "Promova discussões para entender as diferentes percepções e buscar consenso."
                                          : "O grupo está alinhado; aproveite para fortalecer essa prática."}
                                      </span>
                                    </p>
                                    <p className={styles.statisticalData}>
                                      <strong>Coeficiente de Variação:</strong> {questionAverage?.cv?.toFixed(2) || 'N/A'}%<br />
                                      <span className={styles.legend}>
                                        <strong>Definição:</strong> Indica a variação proporcional.<br /><br />
                                        <strong>Interpretação:</strong>{" "}
                                        {questionAverage?.cv && questionAverage.cv > 20
                                          ? "Quanto maior o CV, mais diferentes são as respostas."
                                          : "Um valor baixo mostra que o grupo pensa parecido."}
                                        <br /><br />
                                        <strong>Sugestão:</strong>{" "}
                                        {questionAverage?.cv && questionAverage.cv > 20
                                          ? "Identifique as causas da divergência e promova ações para alinhar as percepções."
                                          : "O grupo está alinhado; consolide essa prática."}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              )}

                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </ThemeProvider>
    </ProtectedRoute>
  );
}