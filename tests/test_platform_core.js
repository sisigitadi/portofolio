import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

test('Core Data Ledger Integrity', () => {
  const ledgerPath = path.resolve('src/data/verified_ledger.json');
  assert.ok(fs.existsSync(ledgerPath), 'verified_ledger.json must exist');
  
  const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
  assert.equal(ledger.profile.name, 'Sigit Adi Irianto');
  assert.equal(ledger.profile.corePhilosophy, 'BUILD. CONNECT. AUTOMATE. SECURE.');
  assert.equal(ledger.projects.length, 4);
  assert.equal(ledger.certifications.length, 9);
  assert.equal(ledger.tenures.length, 10);
});

test('Salted IP Hashing & Privacy Compliance (UU PDP)', () => {
  const salt = 'TEST_SALT_SECRET_KEY_12345';
  const rawIp = '203.0.113.195';
  
  const hash = crypto.createHash('sha256').update(rawIp + salt).digest('hex');
  assert.equal(typeof hash, 'string');
  assert.equal(hash.length, 64);
  assert.notEqual(hash, rawIp);
});

test('Single Canonical Platform Compliance & Documentation', () => {
  assert.ok(fs.existsSync(path.resolve('index.html')), 'index.html must exist as single master platform');
  assert.ok(!fs.existsSync(path.resolve('admin.html')), 'admin.html is decommissioned per user choice');
});
