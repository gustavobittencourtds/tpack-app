import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { IQuestion } from "../models/Question";

// Copiado do round.tsx
interface SessionAverage {
  sessionId: string;
  questionAverages: {
    questionId: string;
    average: number;
    stdDeviation: number;
    median: number;
    mode: number[]; // array, conforme backend
    range: number;
    cv: number;
  }[];
}

export function exportRoundStatsToPDF(
  questions: IQuestion[],
  sessions: { _id: string; title: string }[],
  sessionAverages: SessionAverage[]
) {
  const doc = new jsPDF();
  let y = 10;

  doc.setFontSize(18);
  doc.text("Relatório Estatístico da Rodada", 14, y);
  y += 10;

  sessionAverages.forEach((sessionAvg, idx) => {
    const sessionTitle = sessions.find(s => s._id === sessionAvg.sessionId)?.title || `Sessão ${idx + 1}`;

    doc.setFontSize(15);
    doc.setTextColor("#222");
    doc.text(sessionTitle, 14, y + 8);
    y += 12;

    sessionAvg.questionAverages.forEach((stats, qIdx) => {
      const question = questions.find(q => q._id === stats.questionId);
      if (!question) return;

      doc.setFontSize(13);
      doc.setTextColor("#222");
      doc.text(`${qIdx + 1}. ${question.text}`, 14, y + 8);

      autoTable(doc, {
        startY: y + 12,
        head: [["Média", "Desvio Padrão", "Mediana", "Moda", "Amplitude", "Coef. Variação"]],
        body: [[
          stats.average !== undefined ? stats.average.toFixed(2) : "N/A",
          stats.stdDeviation !== undefined ? stats.stdDeviation.toFixed(2) : "N/A",
          stats.median !== undefined ? stats.median.toFixed(2) : "N/A",
          Array.isArray(stats.mode)
            ? stats.mode.map((m: number) => m.toFixed(2)).join(" e ")
            : "N/A",
          stats.range !== undefined ? stats.range.toFixed(2) : "N/A",
          stats.cv !== undefined ? stats.cv.toFixed(2) : "N/A"
        ]],
        theme: "grid",
        styles: { fontSize: 11 },
        margin: { left: 14, right: 14 }
      });

      // @ts-ignore
      y = doc.lastAutoTable.finalY + 8;
    });
  });

  // Legendas ao final
  doc.setFontSize(12);
  doc.setTextColor("#222");
  doc.text("Legendas:", 14, y + 10);

  const legends = [
    "Média: Valor médio das respostas.",
    "Desvio Padrão: O quanto as respostas variaram.",
    "Mediana: Resposta do meio.",
    "Moda: Resposta mais frequente.",
    "Amplitude: Diferença entre maior e menor resposta.",
    "Coef. Variação: Variação relativa das respostas."
  ];
  legends.forEach((legend, i) => {
    doc.text(`- ${legend}`, 16, y + 18 + i * 7);
  });

  doc.save("relatorio_estatistico_rodada.pdf");
}