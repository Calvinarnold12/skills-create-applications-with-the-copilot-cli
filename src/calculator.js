'use strict';

// Supported operations: addition, subtraction, multiplication, division, modulo,
// exponentiation, and square root.
function assertFiniteNumber(value, name) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number`);
  }
}

function add(a, b) {
  assertFiniteNumber(a, 'First operand');
  assertFiniteNumber(b, 'Second operand');
  return a + b;
}

function subtract(a, b) {
  assertFiniteNumber(a, 'First operand');
  assertFiniteNumber(b, 'Second operand');
  return a - b;
}

function multiply(a, b) {
  assertFiniteNumber(a, 'First operand');
  assertFiniteNumber(b, 'Second operand');
  return a * b;
}

function divide(a, b) {
  assertFiniteNumber(a, 'First operand');
  assertFiniteNumber(b, 'Second operand');
  if (b === 0) {
    throw new RangeError('Cannot divide by zero');
  }
  return a / b;
}

function modulo(a, b) {
  assertFiniteNumber(a, 'First operand');
  assertFiniteNumber(b, 'Second operand');
  if (b === 0) {
    throw new RangeError('Cannot calculate modulo with a zero divisor');
  }
  return a % b;
}

function power(base, exponent) {
  assertFiniteNumber(base, 'Base');
  assertFiniteNumber(exponent, 'Exponent');
  return base ** exponent;
}

function squareRoot(n) {
  assertFiniteNumber(n, 'Operand');
  if (n < 0) {
    throw new RangeError('Cannot calculate the square root of a negative number');
  }
  return Math.sqrt(n);
}

const binaryOperations = { add, subtract, multiply, divide, modulo, power };
const unaryOperations = { squareRoot };

function runCli(args) {
  const [operation, ...rawOperands] = args;
  const calculate = binaryOperations[operation] || unaryOperations[operation];
  const expectedOperands = unaryOperations[operation] ? 1 : 2;

  if (!calculate || rawOperands.length !== expectedOperands) {
    throw new Error(
      'Usage: node src/calculator.js <add|subtract|multiply|divide|modulo|power> <number> <number> ' +
      'or <squareRoot> <number>'
    );
  }

  const operands = rawOperands.map(Number);
  if (rawOperands.some((value) => value.trim() === '') || operands.some((value) => !Number.isFinite(value))) {
    throw new TypeError('Operands must be finite numbers');
  }

  return calculate(...operands);
}

if (require.main === module) {
  try {
    console.log(runCli(process.argv.slice(2)));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { add, subtract, multiply, divide, modulo, power, squareRoot };
