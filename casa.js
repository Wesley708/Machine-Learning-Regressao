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
  const comodos = jsonData.map(item => item["Quantidade de Cômodos"]);

  console.log('Preços:', valorImovel);
  console.log('Cômodos:', comodos);

  // Aqui você já pode rodar a regressão
  const resultado = regressaoLinear(comodos, valorImovel);
  console.log("Equação da reta:", resultado.equacao);
  console.log("Coeficiente angular (a):", resultado.a);
  console.log("Coeficiente linear (b):", resultado.b);
  console.log("R²:", resultado.r2);
});

function regressaoLinear(comodos, valorImovel) {
    if (comodos.length !== valorImovel.length) {
        throw new Error("Os vetores comodos e valorImovel devem ter o mesmo tamanho.");
    }
 
    const n = comodos.length;
 
    const media = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
    const mediaComodos = media(comodos);
    const mediaValor = media(valorImovel);
 
    let numerador = 0;
    let denominador = 0;
 
    for (let i = 0; i < n; i++) {
        numerador += (comodos[i] - mediaComodos) * (valorImovel[i] - mediaValor);
        denominador += (comodos[i] - mediaComodos) ** 2;
    }
 
    const a = numerador / denominador; // coeficiente angular
    const b = mediaValor - a * mediaComodos; // coeficiente linear
 
    // Calcular R²
    let somaTotal = 0;
    let somaResiduos = 0;
 
    for (let i = 0; i < n; i++) {
        const valorEstimado = a * comodos[i] + b;
        somaTotal += (valorImovel[i] - mediaValor) ** 2;
        somaResiduos += (valorImovel[i] - valorEstimado) ** 2;
    }
 
    const r2 = 1 - (somaResiduos / somaTotal);
 
    return {
        equacao: `valor = ${a.toFixed(2)} * comodos + ${b.toFixed(2)}`,
        a: a,
        b: b,
        r2: r2
    };
}
