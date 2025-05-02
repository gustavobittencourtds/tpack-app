import { saveAs } from "file-saver";

// Para múltiplos professores (rounds)
export function exportRoundAnswersToCSV(rows: {
  email: string;
  question: string;
  answer: string;
  responseDate: string;
  sentDate?: string; // opcional, caso queira usar
}[], fileName = "respostas_rodada.csv") {
  const header = ["E-mail", "Questão", "Resposta", "Data de Resposta"];
  const csvRows = rows.map(row =>
    [row.email, row.question, row.answer, row.responseDate]
      .map(field => `"${String(field).replace(/"/g, '""')}"`).join(",")
  );
  const csvContent = [header.join(","), ...csvRows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, fileName);
}

// Para respostas de um único professor
export function exportSingleProfessorAnswersToCSV(rows: {
  email: string;
  question: string;
  answer: string;
  sentDate?: string;
  responseDate: string;
}[], fileName = "respostas_professor.csv") {
  const header = ["E-mail", "Questão", "Resposta", "Data de Resposta"];
  const csvRows = rows.map(row =>
    [row.email, row.question, row.answer, row.responseDate]
      .map(field => `"${String(field).replace(/"/g, '""')}"`).join(",")
  );
  const csvContent = [header.join(","), ...csvRows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, fileName);
}