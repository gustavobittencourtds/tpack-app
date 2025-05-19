import tpackStyles from "../styles/tpack.module.css";
import ProtectedRoute from "../components/ProtectedRoute";
import Breadcrumbs from "../components/Breadcrumbs";
import dynamic from 'next/dynamic';

const FeatherIcon = dynamic(() => import('feather-icons-react'), { ssr: false });

export default function TpackGuide() {
  return (
    <ProtectedRoute>
      <div className={tpackStyles.pageContainer}>
        <Breadcrumbs title="Guia TPACK" />

        <div className={tpackStyles.hero}>
          <h1 className={tpackStyles.heroTitle}>TPACK App</h1>
          <p className={tpackStyles.heroSubtitle}>
            Avalie e desenvolva as competências docentes com um sistema simples, automatizado e visual.
            Descubra como o TPACK e o questionário TPACK.xs podem impactar sua equipe pedagógica.
          </p>
          <a href="/admin" className={tpackStyles.ctaButton}>
            Aplicar o questionário agora
          </a>
        </div>

        <section className={tpackStyles.pageSection}>
          <h2 className={tpackStyles.sectionTitle}>O que é TPACK?</h2>
          <p className={tpackStyles.paragraph}>
            TPACK é um modelo criado para ajudar professores a unirem três conhecimentos fundamentais em sala de aula: o que ensinar (Conteúdo), como ensinar (Pedagogia) e com quais ferramentas ensinar (Tecnologia). A grande força do TPACK está nas interações entre essas áreas, formando sete componentes que compõem o modelo:
          </p>

          <div className={tpackStyles.tpackGrid}>
            <div className={tpackStyles.tpackCard}>
              <h3>Conhecimento de Conteúdo (CK)</h3>
              <p>Domínio do assunto a ser ensinado</p>
            </div>
            <div className={tpackStyles.tpackCard}>
              <h3>Conhecimento Pedagógico (PK)</h3>
              <p>Métodos e práticas de ensino</p>
            </div>
            <div className={tpackStyles.tpackCard}>
              <h3>Conhecimento Tecnológico (TK)</h3>
              <p>Domínio de ferramentas tecnológicas</p>
            </div>
            <div className={tpackStyles.tpackCard}>
              <h3>Conhecimento Pedagógico do Conteúdo (PCK)</h3>
              <p>Como ensinar um conteúdo específico</p>
            </div>
            <div className={tpackStyles.tpackCard}>
              <h3>Conhecimento Tecnológico do Conteúdo (TCK)</h3>
              <p>Tecnologias adequadas para o conteúdo</p>
            </div>
            <div className={tpackStyles.tpackCard}>
              <h3>Conhecimento Tecnológico Pedagógico (TPK)</h3>
              <p>Como usar tecnologia para ensinar</p>
            </div>
            <div className={tpackStyles.tpackCard}>
              <h3>Conhecimento Tecnológico Pedagógico do Conteúdo (TPACK)</h3>
              <p>Integração dos três conhecimentos e suas interações</p>
            </div>
          </div>

          <div className={tpackStyles.figureContainer}>
            <img src="https://tpack.org/wp-content/uploads/2024/07/TPACK.png" alt="Diagrama do Modelo TPACK" width="400" />
            <p className={tpackStyles.figureCaption}>Fonte: http://tpack.org</p>
          </div>

          <section className={tpackStyles.pageSection}>
            <p className={tpackStyles.paragraph}>Para saber mais sobre o modelo teórico TPACK, acesse <a href="https://tpack.org">TPACK.org</a></p>
          </section>
        </section>

        <section className={tpackStyles.pageSection}>
          <h2 className={tpackStyles.sectionTitle}>O que é TPACK.xs?</h2>

          <p className={tpackStyles.paragraph}>
            Para ajudar professores e gestores a avaliarem essas competências, foi criado o TPACK.xs – um questionário com 28 afirmações que o educador responde em uma escala de concordância. Exemplo de pergunta: <em>"Sei como usar tecnologias digitais para facilitar a aprendizagem dos alunos em minha disciplina"</em>. As respostas revelam o perfil profissional do docente nas sete áreas do TPACK.
          </p>

          <p className={tpackStyles.paragraph}>
            Imagine que, após aplicar o questionário, você descobre que a maioria dos professores domina bem o conteúdo e a pedagogia, mas têm baixa confiança no uso de tecnologia. Isso permite agir de forma objetiva: investir em formações específicas, monitorar a evolução ao longo do tempo e tomar decisões baseadas em dados reais.
          </p>
        </section>

        <section className={tpackStyles.pageSection}>
          <h2 className={tpackStyles.sectionTitle}>Por que aplicar o TPACK?</h2>
          <p className={tpackStyles.paragraph}>
            Diversos estudos indicam que professores com domínio do TPACK utilizam tecnologias com maior intencionalidade pedagógica, criam aulas mais engajadoras e obtêm melhores resultados com seus alunos. O modelo TPACK também orienta o planejamento pedagógico, apoia a formação continuada e serve como referência para gestores no acompanhamento da equipe docente.
          </p>
          <p className={tpackStyles.paragraph}>
            Sua aplicação em programas de formação tem gerado aumentos significativos nas competências dos docentes, especialmente na habilidade de integrar ferramentas digitais de forma alinhada aos objetivos de aprendizagem (Guzmán & Bravo, 2024; Ozden et al., 2024).
          </p>
        </section>

        <section className={tpackStyles.pageSection}>
          <h2 className={tpackStyles.sectionTitle}>Aplicações do TPACK</h2>
          <p className={tpackStyles.paragraph}>
            Pesquisas demonstram que o modelo TPACK pode ser aplicado para:
          </p>

          <div className={tpackStyles.applicationsGrid}>
            <div className={tpackStyles.applicationCard}>
              <div className={tpackStyles.applicationIcon}>
                <FeatherIcon icon="clipboard" size={24} />
              </div>
              <p className={tpackStyles.applicationText}>
                Avaliar as competências docentes para integração tecnológica
              </p>
            </div>

            <div className={tpackStyles.applicationCard}>
              <div className={tpackStyles.applicationIcon}>
                <FeatherIcon icon="users" size={24} />
              </div>
              <p className={tpackStyles.applicationText}>
                Orientar programas de desenvolvimento profissional docente
              </p>
            </div>

            <div className={tpackStyles.applicationCard}>
              <div className={tpackStyles.applicationIcon}>
                <FeatherIcon icon="monitor" size={24} />
              </div>
              <p className={tpackStyles.applicationText}>
                Analisar práticas pedagógicas em contextos de ensino remoto
              </p>
            </div>

            <div className={tpackStyles.applicationCard}>
              <div className={tpackStyles.applicationIcon}>
                <FeatherIcon icon="book-open" size={24} />
              </div>
              <p className={tpackStyles.applicationText}>
                Fundamentar políticas institucionais de formação continuada
              </p>
            </div>

            <div className={tpackStyles.applicationCard}>
              <div className={tpackStyles.applicationIcon}>
                <FeatherIcon icon="calendar" size={24} />
              </div>
              <p className={tpackStyles.applicationText}>
                Apoiar o planejamento pedagógico com base na integração entre conteúdo, tecnologia e métodos de ensino
              </p>
            </div>

            <div className={tpackStyles.applicationCard}>
              <div className={tpackStyles.applicationIcon}>
                <FeatherIcon icon="bar-chart-2" size={24} />
              </div>
              <p className={tpackStyles.applicationText}>
                Subsidiar gestores escolares na identificação de lacunas e potencialidades da equipe docente
              </p>
            </div>
          </div>
        </section>

        <section className={tpackStyles.pageSection}>
          <h2 className={tpackStyles.sectionTitle}>Por que usar nosso sistema?</h2>
          <p className={tpackStyles.paragraph}>
            Aplicar o TPACK.xs em ferramentas como Google Forms pode até funcionar, mas exige esforço extra para analisar os dados, interpretar os resultados e tirar conclusões práticas. Nosso sistema foi criado para resolver isso: tudo acontece em um único ambiente, com design amigável e foco na tomada de decisão.
          </p>
          <p className={tpackStyles.paragraph}>
            Você envia os questionários por e-mail, acompanha quem respondeu, visualiza relatórios estatísticos por dimensão do TPACK, recebe interpretações automáticas e pode comparar a evolução de cada docente ao longo do tempo. Isso economiza tempo e transforma dados em ações concretas.
          </p>

          <div className={tpackStyles.featureCards}>
            <div className={tpackStyles.featureCard}>
              <div className={tpackStyles.featureIcon}><FeatherIcon icon="send" size={24} /></div>
              <h3 className={tpackStyles.featureTitle}>Aplicação do Questionário</h3>
              <p className={tpackStyles.featureDescription}>Envio automatizado e personalizado do TPACK.xs para cada professor, com links únicos e prazo de resposta configurável.</p>
            </div>

            <div className={tpackStyles.featureCard}>
              <div className={tpackStyles.featureIcon}><FeatherIcon icon="bar-chart-2" size={24} /></div>
              <h3 className={tpackStyles.featureTitle}>Análise de Dados</h3>
              <p className={tpackStyles.featureDescription}>Resultados em tempo real, com gráficos e indicadores para cada uma das sete dimensões do TPACK.</p>
            </div>

            <div className={tpackStyles.featureCard}>
              <div className={tpackStyles.featureIcon}><FeatherIcon icon="file-text" size={24} /></div>
              <h3 className={tpackStyles.featureTitle}>Relatórios Acessíveis</h3>
              <p className={tpackStyles.featureDescription}>Relatórios prontos para reuniões pedagógicas, formações ou envio institucional.</p>
            </div>
          </div>
        </section>

        <section className={tpackStyles.pageSection}>
          <h2 className={tpackStyles.sectionTitle}>Referências Bibliográficas</h2>
          <ul className={tpackStyles.referenceList}>
            <li>GARCIA, R. V. B. et al. Ensino Remoto Emergencial: práticas educacionais e percepções docentes. Educacao & Realidade, v. 48, 2023.</li>
            <li>KOEHLER, M.; MISHRA, P. What is technological pedagogical content knowledge (TPACK)?. Contemporary issues in technology and teacher education, v. 9, n. 1, p. 60-70, 2009.</li>
            <li>MISHRA, P.; KOEHLER, M. J. Technological pedagogical content knowledge: A framework for teacher knowledge. Teachers College Record, v. 108, n. 6, p. 1017-1054, 2006.</li>
            <li>RIBEIRO, P. R. L.; PIEDADE, J. M. N. Formação de Professores para EAD: uma Análise Considerando os Domínios de Conhecimento do Modelo TPACK. EaD em Foco, v. 13, n. 1, e1935, 2023.</li>
            <li>SCHMID, M.; BRIANZA, E.; PETKO, D. Developing a short assessment instrument for Technological Pedagogical Content Knowledge (TPACK.xs). Computers & Education, v. 157, 2020.</li>
            <li>VOOGT, J. et al. Technological pedagogical content knowledge-a review of the literature. Journal of computer assisted learning, v. 29, n. 2, p. 109-121, 2013.</li>
            <li>GUZMÁN, J. R.; BRAVO, G. J. V. TPACK in In-service Secondary Education Teachers: A Systematic Review. IJEMST, v. 12, n. 1, 2024.</li>
            <li>OZDEN, S. Y. et al. Reflections from a teacher education course built on the TPACK framework. Social Sciences & Humanities Open, v. 9, 2024.</li>
          </ul>
        </section>
      </div>
    </ProtectedRoute>
  );
}