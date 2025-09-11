function regressaoLinear(x, y) {
    if (x.length !== y.length) {
        throw new Error("Os vetores x e y devem ter o mesmo tamanho.");
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
 
    const a = numerador / denominador; // coeficiente angular (inclinação)
    const b = mediaY - a * mediaX;     // coeficiente linear (intercepto)
 
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
        equacao: `y = ${a.toFixed(4)}x + ${b.toFixed(4)}`,
        a: a,
        b: b,
        r2: r2
    };
}
 
// Exemplo de uso:
const x = [0.355, 0.294, 0.327, 0.323, 0.319, 0.328, 0.318, 0.279, 0.307, 0.287];
const y = [0.355, 0.324, 0.325, 0.324, 0.323, 0.324, 0.323, 0.317, 0.316, 0.313];
 
const resultado = regressaoLinear(x, y);
console.log("Equação da reta:", resultado.equacao);
console.log("Coeficiente angular (a):", resultado.a);
console.log("Coeficiente linear (b):", resultado.b);
console.log("R²:", resultado.r2);