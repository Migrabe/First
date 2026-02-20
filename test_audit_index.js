
// MOCK STATE & GLOBALS
const state = {
  aiModel: '',
  aspectRatio: '',
  resolution: '',
  quality: '',
  purpose: '',
  format: '',
  medium: '',
  mainSubject: '',
  quickStyle: '',
  cameraBody: '',
  lens: '',
  focalLength: '',
  aperture: '',
  filmStock: '',
  shotSize: '', // NEW
  angle: '',
  composition: '',
  lightType: { primary: '', accent: '' },
  timeOfDay: { primary: '', accent: '' },
  lightFX: [],
  colorPalette: '',
  mood: '',
  skinDetail: [],
  hairDetail: [],
  material: [],
  textContent: '',
  typography: [],
  photoStyle: '',
  cinemaStyle: '',
  directorStyle: '',
  artStyle: '',
  fashionFoodStyle: '',
  cinematicPreset: '',
  ambience: '',
  foley: '',
  cinematicFx: '',
  beforeAfter: false,
  seamlessPattern: false,
  seed: '',
  mjStylize: 250,
  mjChaos: 0,
  mjWeird: 0,
  mjStyle: '',
  mjVersion: '7',
  emotion: '',
  generateFourMode: false,
  referenceImages: [],
  referenceWeight: 50,
  referenceType: ''
};

const EMOTIONS = {'Joy': 'Joyful'};
const FILM_STOCKS = {'Kodak Portra 400': 'Kodak Portra 400'};
const QUICK_STYLES = {'Neon Cyberpunk': 'neon cyberpunk style'};
const FASHION_FOOD_STYLES = {};
const AMBIENCE = {};
const FOLEY = {};
const CINE_FX = {};
global.window = {
  ART_STYLES_MAP: {},
  CINEMATIC_PRESETS_MAP: {}
};
const CHATGPT_STYLE_MAP = {};

// EXTRACTED FUNCTIONS (Simplified for test)
// buildMidjourneyPrompt from index.html (approximate based on view_file)
function buildMidjourneyPrompt() {
  const desc = [];
  if (state.mainSubject) desc.push(state.mainSubject.trim());
  if (state.emotion && EMOTIONS[state.emotion]) desc.push(EMOTIONS[state.emotion]);
  if (state.format && state.format !== "photorealistic") desc.push(state.format);
  if (state.medium) desc.push(state.medium);

  if (state.cameraBody) desc.push(state.cameraBody.replace(/^shot on\s*/i, ""));
  if (state.lens) desc.push(state.lens);
  if (state.shotSize) desc.push(state.shotSize);
  if (state.focalLength) desc.push(state.focalLength);
  if (state.aperture) {
    const fMatch = state.aperture.match(/f\/[\d.]+/);
    if (fMatch) desc.push(fMatch[0]);
  }
  if (state.filmStock && FILM_STOCKS[state.filmStock]) desc.push(FILM_STOCKS[state.filmStock]);
  if (state.angle) desc.push(state.angle);
  if (state.composition) desc.push(state.composition);

  if (state.lightType.primary) desc.push(state.lightType.primary);
  if (state.lightType.accent) desc.push(state.lightType.accent);
  if (state.timeOfDay.primary) desc.push(state.timeOfDay.primary);
  if (state.timeOfDay.accent) desc.push(state.timeOfDay.accent);

  state.lightFX.forEach(fx => desc.push(fx));
  if (state.colorPalette) desc.push(state.colorPalette);
  if (state.mood) desc.push("Mood: " + state.mood);

  state.skinDetail.forEach(s => desc.push(s));
  state.hairDetail.forEach(h => desc.push(h));
  state.material.forEach(m => desc.push(m));

  if (state.textContent) desc.push(`"${state.textContent}"`);
  state.typography.forEach(t => desc.push(t));

  if (state.photoStyle) desc.push(state.photoStyle);
  if (state.cinemaStyle) desc.push(state.cinemaStyle);
  if (state.directorStyle) desc.push(state.directorStyle);
  if (state.artStyle && window.ART_STYLES_MAP[state.artStyle]) desc.push(window.ART_STYLES_MAP[state.artStyle]);
  if (state.quickStyle && QUICK_STYLES[state.quickStyle]) desc.push(QUICK_STYLES[state.quickStyle]);
  
  // ... other conditional pushes ...

  let prompt = desc.filter(Boolean).join(", ");
  prompt = prompt.replace(/,\s*,/g, ",").replace(/,\s*$/, "").trim();

  const params = [];
  if (state.aspectRatio) params.push(`--ar ${state.aspectRatio}`);
  // ... other params ...
  
  if (params.length) prompt += " " + params.join(" ");

  // KEY CHECK: No image URLs appended here
  return prompt.trim();
}

// buildFlatPrompt from index.html
function buildFlatPrompt() {
  const parts = [];
  if (state.medium) parts.push(state.medium);

  // FIX CHECK: Quick Style Overlay Logic
  if (!state.quickStyle) {
    if (state.cameraBody) parts.push(state.cameraBody);
    if (state.lens) parts.push(state.lens);
    // ...
  }
  
  if (state.quickStyle && QUICK_STYLES[state.quickStyle]) parts.push(QUICK_STYLES[state.quickStyle]);

  let finalPrompt = "Generate an image.\n";
  if (state.mainSubject) finalPrompt += `subject: ${state.mainSubject.trim()}\n`;
  
  const modifiers = parts.filter(Boolean).join(", ");
  if (modifiers) finalPrompt += modifiers;

  return finalPrompt;
}


// --- TESTS ---

// TEST 1: MJ Image URL absence
state.aiModel = 'midjourney';
state.referenceImages = [{name:'test.png', data:'data:image/png;base64,123'}];
const mjResult = buildMidjourneyPrompt();
console.log("MJ_RESULT:", mjResult);
if (mjResult.includes('data:image') || mjResult.includes('http')) {
  console.error("FAIL: MJ prompt contains image URL/Data");
} else {
  console.log("PASS: MJ prompt is text-only");
}

// TEST 2: Quick Style Conflict
state.quickStyle = 'Neon Cyberpunk';
state.cameraBody = 'Leica M6'; // Should be ignored
const flatResult = buildFlatPrompt();
console.log("FLAT_RESULT:", flatResult);
if (flatResult.includes('Leica')) {
  console.error("FAIL: Quick Style did not override Camera Body");
} else {
  console.log("PASS: Quick Style correctly ignored Camera Body");
}
