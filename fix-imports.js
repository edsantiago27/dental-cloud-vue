// fix-all-imports.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Patrones de reemplazo GLOBALES
const globalReplacements = [
  // Corregir @/utils a @shared/utils
  { from: /from ['"]@\/utils\//g, to: "from '@shared/utils/" },
  
  // Corregir @/composables a @shared/composables
  { from: /from ['"]@\/composables\//g, to: "from '@shared/composables/" },
  
  // Corregir @/components a @shared/components (solo en shared)
  { from: /from ['"]@\/components\//g, to: "from '@shared/components/" },
  
  // Corregir @/services a @shared/services
  { from: /from ['"]@\/services\//g, to: "from '@shared/services/" },
  
  // Corregir @modules/clinica a @clinica
  { from: /from ['"]@modules\/clinica\//g, to: "from '@clinica/" },
  
  // Corregir @modules/paciente a @paciente
  { from: /from ['"]@modules\/paciente\//g, to: "from '@paciente/" },
  
  // Corregir @modules/superadmin a @superadmin
  { from: /from ['"]@modules\/superadmin\//g, to: "from '@superadmin/" },
];

// Reemplazos específicos por módulo
const moduleReplacements = {
  'src/modules/clinica': [
    { from: /from ['"]\.\.\/stores\//g, to: "from '@clinica/stores/" },
    { from: /from ['"]\.\.\/components\//g, to: "from '@clinica/components/" },
    { from: /from ['"]\.\.\/services\//g, to: "from '@clinica/services/" },
    { from: /from ['"]\.\.\/composables\//g, to: "from '@clinica/composables/" },
    { from: /from ['"]\.\.\/layouts\//g, to: "from '@clinica/layouts/" },
    { from: /from ['"]\.\.\/views\//g, to: "from '@clinica/views/" },
    { from: /from ['"]\.\.\/shared\//g, to: "from '@shared/" },
  ],
  'src/modules/paciente': [
    { from: /from ['"]\.\.\/stores\//g, to: "from '@paciente/stores/" },
    { from: /from ['"]\.\.\/components\//g, to: "from '@paciente/components/" },
    { from: /from ['"]\.\.\/services\//g, to: "from '@paciente/services/" },
    { from: /from ['"]\.\.\/composables\//g, to: "from '@paciente/composables/" },
    { from: /from ['"]\.\.\/layouts\//g, to: "from '@paciente/layouts/" },
    { from: /from ['"]\.\.\/views\//g, to: "from '@paciente/views/" },
    { from: /from ['"]\.\.\/shared\//g, to: "from '@shared/" },
  ],
  'src/modules/superadmin': [
    { from: /from ['"]\.\.\/stores\//g, to: "from '@superadmin/stores/" },
    { from: /from ['"]\.\.\/components\//g, to: "from '@superadmin/components/" },
    { from: /from ['"]\.\.\/services\//g, to: "from '@superadmin/services/" },
    { from: /from ['"]\.\.\/composables\//g, to: "from '@superadmin/composables/" },
    { from: /from ['"]\.\.\/layouts\//g, to: "from '@superadmin/layouts/" },
    { from: /from ['"]\.\.\/views\//g, to: "from '@superadmin/views/" },
    { from: /from ['"]\.\.\/shared\//g, to: "from '@shared/" },
  ],
  'src/shared': [
    { from: /from ['"]\.\.\/stores\//g, to: "from '@shared/stores/" },
    { from: /from ['"]\.\.\/components\//g, to: "from '@shared/components/" },
    { from: /from ['"]\.\.\/utils\//g, to: "from '@shared/utils/" },
    { from: /from ['"]\.\.\/composables\//g, to: "from '@shared/composables/" },
  ],
  'src/router': [
    { from: /from ['"]\.\.\/modules\/clinica\/stores\//g, to: "from '@clinica/stores/" },
    { from: /from ['"]\.\.\/modules\/paciente\/stores\//g, to: "from '@paciente/stores/" },
    { from: /from ['"]\.\.\/modules\/superadmin\/stores\//g, to: "from '@superadmin/stores/" },
    { from: /from ['"]\.\.\/shared\/stores\//g, to: "from '@shared/stores/" },
  ],
  'src/views': [
    { from: /from ['"]\.\.\/stores\//g, to: "from '@shared/stores/" },
    { from: /from ['"]\.\.\/shared\//g, to: "from '@shared/" },
  ]
};

function processFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const originalContent = content;

  replacements.forEach(({ from, to }) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ ${path.relative(process.cwd(), filePath)}`);
    
    // Mostrar cambios
    const lines = originalContent.split('\n');
    lines.forEach((line, index) => {
      replacements.forEach(({ from }) => {
        if (from.test(line)) {
          console.log(`     Línea ${index + 1}: ${line.trim()}`);
        }
      });
    });
  }

  return modified;
}

function processDirectory(dir, replacements) {
  let filesModified = 0;
  
  if (!fs.existsSync(dir)) {
    return 0;
  }

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      filesModified += processDirectory(filePath, replacements);
    } else if (file.endsWith('.vue') || file.endsWith('.js')) {
      if (processFile(filePath, replacements)) {
        filesModified++;
      }
    }
  });

  return filesModified;
}

console.log('🔧 Corrigiendo todos los imports...\n');

let totalFixed = 0;

// 1. Aplicar reemplazos globales a TODOS los archivos en src/
console.log('📦 Aplicando correcciones globales...');
totalFixed += processDirectory(path.join(__dirname, 'src'), globalReplacements);

// 2. Aplicar reemplazos específicos por módulo
Object.entries(moduleReplacements).forEach(([modulePath, replacements]) => {
  const fullPath = path.join(__dirname, modulePath);
  
  if (fs.existsSync(fullPath)) {
    console.log(`\n📦 Procesando: ${modulePath}`);
    const fixed = processDirectory(fullPath, replacements);
    totalFixed += fixed;
    console.log(`   ${fixed} archivo(s) modificado(s)`);
  }
});

console.log(`\n✅ ¡Completado! Total de archivos corregidos: ${totalFixed}`);
