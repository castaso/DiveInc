'use strict';

const assert = require('assert');
const fs = require('fs');

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

// Read file sources for static analysis
const dbSource = fs.readFileSync('./config/database.js', 'utf8');
const jwtSource = fs.readFileSync('./config/jsonwebtoken.js', 'utf8');
const xenditSource = fs.readFileSync('./helpers/xendit.js', 'utf8');
const templateSource = fs.readFileSync('./helpers/template.js', 'utf8');
const middlewareSource = fs.readFileSync('./helpers/middleware.js', 'utf8');
const cronSource = fs.readFileSync('./helpers/cron.js', 'utf8');
const emailSource = fs.readFileSync('./service/email.js', 'utf8');

console.log('\nconfig/database.js — no hardcoded secrets');

test('does not contain hardcoded password "12345678"', () => {
  assert.ok(!dbSource.includes('"12345678"'), 'Hardcoded password "12345678" still present');
});

test('does not contain hardcoded username fallback "diveinc_user" in dev/prod', () => {
  // Only test env should have defaults
  const lines = dbSource.split('\n');
  let inTestEnv = false;
  let inDevOrProd = false;
  for (const line of lines) {
    if (line.includes('"test"')) { inTestEnv = true; inDevOrProd = false; }
    if (line.includes('"development"') || line.includes('"production"')) { inDevOrProd = true; inTestEnv = false; }
    if (inDevOrProd && line.includes('username') && line.includes('diveinc_user')) {
      assert.fail('Hardcoded "diveinc_user" username found in dev/prod env');
    }
  }
});

test('development environment does not have SSL enabled', () => {
  // Find the development block and check it doesn't have ssl:true
  const devStart = dbSource.indexOf('"development"');
  const prodStart = dbSource.indexOf('"production"');
  const devSection = dbSource.substring(devStart, prodStart);
  assert.ok(!devSection.includes('"ssl":true'), 'Development should not have SSL enabled');
  assert.ok(!devSection.includes('"dialectOptions"'), 'Development should not have dialectOptions');
});

test('production environment has SSL enabled', () => {
  const prodStart = dbSource.indexOf('"production"');
  const prodSection = dbSource.substring(prodStart);
  assert.ok(prodSection.includes('"ssl":true'), 'Production should have SSL enabled');
  assert.ok(prodSection.includes('"require":true'), 'Production SSL should require connections');
});

console.log('\nconfig/jsonwebtoken.js — no weak defaults in dev/prod');

test('development has no fallback token secret', () => {
  const devStart = jwtSource.indexOf('"development"');
  const testStart = jwtSource.indexOf('"test"');
  const devSection = jwtSource.substring(devStart, testStart);
  // Should use process.env.TOKEN_SECRET without || fallback
  const tokenSecretLine = devSection.split('\n').find(l => l.includes('tokenSecret'));
  assert.ok(tokenSecretLine.includes('process.env.TOKEN_SECRET,'), 'Development tokenSecret should not have fallback');
  assert.ok(!tokenSecretLine.includes('|| "token-secret"'), 'Should not have weak default "token-secret"');
});

test('production has no fallback token secret', () => {
  const prodStart = jwtSource.indexOf('"production"');
  const prodSection = jwtSource.substring(prodStart);
  const tokenSecretLine = prodSection.split('\n').find(l => l.includes('tokenSecret'));
  assert.ok(tokenSecretLine.includes('process.env.TOKEN_SECRET,'), 'Production tokenSecret should not have fallback');
  assert.ok(!tokenSecretLine.includes('|| "token-secret"'), 'Should not have weak default "token-secret"');
});

test('test env has prefixed defaults only', () => {
  assert.ok(jwtSource.includes('"test-token-secret"'), 'Test env should have prefixed test defaults');
  assert.ok(jwtSource.includes('"test-token-link-secret"'), 'Test env should have prefixed link defaults');
  assert.ok(jwtSource.includes('"test-refresh-token-secret"'), 'Test env should have prefixed refresh defaults');
});

console.log('\nhelpers/xendit.js — no hardcoded API keys');

test('reads secret key from env var', () => {
  assert.ok(xenditSource.includes('process.env.XENDIT_SECRET_KEY'), 'Should read from XENDIT_SECRET_KEY env var');
});

test('does not contain production Xendit key', () => {
  assert.ok(!xenditSource.includes('xnd_production'), 'Hardcoded production key removed');
  assert.ok(!xenditSource.includes('xnd_development'), 'Hardcoded development key removed');
});

console.log('\nhelpers/template.js — no hardcoded IPs');

test('email verification uses API_HOST env var, not hardcoded IP', () => {
  assert.ok(templateSource.includes('process.env.API_HOST'), 'Should use API_HOST env var');
  assert.ok(!templateSource.includes('165.232.173.141'), 'Hardcoded IP removed');
});

console.log('\nhelpers/middleware.js — no debug leaks');

test('checkOptionalToken does not log headers', () => {
  const optionalTokenSection = middlewareSource.substring(
    middlewareSource.indexOf('checkOptionalToken'),
    middlewareSource.indexOf('checkRefreshToken')
  );
  assert.ok(!optionalTokenSection.includes('console.log(req.headers)'), 'Should not log request headers');
});

test('checkRequestToken does not log tokens', () => {
  const requestTokenSection = middlewareSource.substring(
    middlewareSource.indexOf('checkRequestToken'),
    middlewareSource.length
  );
  assert.ok(!requestTokenSection.includes('console.log(token)'), 'Should not log tokens');
});

console.log('\nhelpers/cron.js — correct intervals');

test('cron uses daily schedule, not every-minute', () => {
  assert.ok(!cronSource.includes("'* * * * *'"), 'Should not run every minute');
  assert.ok(cronSource.includes("'0 0 * * *'"), 'Should run daily at midnight');
});

test('cron does not have debug console.log', () => {
  const lines = cronSource.split('\n');
  const nonCommentLines = lines.filter(l => !l.trim().startsWith('//'));
  const cronCode = nonCommentLines.join('\n');
  assert.ok(!cronCode.includes("console.log('running a task every minute')"), 'Debug log removed');
});

console.log('\nservice/email.js — no payload leaks');

test('sendMail callback does not log full email message', () => {
  const sendMailSection = emailSource.substring(emailSource.indexOf('sendMail'));
  assert.ok(!sendMailSection.includes('console.log(message)'), 'Should not log email payload');
});

console.log('\napi/controllers — sanitizeSqlInput imported in all datatable controllers');

test('all active datatable controllers import sanitizeSqlInput', () => {
  const activeControllers = [
    'activity', 'article', 'articleCategory', 'city', 'country',
    'creature', 'destination', 'facility', 'general', 'ideal',
    'language', 'roomAminity', 'roomOption', 'schedule', 'sport',
    'subDestination', 'testimoni', 'transactionContribution',
    'transactionCreator', 'transactionDivecenter', 'transactionLiveaboard',
    'transactionResort', 'transactionWallet', 'transactionWalletAdmin'
  ];
  let missing = [];
  for (const name of activeControllers) {
    const filePath = `./api/controllers/${name}/all/index.js`;
    try {
      const source = fs.readFileSync(filePath, 'utf8');
      if (!source.includes('sanitizeSqlInput')) {
        missing.push(name);
      }
    } catch (e) {
      missing.push(`${name} (file not found)`);
    }
  }
  assert.deepStrictEqual(missing, [], `Missing sanitizeSqlInput in: ${missing.join(', ')}`);
});

test('no active query.search.value without sanitizeSqlInput wrapper', () => {
  const activeControllers = [
    'activity', 'article', 'articleCategory', 'city', 'country',
    'creature', 'destination', 'facility', 'general', 'ideal',
    'language', 'roomAminity', 'roomOption', 'schedule', 'sport',
    'subDestination', 'testimoni', 'transactionContribution',
    'transactionCreator', 'transactionDivecenter', 'transactionLiveaboard',
    'transactionResort', 'transactionWallet', 'transactionWalletAdmin'
  ];
  let vulnerable = [];
  for (const name of activeControllers) {
    const filePath = `./api/controllers/${name}/all/index.js`;
    try {
      const lines = fs.readFileSync(filePath, 'utf8').split('\n');
      lines.forEach((line, i) => {
        // Skip commented lines
        if (line.trim().startsWith('//')) return;
        if (line.includes('query.search.value') && !line.includes('sanitizeSqlInput')) {
          vulnerable.push(`${name}:${i + 1}`);
        }
      });
    } catch (e) { /* skip */ }
  }
  assert.deepStrictEqual(vulnerable, [], `Unsanitized query.search.value at: ${vulnerable.join(', ')}`);
});

// Summary
console.log(`\n  ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
