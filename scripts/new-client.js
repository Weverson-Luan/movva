#!/usr/bin/env node
// Cria um novo cliente copiando um existente e adiciona os perfis no eas.json.
// Uso: node scripts/new-client.js <id> "<Nome do App>" <bundle.id> [base=movva]
const fs = require('node:fs');
const path = require('node:path');

const [id, name, bundleId, base = 'movva'] = process.argv.slice(2);
if (!id || !name || !bundleId) {
  console.error('Uso: node scripts/new-client.js <id> "<Nome do App>" <bundle.id> [base]');
  process.exit(1);
}
if (!/^[a-z0-9-]+$/.test(id)) {
  console.error('O id deve ter só letras minúsculas, números e hífen.');
  process.exit(1);
}

const root = path.join(__dirname, '..');
const src = path.join(root, 'clients', base);
const dest = path.join(root, 'clients', id);
if (fs.existsSync(dest)) {
  console.error(`O cliente "${id}" já existe.`);
  process.exit(1);
}

// 1. Copia a pasta do cliente base (ícones, splash, config)
fs.cpSync(src, dest, { recursive: true, filter: (f) => !f.endsWith('google-service-account.json') });

// 2. Ajusta o config.json
const cfgPath = path.join(dest, 'config.json');
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
Object.assign(cfg, {
  name,
  slug: id,
  scheme: id.replace(/-/g, ''),
  bundleId,
  version: '1.0.0',
  buildNumber: 1,
  easProjectId: '',
  apiUrl: cfg.apiUrl.replace(/[^/]+$/, id),
});
fs.writeFileSync(cfgPath, `${JSON.stringify(cfg, null, 2)}\n`);

// 3. Adiciona os perfis de build e submit no eas.json
const easPath = path.join(root, 'eas.json');
const eas = JSON.parse(fs.readFileSync(easPath, 'utf8'));
eas.build[`${id}-preview`] = { extends: 'base', distribution: 'internal', channel: 'preview', env: { CLIENT: id } };
eas.build[id] = { extends: 'base', channel: 'production', env: { CLIENT: id } };
eas.submit[id] = {
  ios: { ascAppId: 'PREENCHER', appleTeamId: 'PREENCHER' },
  android: { serviceAccountKeyPath: `./clients/${id}/google-service-account.json`, track: 'internal' },
};
fs.writeFileSync(easPath, `${JSON.stringify(eas, null, 2)}\n`);

console.log(`Cliente "${id}" criado em clients/${id}.
Próximos passos:
  1. Troque icon.png, adaptive-icon.png e splash.png e as cores do tema em clients/${id}/config.json
  2. CLIENT=${id} npx eas init   (cria o projeto EAS e mostra o projectId; cole em easProjectId)
  3. CLIENT=${id} npx expo start
  4. npx eas build --profile ${id} --platform all`);
