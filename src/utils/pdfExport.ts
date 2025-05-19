import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { autoTable } from 'jspdf-autotable';

interface QuestionStatistics {
  questionId: string;
  questionText: string;
  average: number;
  stdDeviation: number;
  median: number;
  mode: number[] | number;
  range: number;
  cv: number;
}

interface Session {
  _id: string;
  title: string;
}

interface SessionData {
  sessionTitle: string;
  questions: QuestionStatistics[];
}

// Função para exportar respostas de um único professor em PDF
export function exportSingleProfessorToPdf(
  rows: Array<{email: string, question: string, answer: string, responseDate: string}>,
  questionnaireTitle: string,
  roundNumber?: number
) {
  // Criar um novo documento PDF com orientação paisagem para acomodar as 4 colunas
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Adicionar título ao documento - posição Y reduzida para 12
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Respostas: ${questionnaireTitle}`, 148.5, 12, { align: 'center' });
  
  // Variável para controlar a posição Y, começando logo após o título
  let yPosition = 18;
  
  if (roundNumber) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Rodada ${roundNumber}`, 148.5, yPosition, { align: 'center' });
    yPosition += 8; // Incrementa em 8mm apenas se tiver número da rodada
  }
  
  if (rows.length > 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Professor: ${rows[0].email}`, 14, yPosition);
    yPosition += 5;
    doc.text(`Data de resposta: ${rows[0].responseDate}`, 14, yPosition);
    yPosition += 8;
  }
  
  // Preparar dados para tabela em formato de duas perguntas por linha (4 colunas)
  const tableRows = [];
  for (let i = 0; i < rows.length; i += 2) {
    const row = [
      rows[i].question, 
      rows[i].answer
    ];
    
    // Se tiver uma segunda pergunta no par
    if (i + 1 < rows.length) {
      row.push(rows[i + 1].question);
      row.push(rows[i + 1].answer);
    } else {
      // Se não tiver, adicionar células vazias
      row.push('');
      row.push('');
    }
    
    tableRows.push(row);
  }
  
  // Adicionar tabela com 4 colunas, começando na posição Y atual
  autoTable(doc, {
    startY: yPosition,
    head: [
      [
        { content: 'Pergunta', styles: { halign: 'left' } },
        { content: 'Resposta', styles: { halign: 'center' } },
        { content: 'Pergunta', styles: { halign: 'left' } },
        { content: 'Resposta', styles: { halign: 'center' } }
      ]
    ],
    body: tableRows,
    headStyles: { fillColor: [108, 92, 231] },
    styles: { fontSize: 10, cellPadding: 3, overflow: 'linebreak' },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 100 },
      3: { cellWidth: 30, halign: 'center' },
    }
  });
  
  // Adicionar rodapé com data de geração
  const pageCount = doc.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} - Página ${i} de ${pageCount}`, 148.5, 200, { align: 'center' });
  }
  
  // Salvar o PDF com nome específico
  doc.save(`Respostas_${questionnaireTitle.replace(/\s+/g, "_")}.pdf`);
}

// Função principal para exportar o relatório TPACK em PDF
export function exportTpackReportToPdf(
  roundNumber: number, 
  roundDate: Date,
  professorCount: number,
  sessionsData: SessionData[]
) {
  // Criar um novo documento PDF com orientação retrato
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Adicionar título ao documento
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(`Relatório TPACK - Rodada ${roundNumber}`, 105, 15, { align: 'center' });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Data da rodada: ${roundDate.toLocaleDateString('pt-BR')}`, 105, 22, { align: 'center' });
  doc.text(`Número de professores: ${professorCount}`, 105, 27, { align: 'center' });
  
  // Posição Y inicial para as tabelas
  let yPosition = 35;
  
  // Para cada sessão, criar uma seção no PDF com sua tabela de dados
  sessionsData.forEach((sessionData) => {
    // Adicionar título da sessão
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(sessionData.sessionTitle, 14, yPosition);
    yPosition += 7;
    
    // Preparar dados para tabela
    const tableData = sessionData.questions.map(q => [
      q.questionText,
      q.average.toFixed(2),
      q.stdDeviation.toFixed(2),
      q.median.toFixed(2),
      Array.isArray(q.mode) ? q.mode.map(m => m.toFixed(2)).join(", ") : q.mode.toFixed(2),
      q.range.toFixed(2),
      q.cv.toFixed(2) + "%"
    ]);
    
    // Adicionar tabela
    autoTable(doc, {
      startY: yPosition,
      head: [['Questão', 'Média', 'Desvio Padrão', 'Mediana', 'Moda', 'Amplitude', 'CV']],
      body: tableData,
      headStyles: { fillColor: [108, 92, 231] },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 80 }
      }
    });
    
    // Atualizar a posição Y para a próxima seção
    yPosition = (doc as any).lastAutoTable.finalY + 10;
    
    // Se não houver espaço suficiente para a próxima sessão, adicionar uma nova página
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 15;
    }
  });
  
  // Adicionar página de legenda
  doc.addPage();
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Legenda e Interpretação dos Resultados", 105, 15, { align: 'center' });
  
  doc.setFontSize(11);
  doc.text("Média", 14, 25);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  
  doc.setFont("helvetica", "bold");
  doc.text("Definição:", 14, 30);
  doc.setFont("helvetica", "normal");
  doc.text("Este é o valor médio das respostas, representando a tendência central dos dados.", 30, 30);
  
  doc.setFont("helvetica", "bold");
  doc.text("Interpretação:", 14, 35);
  doc.setFont("helvetica", "normal");
  doc.text("Valores abaixo de 3,5 indicam que o grupo não se sente confiante nessa", 36, 35);
  doc.text("habilidade. Valores acima de 3,5 mostram segurança na prática.", 14, 40);
  
  doc.setFont("helvetica", "bold");
  doc.text("Sugestão:", 14, 45);
  doc.setFont("helvetica", "normal");
  doc.text("Para médias baixas, considere oferecer treinamentos específicos. Para médias", 30, 45);
  doc.text("altas, continue incentivando e aprimorando as práticas existentes.", 14, 50);
  
  doc.setFont("helvetica", "bold");
  doc.text("Desvio Padrão", 14, 60);
  doc.setFont("helvetica", "normal");
  
  doc.setFont("helvetica", "bold");
  doc.text("Definição:", 14, 65);
  doc.setFont("helvetica", "normal");
  doc.text("Indica o quanto as respostas variaram em relação à média.", 30, 65);
  
  doc.setFont("helvetica", "bold");
  doc.text("Interpretação:", 14, 70);
  doc.setFont("helvetica", "normal");
  doc.text("Um desvio padrão alto (> 1) indica opiniões divergentes entre os professores.", 36, 70);
  doc.text("Um desvio baixo sugere consenso nas respostas.", 14, 75);
  
  doc.setFont("helvetica", "bold");
  doc.text("Sugestão:", 14, 80);
  doc.setFont("helvetica", "normal");
  doc.text("Para desvios altos, promova discussões para alinhar percepções. Para desvios", 30, 80);
  doc.text("baixos, aproveite o consenso para consolidar práticas.", 14, 85);
  
  doc.setFont("helvetica", "bold");
  doc.text("Mediana", 14, 95);
  doc.setFont("helvetica", "normal");
  
  doc.setFont("helvetica", "bold");
  doc.text("Definição:", 14, 100);
  doc.setFont("helvetica", "normal");
  doc.text("Representa o valor central quando as respostas são ordenadas.", 30, 100);
  
  doc.setFont("helvetica", "bold");
  doc.text("Interpretação:", 14, 105);
  doc.setFont("helvetica", "normal");
  doc.text("Quando difere muito da média (> 0,5), pode haver valores extremos", 36, 105);
  doc.text("influenciando os resultados. Medianas próximas da média indicam consistência.", 14, 110);
  
  doc.setFont("helvetica", "bold");
  doc.text("Sugestão:", 14, 115);
  doc.setFont("helvetica", "normal");
  doc.text("Se houver diferença significativa, analise os extremos para entender as divergências.", 30, 115);
  
  doc.setFont("helvetica", "bold");
  doc.text("Moda", 14, 125);
  doc.setFont("helvetica", "normal");
  
  doc.setFont("helvetica", "bold");
  doc.text("Definição:", 14, 130);
  doc.setFont("helvetica", "normal");
  doc.text("É a resposta mais comum entre os professores.", 30, 130);
  
  doc.setFont("helvetica", "bold");
  doc.text("Interpretação:", 14, 135);
  doc.setFont("helvetica", "normal");
  doc.text("Quando distante da média, indica que a resposta mais escolhida não representa", 36, 135);
  doc.text("o grupo todo. Modas próximas à média indicam representatividade.", 14, 140);
  
  doc.setFont("helvetica", "bold");
  doc.text("Sugestão:", 14, 145);
  doc.setFont("helvetica", "normal");
  doc.text("Se houver diferença, identifique os motivos da divergência entre a resposta mais", 30, 145);
  doc.text("comum e a percepção geral.", 14, 150);
  
  doc.setFont("helvetica", "bold");
  doc.text("Amplitude", 14, 160);
  doc.setFont("helvetica", "normal");
  
  doc.setFont("helvetica", "bold");
  doc.text("Definição:", 14, 165);
  doc.setFont("helvetica", "normal");
  doc.text("Diferença entre a menor e a maior resposta.", 30, 165);
  
  doc.setFont("helvetica", "bold");
  doc.text("Interpretação:", 14, 170);
  doc.setFont("helvetica", "normal");
  doc.text("Amplitudes grandes (> 2) mostram percepções muito variadas. Amplitudes", 36, 170);
  doc.text("pequenas indicam homogeneidade nas respostas.", 14, 175);
  
  doc.setFont("helvetica", "bold");
  doc.text("Sugestão:", 14, 180);
  doc.setFont("helvetica", "normal");
  doc.text("Para grandes amplitudes, promova discussões sobre as diferentes perspectivas.", 30, 180);
  
  doc.setFont("helvetica", "bold");
  doc.text("Coeficiente de Variação (CV)", 14, 190);
  doc.setFont("helvetica", "normal");
  
  doc.setFont("helvetica", "bold");
  doc.text("Definição:", 14, 195);
  doc.setFont("helvetica", "normal");
  doc.text("Indica a variação proporcional das respostas em relação à média.", 30, 195);
  
  doc.setFont("helvetica", "bold");
  doc.text("Interpretação:", 14, 200);
  doc.setFont("helvetica", "normal");
  doc.text("CV alto (> 20%) indica heterogeneidade nas respostas. CV baixo mostra", 36, 200);
  doc.text("homogeneidade nas percepções do grupo.", 14, 205);
  
  doc.setFont("helvetica", "bold");
  doc.text("Sugestão:", 14, 210);
  doc.setFont("helvetica", "normal");
  doc.text("Para CV alto, identifique as causas da divergência e promova ações para alinhar", 30, 210);
  doc.text("as percepções. Para CV baixo, consolide as práticas existentes.", 14, 215);
  
  // Adicionar rodapé com data de geração
  const pageCount = doc.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} - Página ${i} de ${pageCount}`, 105, 287, { align: 'center' });
  }
  
  // Salvar o PDF com nome específico
  doc.save(`Relatorio_TPACK_Rodada_${roundNumber}.pdf`);
}