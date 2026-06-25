// modules/calculator.js
// Modulo propio de calculo con validaciones para evitar resultados incorrectos.
function validateNumber(value, fieldName) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error(`${fieldName} debe ser un numero valido.`);
  }

  return number;
}

export function add(a, b) {
  return validateNumber(a, "a") + validateNumber(b, "b");
}

export function subtract(a, b) {
  return validateNumber(a, "a") - validateNumber(b, "b");
}

export function multiply(a, b) {
  return validateNumber(a, "a") * validateNumber(b, "b");
}

export function divide(a, b) {
  const dividend = validateNumber(a, "a");
  const divisor = validateNumber(b, "b");

  if (divisor === 0) {
    throw new Error("No se puede dividir por cero.");
  }

  return dividend / divisor;
}

// Funcion general para usar el modulo desde una ruta web o desde consola.
export function calculate(operation, a, b) {
  const operations = {
    suma: add,
    resta: subtract,
    multiplicacion: multiply,
    division: divide
  };

  const selectedOperation = operations[operation];

  if (!selectedOperation) {
    throw new Error("Operacion no valida.");
  }

  return selectedOperation(a, b);
}
