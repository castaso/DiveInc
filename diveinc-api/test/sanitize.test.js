'use strict';

const assert = require('assert');
const { sanitizeSqlInput } = require('../helpers/sanitize');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.log(`  ✗ ${name}`);
    console.log(`    ${err.message}`);
  }
}

console.log('\nsanitizeSqlInput');

// Basic behavior
test('returns empty string for null', () => {
  assert.strictEqual(sanitizeSqlInput(null), '');
});

test('returns empty string for undefined', () => {
  assert.strictEqual(sanitizeSqlInput(undefined), '');
});

test('returns empty string for non-string input', () => {
  assert.strictEqual(sanitizeSqlInput(12345), '');
});

test('returns the string as-is when safe', () => {
  assert.strictEqual(sanitizeSqlInput('hello world'), 'hello world');
});

test('trims whitespace', () => {
  assert.strictEqual(sanitizeSqlInput('  hello  '), 'hello');
});

// SQL injection prevention
test('escapes single quotes to doubled quotes', () => {
  const result = sanitizeSqlInput("test' OR '1'='1");
  // Single quotes should be doubled (SQL-safe), not removed
  assert.ok(result.includes("''"), `Expected escaped quotes, got: ${result}`);
  // The original single-quote-or pattern should be broken
  assert.ok(!result.match(/(?<!')' OR/), `SQL injection pattern not escaped: ${result}`);
});

test('removes semicolons preventing statement chaining', () => {
  const result = sanitizeSqlInput("test'; DROP TABLE users--");
  assert.ok(!result.includes(';'), `Semicolons not removed: ${result}`);
});

test('removes SQL line comments (--)', () => {
  const result = sanitizeSqlInput('test -- comment');
  assert.ok(!result.includes('--'), `Line comments not removed: ${result}`);
});

test('removes block comments (/* and */)', () => {
  const result = sanitizeSqlInput('test /* comment */');
  assert.ok(!result.includes('/*'), `Block comment start not removed: ${result}`);
  assert.ok(!result.includes('*/'), `Block comment end not removed: ${result}`);
});

test('truncates input to 200 characters', () => {
  const longInput = 'a'.repeat(500);
  const result = sanitizeSqlInput(longInput);
  assert.ok(result.length <= 200, `Expected <= 200 chars, got ${result.length}`);
});

test('neutralizes UNION SELECT injection', () => {
  const input = "' UNION SELECT * FROM users --";
  const result = sanitizeSqlInput(input);
  // Comments stripped and quotes escaped = injection broken
  assert.ok(!result.includes('--'), `Comments not removed: ${result}`);
  assert.ok(result.includes('UNION'), `UNION should still be in result (it\'s the escaped string): ${result}`);
});

test('neutralizes OR 1=1 injection', () => {
  const input = "' OR 1=1 --";
  const result = sanitizeSqlInput(input);
  // Comments stripped = injection broken
  assert.ok(!result.includes('--'), `Comments not removed: ${result}`);
});

test('handles empty string', () => {
  assert.strictEqual(sanitizeSqlInput(''), '');
});

// Summary
console.log(`\n  ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
