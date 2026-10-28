'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const test = require('node:test');

const calculator = require('../calculator');
const calculatorPath = path.join(__dirname, '..', 'calculator.js');

test('add adds numbers', () => {
  assert.equal(calculator.add(2, 3), 5);
  assert.equal(calculator.add(-2, 3), 1);
  assert.equal(calculator.add(0, 0), 0);
  assert.equal(calculator.add(0.1, 0.2), 0.30000000000000004);
});

test('subtract subtracts numbers', () => {
  assert.equal(calculator.subtract(10, 4), 6);
  assert.equal(calculator.subtract(4, 10), -6);
  assert.equal(calculator.subtract(5, 5), 0);
});

test('multiply multiplies numbers', () => {
  assert.equal(calculator.multiply(45, 2), 90);
  assert.equal(calculator.multiply(-3, 4), -12);
  assert.equal(calculator.multiply(0, 9), 0);
});

test('divide divides numbers', () => {
  assert.equal(calculator.divide(20, 5), 4);
  assert.equal(calculator.divide(5, 2), 2.5);
  assert.equal(calculator.divide(-12, 3), -4);
});

test('divide rejects a zero divisor', () => {
  assert.throws(() => calculator.divide(1, 0), {
    name: 'RangeError',
    message: 'Cannot divide by zero'
  });
  assert.throws(() => calculator.divide(1, -0), RangeError);
});

test('modulo returns the remainder', () => {
  assert.equal(calculator.modulo(10, 3), 1);
  assert.equal(calculator.modulo(-10, 3), -1);
  assert.equal(calculator.modulo(9, 3), 0);
});

test('modulo rejects a zero divisor', () => {
  assert.throws(() => calculator.modulo(10, 0), {
    name: 'RangeError',
    message: 'Cannot calculate modulo with a zero divisor'
  });
});

test('power raises a base to an exponent', () => {
  assert.equal(calculator.power(2, 3), 8);
  assert.equal(calculator.power(5, 0), 1);
  assert.equal(calculator.power(2, -2), 0.25);
});

test('squareRoot returns the non-negative square root', () => {
  assert.equal(calculator.squareRoot(25), 5);
  assert.equal(calculator.squareRoot(0), 0);
  assert.ok(Math.abs(calculator.squareRoot(2) ** 2 - 2) <= Number.EPSILON * 2);
});

test('squareRoot rejects negative numbers', () => {
  assert.throws(() => calculator.squareRoot(-1), {
    name: 'RangeError',
    message: 'Cannot calculate the square root of a negative number'
  });
});

test('operations reject non-finite or non-number operands', () => {
  for (const operation of Object.values(calculator).filter((value) => value.length === 2)) {
    assert.throws(() => operation('2', 3), TypeError);
    assert.throws(() => operation(2, Number.NaN), TypeError);
    assert.throws(() => operation(Number.POSITIVE_INFINITY, 3), TypeError);
  }

  assert.throws(() => calculator.squareRoot('2'), TypeError);
  assert.throws(() => calculator.squareRoot(Number.NaN), TypeError);
  assert.throws(() => calculator.squareRoot(Number.POSITIVE_INFINITY), TypeError);
});

test('CLI prints a result for a supported operation', () => {
  const result = spawnSync(process.execPath, [calculatorPath, 'add', '2', '3'], {
    encoding: 'utf8'
  });

  assert.equal(result.status, 0);
  assert.equal(result.stdout, '5\n');
  assert.equal(result.stderr, '');
});

test('CLI rejects unknown operations and invalid operands', () => {
  const unknownOperation = spawnSync(process.execPath, [calculatorPath, 'unknown', '2', '3'], {
    encoding: 'utf8'
  });
  assert.equal(unknownOperation.status, 1);
  assert.match(unknownOperation.stderr, /Usage:/);

  const invalidOperand = spawnSync(process.execPath, [calculatorPath, 'add', 'two', '3'], {
    encoding: 'utf8'
  });
  assert.equal(invalidOperand.status, 1);
  assert.match(invalidOperand.stderr, /finite numbers/);
});

test('CLI accepts binary and unary operations', () => {
  const moduloResult = spawnSync(process.execPath, [calculatorPath, 'modulo', '20', '5'], {
    encoding: 'utf8'
  });
  assert.equal(moduloResult.status, 0);
  assert.equal(moduloResult.stdout, '0\n');

  const squareRootResult = spawnSync(process.execPath, [calculatorPath, 'squareRoot', '25'], {
    encoding: 'utf8'
  });
  assert.equal(squareRootResult.status, 0);
  assert.equal(squareRootResult.stdout, '5\n');

  const invalidArity = spawnSync(process.execPath, [calculatorPath, 'squareRoot', '25', '36'], {
    encoding: 'utf8'
  });
  assert.equal(invalidArity.status, 1);
  assert.match(invalidArity.stderr, /Usage:/);
});

test('CLI reports division by zero', () => {
  const result = spawnSync(process.execPath, [calculatorPath, 'divide', '20', '0'], {
    encoding: 'utf8'
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Cannot divide by zero/);
});
