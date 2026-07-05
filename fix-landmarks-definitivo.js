// fix-landmarks-definitivo.js
// =============================
// UN SOLO SCRIPT que arregla TODO:
//   1. Actualiza san-bernardino.json con los 8 landmarks correctos
//   2. Quita la clave duplicada 'aeropuerto' en PropertyPage.tsx
//   3. Asegura que el CSS muestre el texto de landmarks visible
//
// Ejecutar desde: C:\...\larum-studio
//   node fix-landmarks-definitivo.js

const fs = require('fs');
const path = require('path');

let fixes = 0;
let errors = 0;

// ============================================================
// 1. ACTUALIZAR san-bernardino.json CON 8 LANDMARKS
// ============================================================
console.log('\n=== PASO 1: Actualizar san-bernardino.json ===');

const jsonCandidates = [
  'data/properties/san-bernardino.json',
  'app/data/san-bernardino.json',
  'public/data/san-bernardino.json',
  'data/san-bernardino.json',
];

let jsonPath = jsonCandidates.find(f => fs.existsSync(path.resolve(f)));

if (!jsonPath) {
  // búsqueda recursiva
  function findFile(dir, name, depth = 0) {
    if (depth > 4) return null;
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        if (e.name === 'node_modules' || e.name === '.next' || e.name === '.git') continue;
        const full = path.join(dir, e.name);
        if (e.isFile() && e.name === name) return full;
        if (e.isDirectory()) {
          const found = findFile(full, name, depth + 1);
          if (found) return found;
        }
      }
    } catch (e) {}
    return null;
  }
  jsonPath = findFile('.', 'san-bernardino.json');
}

if (!jsonPath) {
  console.error('❌ No encontré san-bernardino.json en ninguna ruta.');
  console.error('   Asegúrate de ejecutar desde C:\\...\\larum-studio');
  errors++;
} else {
  jsonPath = path.resolve(jsonPath);
  console.log('📄 Encontrado:', jsonPath);

  const raw = fs.readFileSync(jsonPath, 'utf8');
  const backupPath = jsonPath + '.BACKUP-' + Date.now() + '.json';
  fs.writeFileSync(backupPath, raw);
  console.log('💾 Backup:', backupPath);

  const json = JSON.parse(raw);

  const landmarks8 = [
    { nombre: "Aeropuerto (ASU)", icono: "aeropuerto", detalle: "35 km", minutos: 40, label: "Aeropuerto (ASU)", top: "20%", left: "75%", isMain: false },
    { nombre: "Asunción Golf Club", icono: "golf", detalle: "55 km", minutos: 55, label: "Asunción Golf Club", top: "30%", left: "60%", isMain: false },
    { nombre: "Club Centenario", icono: "club", detalle: "48 km", minutos: 50, label: "Club Centenario", top: "35%", left: "65%", isMain: false },
    { nombre: "Club Náutico San Bernardino", icono: "nautico", detalle: "1.5 km", minutos: 3, label: "Club Náutico San Bernardino", top: "50%", left: "45%", isMain: true },
    { nombre: "Shopping del Sol", icono: "shopping", detalle: "45 km", minutos: 50, label: "Shopping del Sol", top: "40%", left: "70%", isMain: false },
    { nombre: "Centro Financiero de Asunción", icono: "financiero", detalle: "48 km", minutos: 55, label: "Centro Financiero de Asunción", top: "45%", left: "72%", isMain: false },
    { nombre: "Basílica de Caacupé", icono: "basilica", detalle: "23 km", minutos: 25, label: "Basílica de Caacupé", top: "65%", left: "30%", isMain: false },
    { nombre: "Centro Médico Bautista", icono: "medico", detalle: "48 km", minutos: 55, label: "Centro Médico Bautista", top: "50%", left: "68%", isMain: false },
  ];

  // Inyectar en TODAS las rutas posibles dentro del JSON
  json.ubicacion_landmarks = landmarks8;
  json.landmarks = landmarks8;
  if (json.property) {
    if (!json.property.location) json.property.location = {};
    json.property.location.landmarks = landmarks8;
  }
  if (json.location) {
    json.location.landmarks = landmarks8;
  }

  fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2), 'utf8');
  console.log('✅ 8 landmarks inyectados en san-bernardino.json');
  fixes++;
}

// ============================================================
// 2. QUITAR CLAVE DUPLICADA 'aeropuerto' EN PropertyPage.tsx
// ============================================================
console.log('\n=== PASO 2: Arreglar clave duplicada en PropertyPage.tsx ===');

const tsxCandidates = [
  'app/components/PropertyPage.tsx',
  'components/PropertyPage.tsx',
  'app/PropertyPage.tsx',
];

let tsxPath = tsxCandidates.find(f => fs.existsSync(path.resolve(f)));

if (!tsxPath) {
  // búsqueda recursiva
  function findTsx(dir, depth = 0) {
    if (depth > 4) return null;
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        if (e.name === 'node_modules' || e.name === '.next' || e.name === '.git') continue;
        const full = path.join(dir, e.name);
        if (e.isFile() && e.name === 'PropertyPage.tsx') return full;
        if (e.isDirectory()) {
          const found = findTsx(full, depth + 1);
          if (found) return found;
        }
      }
    } catch (e) {}
    return null;
  }
  tsxPath = findTsx('.');
}

if (!tsxPath) {
  console.error('❌ No encontré PropertyPage.tsx');
  errors++;
} else {
  tsxPath = path.resolve(tsxPath);
  console.log('📄 Encontrado:', tsxPath);

  let tsx = fs.readFileSync(tsxPath, 'utf8');
  const tsxBackup = tsxPath + '.BACKUP-' + Date.now();
  fs.writeFileSync(tsxBackup, tsx);
  console.log('💾 Backup:', tsxBackup);

  // Contar ocurrencias de 'aeropuerto' como clave de objeto
  const matches = tsx.match(/'aeropuerto'\s*:/g) || [];
  if (matches.length > 1) {
    // Quitar la SEGUNDA ocurrencia (la duplicada)
    let count = 0;
    tsx = tsx.replace(/'aeropuerto'\s*:\s*'[^']*'\s*,?\s*\n?/g, (match) => {
      count++;
      if (count > 1) {
        console.log('🗑️  Eliminada línea duplicada:', match.trim());
        return '';
      }
      return match;
    });
    fs.writeFileSync(tsxPath, tsx, 'utf8');
    console.log('✅ Clave duplicada aeropuerto eliminada');
    fixes++;
  } else if (matches.length === 1) {
    console.log('✅ Solo hay 1 clave aeropuerto — no hay duplicado (ya está bien)');
  } else {
    console.log('⚠️  No encontré ninguna clave aeropuerto en el archivo');
  }

  // ============================================================
  // 2b. VERIFICAR QUE EL TEXTO DE LANDMARKS SE RENDERIZA
  // ============================================================
  console.log('\n=== PASO 2b: Verificar renderizado de texto en landmarks ===');

  // Buscar si el componente usa lm.nombre con fallback
  const hasNombreFallback = /lm\.nombre\s*\|\|\s*lm\.label/.test(tsx) ||
                            /getLMName|getLandmarkName/.test(tsx) ||
                            /nombre.*\|\|.*label/.test(tsx);

  if (hasNombreFallback) {
    console.log('✅ Tiene fallback nombre || label — bien');
  } else {
    // Verificar si usa solo lm.nombre (sin fallback)
    const usesNombre = /lm\.nombre[^|]/.test(tsx);
    const usesLabel = /lm\.label/.test(tsx);

    if (usesNombre && !usesLabel) {
      console.log('⚠️  Usa lm.nombre SIN fallback a lm.label');
      console.log('   Con los 8 landmarks nuevos esto funciona (tienen campo nombre)');
      console.log('   Pero si ves texto vacío, el componente necesita: lm.nombre || lm.label');
    }
  }

  // Verificar si usa detalle/minutos
  const hasDetalle = /detalle/.test(tsx);
  const hasMinutos = /minutos/.test(tsx);
  console.log(`   Campo detalle en JSX: ${hasDetalle ? '✅ SÍ' : '⚠️ NO encontrado'}`);
  console.log(`   Campo minutos en JSX: ${hasMinutos ? '✅ SÍ' : '⚠️ NO encontrado'}`);
}

// ============================================================
// 3. ASEGURAR CSS VISIBLE PARA TEXTO DE LANDMARKS
// ============================================================
console.log('\n=== PASO 3: Verificar CSS de landmarks ===');

const cssCandidates = [
  'app/page.module.css',
  'app/components/page.module.css',
  'styles/page.module.css',
];

let cssPath = cssCandidates.find(f => fs.existsSync(path.resolve(f)));

if (!cssPath) {
  function findCss(dir, depth = 0) {
    if (depth > 3) return null;
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        if (e.name === 'node_modules' || e.name === '.next') continue;
        const full = path.join(dir, e.name);
        if (e.isFile() && e.name === 'page.module.css') return full;
        if (e.isDirectory()) {
          const found = findCss(full, depth + 1);
          if (found) return found;
        }
      }
    } catch (e) {}
    return null;
  }
  cssPath = findCss('.');
}

if (!cssPath) {
  console.error('❌ No encontré page.module.css');
  errors++;
} else {
  cssPath = path.resolve(cssPath);
  console.log('📄 Encontrado:', cssPath);

  let css = fs.readFileSync(cssPath, 'utf8');
  const cssBackup = cssPath + '.BACKUP-' + Date.now();
  fs.writeFileSync(cssBackup, css);

  // Verificar si existen las clases de texto
  const hasRowName = /\.landmarkRowName\b/.test(css);
  const hasRowTime = /\.landmarkRowTime\b/.test(css);
  const hasRowDetail = /\.landmarkRowDetail\b/.test(css);

  console.log(`   .landmarkRowName:   ${hasRowName ? '✅ existe' : '❌ NO existe'}`);
  console.log(`   .landmarkRowTime:   ${hasRowTime ? '✅ existe' : '❌ NO existe'}`);
  console.log(`   .landmarkRowDetail: ${hasRowDetail ? '✅ existe' : '⚠️ no existe (puede usar inline)'}`);

  // Verificar si el texto tiene color visible
  // Buscar la clase .landmarkRowName y ver si tiene color
  const nameBlock = css.match(/\.landmarkRowName\s*\{[^}]*\}/);
  if (nameBlock) {
    const hasColor = /color\s*:/.test(nameBlock[0]);
    if (!hasColor) {
      console.log('⚠️  .landmarkRowName no tiene color definido — el texto puede ser invisible en fondo oscuro');
    }
  }

  // Agregar bloque de seguridad al final del CSS
  const safetyCSS = `

/* ============================================
   LANDMARK TEXT VISIBILITY FIX
   Agregado por fix-landmarks-definitivo.js
   ============================================ */
.landmarkRowName {
  color: #E8E4DC !important;
  font-family: 'Cormorant Garamond', 'Georgia', serif;
  font-size: 1rem;
  font-weight: 500;
  flex: 1;
  opacity: 1 !important;
  visibility: visible !important;
  display: inline !important;
}

.landmarkRowTime,
.landmarkRowDetail {
  color: rgba(232, 228, 220, 0.5) !important;
  font-family: 'Outfit', sans-serif;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 1 !important;
  visibility: visible !important;
  display: inline !important;
}

.landmarkRow {
  display: flex !important;
  align-items: center !important;
  gap: 1rem;
  padding: 0.85rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.landmarkRow span,
.landmarkRow div {
  opacity: 1 !important;
  visibility: visible !important;
}
`;

  // Verificar si ya existe el bloque de seguridad
  if (css.includes('LANDMARK TEXT VISIBILITY FIX')) {
    console.log('✅ El CSS ya tiene el bloque de visibilidad (de una ejecución anterior)');
  } else {
    css += safetyCSS;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('✅ Bloque de visibilidad CSS agregado al final de page.module.css');
    fixes++;
  }
}

// ============================================================
// RESUMEN
// ============================================================
console.log('\n' + '='.repeat(50));
console.log(`RESUMEN: ${fixes} arreglos aplicados, ${errors} errores`);
console.log('='.repeat(50));

if (errors === 0) {
  console.log('\n✅ TODO LISTO. Ahora:');
  console.log('   1. Si Next.js está corriendo, ciérralo: Ctrl+C');
  console.log('   2. Borra caché:  rmdir /s /q .next');
  console.log('   3. Arranca:      npm run dev');
  console.log('   4. Abre:         http://localhost:3001');
  console.log('   5. Fuerza F5:    Ctrl+Shift+R');
  console.log('\n   Deberías ver 8 landmarks con nombre, km y minutos.');
} else {
  console.log('\n⚠️  Hubo errores. Copia todo este texto y mándamelo.');
}

console.log('\n📦 Backups creados de todos los archivos modificados (*.BACKUP-*)');
