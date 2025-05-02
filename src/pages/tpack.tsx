import sharedStyles from "../styles/shared.module.css";
import ProtectedRoute from "../components/ProtectedRoute";
import Breadcrumbs from "../components/Breadcrumbs";
import {
  Book,
  BarChart2,
  Zap,
  Send,
  Clock,
  Sun,
  User,
  Award,
  DollarSign,
  TrendingUp,
  Layers,
  Target,
  BookOpen,
  PieChart,
  Mail,
  Users,
  Activity,
  FileText,
  CheckCircle
} from "feather-icons-react";

export default function TpackGuide() {
  return (
    <ProtectedRoute>
      <div className={sharedStyles.pageContainer}>
        <Breadcrumbs title="Guia TPACK" />

        <h1 className={sharedStyles.pageHeader}>Transforme a Educação com o Poder do TPACK</h1>
        <p className={sharedStyles.pageSubheader}>
          Nosso sistema integrado ajuda instituições de ensino a avaliar e desenvolver as competências tecnológicas, pedagógicas e de conteúdo de seus professores, seguindo o modelo TPACK - a abordagem mais reconhecida mundialmente para integração efetiva de tecnologia na educação.
        </p>

        {/* Seção sobre o modelo TPACK */}
        <div className={sharedStyles.cardGradient}>
          <h2 className={sharedStyles.sectionTitle}>O que é o Modelo TPACK?</h2>
          <p className={sharedStyles.paragraph}>
            Desenvolvido por Mishra e Koehler (2006), o <strong>TPACK (Technological Pedagogical Content Knowledge)</strong> é um modelo teórico que revolucionou a forma como entendemos a integração da tecnologia na educação. Ele vai além da simples presença de ferramentas tecnológicas em sala de aula, destacando a importância da articulação entre três domínios fundamentais:
          </p>

          <div className={sharedStyles.featureCards}>
            <div className={sharedStyles.featureCard}>
              <div className={sharedStyles.featureIcon}><Book size={28} /></div>
              <h3 className={sharedStyles.featureTitle}>Conhecimento Pedagógico (PK)</h3>
              <p className={sharedStyles.featureDescription}>Métodos e estratégias de ensino, compreensão de como os alunos aprendem e como avaliar esse aprendizado.</p>
              <ul className={sharedStyles.contentList}>
                <li><CheckCircle size={18} className={sharedStyles.listIcon} /> Planejamento de aulas</li>
                <li><CheckCircle size={18} className={sharedStyles.listIcon} /> Estratégias de avaliação</li>
                <li><CheckCircle size={18} className={sharedStyles.listIcon} /> Gestão de sala de aula</li>
              </ul>
            </div>

            <div className={sharedStyles.featureCard}>
              <div className={sharedStyles.featureIcon}><User size={28} /></div>
              <h3 className={sharedStyles.featureTitle}>Conhecimento de Conteúdo (CK)</h3>
              <p className={sharedStyles.featureDescription}>Domínio do assunto a ser ensinado, incluindo conceitos, teorias e estruturas da disciplina.</p>
              <ul className={sharedStyles.contentList}>
                <li><CheckCircle size={18} className={sharedStyles.listIcon} /> Conhecimento profundo</li>
                <li><CheckCircle size={18} className={sharedStyles.listIcon} /> Atualização constante</li>
                <li><CheckCircle size={18} className={sharedStyles.listIcon} /> Conexões interdisciplinares</li>
              </ul>
            </div>

            <div className={sharedStyles.featureCard}>
              <div className={sharedStyles.featureIcon}><Zap size={28} /></div>
              <h3 className={sharedStyles.featureTitle}>Conhecimento Tecnológico (TK)</h3>
              <p className={sharedStyles.featureDescription}>Habilidade de usar ferramentas tecnológicas de forma geral e específica para fins educacionais.</p>
              <ul className={sharedStyles.contentList}>
                <li><CheckCircle size={18} className={sharedStyles.listIcon} /> Ferramentas digitais</li>
                <li><CheckCircle size={18} className={sharedStyles.listIcon} /> Plataformas educacionais</li>
                <li><CheckCircle size={18} className={sharedStyles.listIcon} /> Recursos multimídia</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Seção de benefícios */}
        <section className={sharedStyles.pageSection}>
          <h2 className={sharedStyles.sectionTitle}>Vantagens do TPACK para sua instituição</h2>

          <p className={sharedStyles.testimonial}>
            "O modelo TPACK fornece uma estrutura valiosa para entender como os professores podem integrar efetivamente a tecnologia em seu ensino, não como um complemento, mas como parte integrante do processo educacional."
            <div className={sharedStyles.testimonialAuthor}>- Schmid, Brianza & Petko (2020)</div>
          </p>

          <div className={sharedStyles.featureCards}>
            <div className={sharedStyles.featureCard}>
              <div className={sharedStyles.featureIcon}><Award size={28} /></div>
              <h3 className={sharedStyles.featureTitle}>Melhoria nos resultados</h3>
              <p className={sharedStyles.featureDescription}>Professores com alto TPACK têm alunos com melhor desempenho acadêmico.</p>
            </div>

            <div className={sharedStyles.featureCard}>
              <div className={sharedStyles.featureIcon}><TrendingUp size={28} /></div>
              <h3 className={sharedStyles.featureTitle}>Preparação para o futuro</h3>
              <p className={sharedStyles.featureDescription}>Adaptação a novos cenários educacionais digitais.</p>
            </div>

            <div className={sharedStyles.featureCard}>
              <div className={sharedStyles.featureIcon}><DollarSign size={28} /></div>
              <h3 className={sharedStyles.featureTitle}>Otimização de recursos</h3>
              <p className={sharedStyles.featureDescription}>Melhor aproveitamento dos investimentos em tecnologia.</p>
            </div>
          </div>
        </section>

        {/* Seção de funcionalidades do sistema */}
        <section className={sharedStyles.pageSection}>
          <h2 className={sharedStyles.sectionTitle}>Como nosso sistema transforma a avaliação TPACK</h2>
          <p className={sharedStyles.paragraph}>
            Enquanto muitas instituições ainda dependem de múltiplas ferramentas desconectadas, nosso sistema oferece uma solução completa e integrada para todo o processo de avaliação TPACK.
          </p>

          <div className={sharedStyles.featureCards}>
            <div className={sharedStyles.featureCard}>
              <div className={sharedStyles.featureIcon}><Send size={28} /></div>
              <h3 className={sharedStyles.featureTitle}>Aplicação Simplificada</h3>
              <p className={sharedStyles.featureDescription}>Envie questionários TPACK.xs por e-mail com um clique.</p>
              <ul className={sharedStyles.contentList}>
                <li><Mail size={18} className={sharedStyles.listIcon} /> Envio em massa</li>
                <li><Clock size={18} className={sharedStyles.listIcon} /> Controle de prazos</li>
                <li><Users size={18} className={sharedStyles.listIcon} /> Gerenciamento de respondentes</li>
              </ul>
            </div>

            <div className={sharedStyles.featureCard}>
              <div className={sharedStyles.featureIcon}><BarChart2 size={28} /></div>
              <h3 className={sharedStyles.featureTitle}>Análise Automatizada</h3>
              <p className={sharedStyles.featureDescription}>Relatórios instantâneos com todas as métricas estatísticas.</p>
              <ul className={sharedStyles.contentList}>
                <li><PieChart size={18} className={sharedStyles.listIcon} /> Gráficos interativos</li>
                <li><Activity size={18} className={sharedStyles.listIcon} /> Comparativos entre turmas</li>
                <li><FileText size={18} className={sharedStyles.listIcon} /> Exportação de relatórios</li>
              </ul>
            </div>

            <div className={sharedStyles.featureCard}>
              <div className={sharedStyles.featureIcon}><Sun size={28} /></div>
              <h3 className={sharedStyles.featureTitle}>Sugestões Inteligentes</h3>
              <p className={sharedStyles.featureDescription}>Recomendações personalizadas baseadas nos resultados.</p>
              <ul className={sharedStyles.contentList}>
                <li><BookOpen size={18} className={sharedStyles.listIcon} /> Materiais de apoio</li>
                <li><TrendingUp size={18} className={sharedStyles.listIcon} /> Planos de desenvolvimento</li>
                <li><Target size={18} className={sharedStyles.listIcon} /> Metas personalizadas</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Diferenciais competitivos */}
        <section className={sharedStyles.pageSection}>
          <h2 className={sharedStyles.sectionTitle}>O que nos torna únicos</h2>
          <div className={sharedStyles.featureCards}>
            <div className={sharedStyles.featureCard}>
              <div className={sharedStyles.featureIcon}><Layers size={28} /></div>
              <h3 className={sharedStyles.featureTitle}>Solução Completa</h3>
              <p className={sharedStyles.featureDescription}>Único sistema que cobre desde a aplicação até a análise avançada em uma única plataforma.</p>
            </div>

            <div className={sharedStyles.featureCard}>
              <div className={sharedStyles.featureIcon}><Activity size={28} /></div>
              <h3 className={sharedStyles.featureTitle}>Precisão Decimal</h3>
              <p className={sharedStyles.featureDescription}>Escala Likert de 0.1 em 0.1 para maior granularidade nos dados.</p>
            </div>

            <div className={sharedStyles.featureCard}>
              <div className={sharedStyles.featureIcon}><BookOpen size={28} /></div>
              <h3 className={sharedStyles.featureTitle}>Baseado em Evidências</h3>
              <p className={sharedStyles.featureDescription}>Desenvolvido com base nas melhores práticas acadêmicas sobre avaliação TPACK.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className={sharedStyles.ctaSection}>
          <h3 className={sharedStyles.ctaTitle}>Pronto para revolucionar a avaliação docente em sua instituição?</h3>
          <p className={sharedStyles.ctaText}>
            Descubra como nosso sistema pode ajudar você a entender e desenvolver as competências TPACK de seus professores.
          </p>
          <button className={sharedStyles.primaryButton}>Experimente Gratuitamente</button>
        </div>

        {/* Referências */}
        <section className={sharedStyles.pageSection}>
          <h2 className={sharedStyles.sectionTitle}>Referências</h2>
          <ul className={sharedStyles.contentList} style={{ gridTemplateColumns: '1fr' }}>
            <li>KOEHLER, M.; MISHRA, P. What is technological pedagogical content knowledge (TPACK)?. Contemporary issues in technology and teacher education, v. 9, n. 1, p. 60-70, 2009.</li>
            <li>MISHRA, P.; KOEHLER, M. J. Technological pedagogical content knowledge: A framework for teacher knowledge. Teachers College Record, 2006.</li>
            <li>SCHMID, M.; BRIANZA, E.; PETKO, D. Developing a short assessment instrument for Technological Pedagogical Content Knowledge (TPACK.xs) and comparing the factor structure of an integrative and a transformative model. Computers & Education, v. 157, p. 103967, 2020.</li>
          </ul>
        </section>
      </div>
    </ProtectedRoute>
  );
}