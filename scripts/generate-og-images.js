/**
 * Generate Open Graph images (1200x630 JPG) for Calcshark.
 *
 *   node scripts/generate-og-images.js          # render all
 *   node scripts/generate-og-images.js --dry     # list what would render, write nothing
 *
 * Output (public/):
 *   og-calculator-{slug}.jpg   one per BUILT calculator (skips Coming Soon)
 *   og-category-{slug}.jpg     one per category
 *   og-default.jpg             site-wide fallback
 *
 * Theme: black + purple brand palette. Each image is data-driven —
 * tool name from calculator-categories.ts, icon + eyebrow from the parent
 * category, logo/icons pulled from the installed lucide-react package.
 * "Built" = a key in the calculatorComponents map in the calculator route.
 */
const fs = require('fs');
const path = require('path');

const SITE = path.join(__dirname, '..');
const sharp = require(path.join(SITE, 'node_modules/sharp'));
const ts = require(path.join(SITE, 'node_modules/typescript'));
const ICON_DIR = path.join(SITE, 'node_modules/lucide-react/dist/esm/icons');
const PUB = path.join(SITE, 'public');
const ROUTE = path.join(SITE, 'app/[category]/[subcategory]/[calculator]/page.tsx');
const CATS = path.join(SITE, 'lib/calculator-categories.ts');

// ---------- lucide icons ----------
// PascalCase lucide name -> kebab file (Gamepad2 -> gamepad-2)
function iconFile(name){
  return name.replace(/([a-z0-9])([A-Z])/g,'$1-$2').replace(/([a-zA-Z])([0-9])/g,'$1-$2').toLowerCase();
}
// Emit an icon's SVG children; follows re-export aliases (home.js -> house.js).
function iconSvgChildren(name){
  let src = fs.readFileSync(path.join(ICON_DIR, iconFile(name)+'.js'),'utf8');
  const alias = src.match(/export\s*\{\s*default\s*\}\s*from\s*'\.\/([\w-]+)\.js'/);
  if(alias) src = fs.readFileSync(path.join(ICON_DIR, alias[1]+'.js'),'utf8');
  const lit = src.match(/createLucideIcon\("[^"]+",\s*(\[[\s\S]*\])\s*\);/)[1];
  const nodes = eval(lit); // local trusted data literal from lucide-react
  return nodes.map(([tag, attrs]) => {
    const a = Object.entries(attrs).filter(([k])=>k!=='key').map(([k,v])=>`${k}="${v}"`).join(' ');
    return `<${tag} ${a} />`;
  }).join('');
}

// ---------- text helpers ----------
function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function titleCase(s){ return s.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase()).replace(/\bAnd\b/g,'and'); }
function wrap(str, maxChars){
  const words = str.split(' '); const lines=[]; let cur='';
  for(const w of words){
    if((cur+' '+w).trim().length<=maxChars || !cur){ cur=(cur+' '+w).trim(); }
    else { lines.push(cur); cur=w; }
  }
  if(cur) lines.push(cur);
  return lines;
}
// fit the full name in <=3 lines within the width budget
function layoutTitle(title){
  const maxW = 1040;
  for(const fs of [72,66,60,54,50]){
    const cpl = Math.floor(maxW/(0.56*fs));
    const lines = wrap(title, cpl);
    if(lines.length<=2) return {lines, fs};
    if(lines.length===3 && fs<=58) return {lines, fs};
  }
  const fs=48, cpl=Math.floor(maxW/(0.56*fs));
  return {lines: wrap(title, cpl), fs};
}

// ---------- SVG ----------
function buildSvg({ title, category, icon }){
  const W=1200,H=630;
  const iconChildren = iconSvgChildren(icon);
  const logoMark = iconSvgChildren('Calculator');

  const tile=150, tileX=W/2-tile/2, tileY=150, tileR=34;
  const iconSize=80, ix=W/2-iconSize/2, iy=tileY+tile/2-iconSize/2;

  const { lines, fs: titleSize } = layoutTitle(title);
  const lineH = titleSize + 10;
  const titleStartY = tileY + tile + 56 + titleSize;
  const titleSvg = lines.map((l,i)=>
    `<text x="${W/2}" y="${titleStartY+i*lineH}" text-anchor="middle" font-family="Arial" font-weight="700" font-size="${titleSize}" fill="#ffffff">${esc(l)}</text>`
  ).join('');
  const subY = titleStartY + (lines.length-1)*lineH + 56;

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stop-color="#160f2b"/><stop offset="100%" stop-color="#0b0816"/>
    </linearGradient>
    <linearGradient id="purple" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
    <linearGradient id="mark" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#9333ea"/>
    </linearGradient>
    <linearGradient id="wordmark" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#2563eb"/><stop offset="100%" stop-color="#9333ea"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.45"/><stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/>
    </radialGradient>
    <filter id="sh" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="12" stdDeviation="22" flood-color="#8b5cf6" flood-opacity="0.55"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="${W-120}" cy="60" r="300" fill="url(#glow)"/>
  <circle cx="80" cy="${H-40}" r="240" fill="url(#glow)"/>

  <!-- logo top-left (matches header.tsx) -->
  <g transform="translate(60,52)">
    <rect width="56" height="56" rx="14" fill="url(#mark)"/>
    <g transform="translate(12,12) scale(1.333)" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${logoMark}</g>
    <text x="72" y="40" font-family="Arial" font-weight="700" font-size="34" fill="url(#wordmark)">Calcshark</text>
  </g>

  <text x="${W/2}" y="120" text-anchor="middle" font-family="Arial" font-weight="700" font-size="22" fill="#c4b5fd" letter-spacing="3">${esc(category.toUpperCase())}</text>

  <rect x="${tileX}" y="${tileY}" width="${tile}" height="${tile}" rx="${tileR}" fill="url(#purple)" filter="url(#sh)"/>
  <g transform="translate(${ix},${iy}) scale(${iconSize/24})" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconChildren}</g>

  ${titleSvg}

  <text x="${W/2}" y="${subY}" text-anchor="middle" font-family="Arial" font-weight="400" font-size="26" fill="#8b80a8">Free Online Tool &#183; No Sign Up &#183; Instant Results</text>

  <rect x="0" y="${H-12}" width="${W}" height="12" fill="url(#purple)"/>
</svg>`;
}

async function toJpg(opts, outPath){
  const svg = buildSvg(opts);
  await sharp(Buffer.from(svg)).jpeg({quality:90,chromaSubsampling:'4:4:4'}).toFile(outPath);
}

// ---------- data ----------
function loadCategories(){
  const src = fs.readFileSync(CATS,'utf8');
  const js = ts.transpileModule(src,{compilerOptions:{module:'commonjs',target:'es2019'}}).outputText;
  const mod = {exports:{}};
  new Function('module','exports','require', js)(mod, mod.exports, require);
  return mod.exports.calculatorCategories || mod.exports.default;
}
function builtSlugs(){
  const src = fs.readFileSync(ROUTE,'utf8');
  const block = src.match(/const calculatorComponents[^{]*\{([\s\S]*?)\n\};/)[1];
  const slugs = new Set();
  for(const m of block.matchAll(/^\s*'([^']+)'\s*:/gm)) slugs.add(m[1]);
  return slugs;
}
function slugIndex(categories){
  const idx = {};
  for(const cat of categories)
    for(const sub of cat.subcategories||[])
      for(const calc of sub.calculators||[])
        idx[calc.slug] = { name: calc.name, categoryName: titleCase(cat.name), icon: cat.icon };
  return idx;
}

// built slugs that aren't in the category tree -> friendly name/icon
const OVERRIDES = {
  'basic-bmi-calculator': { name:'Basic BMI Calculator', categoryName:'Health & Fitness', icon:'Heart' },
};

async function main(){
  const dry = process.argv.includes('--dry');
  const categories = loadCategories();
  const idx = slugIndex(categories);
  const built = builtSlugs();

  const calcJobs = [];
  for(const slug of built){
    const meta = idx[slug] || OVERRIDES[slug];
    if(meta){
      calcJobs.push({ slug, title: meta.name, category: meta.categoryName, icon: meta.icon });
    } else {
      const name = titleCase(slug.replace(/-/g,' ')).replace(/\bcalculator\b/i,'Calculator');
      calcJobs.push({ slug, title: name, category: 'Calculators', icon: 'Calculator' });
    }
  }
  const catJobs = categories.map(c=>({ slug:c.slug, title:titleCase(c.name), category:'Free Calculators', icon:c.icon }));

  console.log(`Built calculators: ${calcJobs.length}  |  Categories: ${catJobs.length}`);
  if(dry){ console.log('[dry run — nothing written]'); return; }

  fs.mkdirSync(PUB,{recursive:true});
  let n=0;
  for(const j of calcJobs){ await toJpg(j, path.join(PUB,`og-calculator-${j.slug}.jpg`)); n++; }
  for(const j of catJobs){ await toJpg(j, path.join(PUB,`og-category-${j.slug}.jpg`)); n++; }
  await toJpg({title:'The Ultimate Calculator Collection', category:'Free Online Calculators', icon:'Calculator'}, path.join(PUB,'og-default.jpg')); n++;

  console.log(`Wrote ${n} images to ${PUB}`);
}

main().catch(e=>{ console.error(e); process.exit(1); });
