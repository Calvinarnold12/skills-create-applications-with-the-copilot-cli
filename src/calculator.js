'use strict';

// Supported operations: addition, subtraction, multiplication, and division.
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

const operations = { add, subtract, multiply, divide };

function runCli(args) {
  const [operation, first, second, ...extra] = args;
  const calculate = operations[operation];

  if (!calculate || first === undefined || second === undefined || extra.length > 0) {
    throw new Error(
      'Usage: node src/calculator.js <add|subtract|multiply|divide> <number> <number>'
    );
  }

  const a = Number(first);
  const b = Number(second);
  if (first.trim() === '' || second.trim() === '' || !Number.isFinite(a) || !Number.isFinite(b)) {
    throw new TypeError('Operands must be finite numbers');
  }

  return calculate(a, b);
}

if (require.main === module) {
  try {
    console.log(runCli(process.argv.slice(2)));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { add, subtract, multiply, divide };
