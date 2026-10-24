import test from 'node:test';
import assert from 'node:assert/strict';
import { getCleanDocDisplayName } from './document-utils';
import { defaultLanguages } from './supabase';
import { initialProjectsData } from './firebase';

test('getCleanDocDisplayName never exposes raw Base64 data URIs as display text', () => {
  const base64Uri = 'data:application/pdf;base64,JVBERi0xLjQKJSDi48fMCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2c...';
  const cleanName = getCleanDocDisplayName(base64Uri, 'P.Lokesh_resume.pdf');
  assert.equal(cleanName, 'P.Lokesh_resume.pdf');
  assert.ok(!cleanName.startsWith('data:'));
  assert.ok(!cleanName.includes('base64'));
});

test('getCleanDocDisplayName extracts clean filenames from standard storage URLs', () => {
  assert.equal(
    getCleanDocDisplayName('https://storage.supabase.co/v1/resumes/Poosala_Lokesh_Resume_2026.pdf'),
    'Poosala_Lokesh_Resume_2026.pdf'
  );
  assert.equal(getCleanDocDisplayName('/resume.pdf'), 'resume.pdf');
  assert.equal(getCleanDocDisplayName(null, 'P.Lokesh_resume.pdf'), 'P.Lokesh_resume.pdf');
});

test('defaultLanguages includes language names and valid proficiency values', () => {
  assert.ok(defaultLanguages.length >= 4);
  const names = defaultLanguages.map((l) => l.name || l.language);
  assert.ok(names.includes('Telugu'));
  assert.ok(names.includes('English'));
  assert.ok(names.includes('Hindi'));
  assert.ok(names.includes('French'));

  defaultLanguages.forEach((l) => {
    assert.ok(l.name && l.name.length > 0, `Language item ${l.id} must have a name`);
    assert.ok(l.proficiency && l.proficiency.length > 0, `Language item ${l.id} must have proficiency`);
    assert.equal(typeof (l.displayOrder ?? l.display_order), 'number');
  });
});

test('initialProjectsData includes Old-Letters with valid metadata and links', () => {
  const oldLetters = initialProjectsData.find((p) => p.id === 'old-letters');
  assert.ok(oldLetters, 'Old-Letters project must be in initialProjectsData');
  assert.equal(oldLetters.name, 'Old-Letters');
  assert.equal(oldLetters.title, 'Old-Letters');
  assert.equal(oldLetters.liveUrl, 'https://oldletters.vercel.app/');
  assert.equal(oldLetters.githubUrl, 'https://github.com/Lokesh-81/Old-Letters.git');
  assert.equal(oldLetters.tagline, 'Some things are worth waiting for.');
  assert.ok(oldLetters.description.includes('digital letter-writing'));
  assert.ok(oldLetters.technologies.includes('Vite'));
  assert.ok(oldLetters.technologies.includes('React'));
  assert.ok(oldLetters.technologies.includes('TypeScript'));
  assert.ok(oldLetters.technologies.includes('Tailwind CSS'));
  assert.ok(oldLetters.technologies.includes('Motion'));
});

test('Every project in initialProjectsData has a title and a name', () => {
  initialProjectsData.forEach((p) => {
    const title = p.title || p.name;
    assert.ok(title && title.length > 0, `Project ${p.id} must have a title or name`);
    assert.ok(Array.isArray(p.technologies), `Project ${p.id} must have an array of technologies`);
    assert.ok(p.description && p.description.length > 0, `Project ${p.id} must have a description`);
  });
});
