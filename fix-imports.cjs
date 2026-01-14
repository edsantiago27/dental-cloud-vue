// fix-imports.js
const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /from ['"]\.\.\/stores\//g, to: "from '@clinica/stores/" },
  { from: /from ['"]\.\.\/shared\/composables\//g, to: "from '@shared/composables/" },
  { from: /from ['"]\.\.\/shared\/components\//g, to: "from '@shared/components/" },
  { from: /from ['"]\.\.\/components\//g, to: "from '@clinica/components/" },
  { from: /from ['"]\.\.\/services\//g, to: "from '@clinica/services/" },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  replacements.forEach(({ from, to }) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.vue') || file.endsWith('.js')) {
      processFile(filePath);
    }
  });
}

// Procesar módulo de clínica
console.log('🔧 Corrigiendo imports en módulo de clínica...');
processDirectory('./src/modules/clinica');

console.log('✅ ¡Listo! Imports corregidos.');
