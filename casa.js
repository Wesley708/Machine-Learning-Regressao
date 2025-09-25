const fs = require('fs');
const XLSX = require('xlsx');

// Caminho do arquivo
const filePath = 'casa.xlsx';

fs.readFile(filePath, (err, data) => {
  if (err) {
    console.error('Erro ao ler o arquivo:', err);
    return;
  }

  // Lê o arquivo como planilha
  const workbook = XLSX.read(data, { type: 'buffer' });

  // Seleciona a primeira planilha
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Converte a planilha em JSON
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  // Extrai os dados
  const valorImovel = jsonData.map(item => item["Valor da Casa (R$)"]);
  const valorPadrao = jsonData.map(item => item["Valor padrao x"]);

  console.log("Primeira linha da planilha:", jsonData[0]); // <-- movido para cá
  console.log('Preços:', valorImovel);
  console.log('Valores padrão:', valorPadrao);

  // Aqui você já pode rodar a regressão
  const resultado = regressaoLinear(valorPadrao, valorImovel);
  console.log("Equação da reta:", resultado.equacao);
  console.log("Coeficiente angular (a):", resultado.a);
  console.log("Coeficiente linear (b):", resultado.b);
  console.log("R²:", resultado.r2);
});

function regressaoLinear(x, y) {
  if (x.length !== y.length) {
    throw new Error("Os vetores devem ter o mesmo tamanho.");
  }

  const n = x.length;

  const media = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
  const mediaX = media(x);
  const mediaY = media(y);

  let numerador = 0;
  let denominador = 0;

  for (let i = 0; i < n; i++) {
    numerador += (x[i] - mediaX) * (y[i] - mediaY);
    denominador += (x[i] - mediaX) ** 2;
  }

  const a = numerador / denominador; // coeficiente angular
  const b = mediaY - a * mediaX;     // coeficiente linear

  // Calcular R²
  let somaTotal = 0;
  let somaResiduos = 0;

  for (let i = 0; i < n; i++) {
    const yEstimado = a * x[i] + b;
    somaTotal += (y[i] - mediaY) ** 2;
    somaResiduos += (y[i] - yEstimado) ** 2;
  }

  const r2 = 1 - (somaResiduos / somaTotal);

  return {
    equacao: `valor = ${a.toFixed(2)} * x + ${b.toFixed(2)}`,
    a,
    b,
    r2
  };
}
