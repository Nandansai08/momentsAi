#!/usr/bin/env node
/**
 * Syncs the canonical label set in .github/labels.json into a GitHub repo.
 * - Creates labels that don't exist yet
 * - Updates color/description of labels that already exist
 * Safe to re-run.
 *
 * Usage:
 *   GITHUB_TOKEN=xxx REPO_OWNER=Nandansai08 REPO_NAME=gitgraph.studio node scripts/sync-labels.mjs
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const DELAY_MS = 250;

if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
  console.error('Missing required env vars. Need GITHUB_TOKEN, REPO_OWNER, REPO_NAME.');
  process.exit(1);
}

const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;
const HEADERS = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const here = dirname(fileURLToPath(import.meta.url));
const labelsPath = resolve(here, '..', '.github', 'labels.json');
const labels = JSON.parse(await readFile(labelsPath, 'utf8'));

async function upsertLabel(label) {
  const createRes = await fetch(`${API_BASE}/labels`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(label),
  });

  if (createRes.ok) {
    console.log(`CREATED: ${label.name} (#${label.color})`);
    return;
  }

  if (createRes.status === 422) {
    const updateRes = await fetch(
      `${API_BASE}/labels/${encodeURIComponent(label.name)}`,
      {
        method: 'PATCH',
        headers: HEADERS,
        body: JSON.stringify({
          new_name: label.name,
          color: label.color,
          description: label.description,
        }),
      }
    );

    if (updateRes.ok) {
      console.log(`UPDATED: ${label.name} (#${label.color})`);
      return;
    }

    console.error(`FAILED to update ${label.name}: ${updateRes.status} ${await updateRes.text()}`);
    return;
  }

  console.error(`FAILED to create ${label.name}: ${createRes.status} ${await createRes.text()}`);
}

console.log(`Syncing ${labels.length} labels into ${REPO_OWNER}/${REPO_NAME}...`);
for (const label of labels) {
  await upsertLabel(label);
  await sleep(DELAY_MS);
}
console.log('Done.');
