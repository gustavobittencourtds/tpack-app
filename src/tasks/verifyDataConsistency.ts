import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função para carregar arquivos JSON
function readJSONFile(filePath: string) {
  const data = fs.readFileSync(path.join(__dirname, '..', '..', 'data', filePath), 'utf-8');
  return JSON.parse(data);
}

function verifyConsistency() {
  const questionsData = readJSONFile('questions.json');
  const choicesData = readJSONFile('choices.json');

  // Mapeia os IDs das questões para facilitar a verificação
  const questionIds = new Set(questionsData.map((q: any) => q.order));

  let allChoicesValid = true;

  // Verifica cada choice para confirmar se o question_id existe em questions.json
  for (const choice of choicesData) {
    if (!questionIds.has(choice.question_id)) {
      console.error(`Erro: Choice "${choice.text}" possui um question_id inválido: ${choice.question_id}`);
      allChoicesValid = false;
    }
  }

  if (allChoicesValid) {
    console.log("Todos os question_id em choices.json possuem correspondências válidas em questions.json.");
  } else {
    console.error("Inconsistências encontradas. Revise choices.json para corrigir question_id inválidos.");
  }
}

verifyConsistency();
