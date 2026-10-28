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

test('operations reject non-finite or non-number operands', () => {
  for (const operation of Object.values(calculator)) {
    assert.throws(() => operation('2', 3), TypeError);
    assert.throws(() => operation(2, Number.NaN), TypeError);
    assert.throws(() => operation(Number.POSITIVE_INFINITY, 3), TypeError);
  }
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
  const unknownOperation = spawnSync(process.execPath, [calculatorPath, 'power', '2', '3'], {
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

test('CLI reports division by zero', () => {
  const result = spawnSync(process.execPath, [calculatorPath, 'divide', '20', '0'], {
    encoding: 'utf8'
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Cannot divide by zero/);
});
