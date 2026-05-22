// AgroShield AI - Application State and Controller Logic

// ================= STATE & SEED DATA =================
const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    name: "Copper Fungicide Spray",
    category: "Fungicide",
    price: "18.50",
    compatibleCrop: "Tomato, Potato, Chili",
    targetDisease: "Late Blight, Early Blight, Leaf Spot",
    dosage: "15ml diluted in 5L water. Apply early morning every 10 days.",
    description: "Highly effective copper-based liquid fungicide formula. Forms a protective shield on leaf surfaces to inhibit fungal spore germination and control late blight infections.",
    imageUrl: "assets/prod_copper.png"
  },
  {
    id: "prod-2",
    name: "Rust-Shield Triazole Max",
    category: "Fungicide",
    price: "24.99",
    compatibleCrop: "Wheat, Barley, Oats",
    targetDisease: "Yellow Stripe Rust, Stem Rust",
    dosage: "20ml per 10L water. Apply at first sign of rust pustules.",
    description: "Systemic triazole fungicide providing curative and preventative control against stripe rusts in cereal crops. Absorbs quickly into wheat leaf tissues to stop mycelial growth.",
    imageUrl: "assets/prod_rust.png"
  },
  {
    id: "prod-3",
    name: "Bio-Pesticide Organic Neem Oil",
    category: "Bio-Pesticide",
    price: "12.95",
    compatibleCrop: "All Crops & Vegetables",
    targetDisease: "Aphids, Whiteflies, Leaf Miners, Mites",
    dosage: "5ml per 1L warm water + 2 drops organic soap. Spray bi-weekly.",
    description: "100% cold-pressed pure neem oil. Disrupts insect growth cycles, acts as a feeding deterrent, and provides bio-organic protection without harming beneficial pollinators.",
    imageUrl: "assets/prod_neem.png"
  },
  {
    id: "prod-4",
    name: "Scab-Kill Bacterial Treatment",
    category: "Insecticide",
    price: "21.00",
    compatibleCrop: "Potato, Sweet Potato",
    targetDisease: "Common Scab, Bacterial Ring Rot",
    dosage: "Soil drench: 30g powder per 20L water. Apply during sowing and tuber initiation.",
    description: "Broad-spectrum soil biological control designed to suppress Streptomyces scabies bacteria in potatoes. Promotes skin healing and boosts tuber quality.",
    imageUrl: "assets/prod_scab.png"
  },
  {
    id: "prod-5",
    name: "Blast-Guard Tricyclazole 75% WP",
    category: "Fungicide",
    price: "22.50",
    compatibleCrop: "Rice",
    targetDisease: "Rice Leaf Blast, Neck Blast",
    dosage: "10g per 15L water. Spray during active tillering or booting stage.",
    description: "Specialized systemic fungicide for blast control in paddy fields. Absorbs into rice crop roots and translocates to foliage to shield against Pyricularia oryzae.",
    imageUrl: "assets/prod_blast.png"
  },
  {
    id: "prod-6",
    name: "Bio-Algae Seaweed Fertilizer",
    category: "Fertilizer",
    price: "19.50",
    compatibleCrop: "All Crops & Ornamental Plants",
    targetDisease: "General Nutrient Deficiency, Stress Recovery",
    dosage: "10ml per 5L water. Foliar spray or soil irrigation monthly.",
    description: "Premium cold-water kelp extract. Packed with trace minerals, cytokinins, and natural stimulants to enhance root development, leaf greenness, and natural immunity to diseases.",
    imageUrl: "assets/prod_fertilizer.png"
  }
];

const DISEASE_DATABASE = {
  tomato_blight: {
    name: "Tomato Late Blight",
    pathogen: "Phytophthora infestans (Oomycete)",
    severity: "High",
    crop: "Tomato",
    symptoms: "Dark, water-soaked lesions on leaves that turn brown/black, accompanied by a white mildew growth on leaf undersides in humid conditions. Stems turn brown, causing rapid wilting.",
    causes: "Cool, wet environments (humidity > 90%, temperature between 15-22°C) combined with splashing rainwater that spreads fungal-like spores.",
    remedyId: "prod-1",
    prevention: "1. Space tomato plants for proper airflow.\n2. Avoid overhead sprinkler irrigation; water root bases.\n3. Promptly prune and burn infected foliage."
  },
  corn_rust: {
    name: "Corn Southern Rust",
    pathogen: "Puccinia polysora (Fungus)",
    severity: "Medium",
    crop: "Maize (Corn)",
    symptoms: "Circular, raised orange-to-golden pustules developing primarily on the upper surfaces of corn leaves. Pustules rupture, releasing dusty orange spores.",
    causes: "Warm temperatures (25-30°C) and high humidity. Wind-borne spores carry the disease across vast crop fields.",
    remedyId: "prod-6", // Will suggest sea weed to build immunity, or customized
    prevention: "1. Use rust-resistant hybrid corn seeds.\n2. Crop rotation with non-cereal crops.\n3. Deep tillage to bury leftover crop residues."
  },
  wheat_rust: {
    name: "Wheat Yellow Stripe Rust",
    pathogen: "Puccinia striiformis (Fungus)",
    severity: "High",
    crop: "Wheat",
    symptoms: "Narrow yellow stripes of powdery pustules running parallel to the wheat leaf veins. Causes leaf yellowing, dehydration, and shriveled grains.",
    causes: "Cool spring weather (10-15°C) with persistent heavy dew or rain. Spores travel long distances via air currents.",
    remedyId: "prod-2",
    prevention: "1. Plant rust-resistant wheat varieties (e.g. Faisalabad-08, Borlaug-16).\n2. Eradicate green bridges (volunteer wheat plants) before sowing.\n3. Optimize Nitrogen fertilization."
  },
  potato_scab: {
    name: "Potato Common Scab",
    pathogen: "Streptomyces scabies (Actinobacteria)",
    severity: "Medium",
    crop: "Potato",
    symptoms: "Raised, corky, dark brown scabs on potato skins. Internal flesh is usually unaffected, but tuber marketability drops dramatically.",
    causes: "Alkaline soils (pH > 5.5) coupled with dry soil conditions during tuber initiation (weeks 2 to 6 post-emergence).",
    remedyId: "prod-4",
    prevention: "1. Maintain high soil moisture during tuber setting.\n2. Lower soil pH using agricultural elemental sulfur.\n3. Avoid using alkaline manures."
  },
  rice_blast: {
    name: "Rice Leaf Blast",
    pathogen: "Pyricularia oryzae (Fungus)",
    severity: "High",
    crop: "Rice",
    symptoms: "Diamond-shaped (spindle-like) spots on leaves with gray centers and brown borders. Leaves dry up, and neck rot causes head drooping.",
    causes: "High nitrogen fertilization, cloudy days, cool nights, and prolonged leaf wetness in flooded paddies.",
    remedyId: "prod-5",
    prevention: "1. Avoid excessive nitrogen applications.\n2. Maintain consistent water levels in paddy fields.\n3. Burn infected straw residues post-harvest."
  },
  healthy_crop: {
    name: "Healthy Cotton Leaf",
    pathogen: "None (Healthy Crop)",
    severity: "Low",
    crop: "Cotton",
    symptoms: "Uniform vibrant green coloring, fully hydrated leaf blade, intact margin, and robust leaf vein network. No visible fungal mycelium or necrotic lesions.",
    causes: "Optimal cultivation practices, balanced soil nutrition, and timely biological checks.",
    remedyId: "prod-6",
    prevention: "1. Continue current irrigation and fertilization schedules.\n2. Perform routine visual checkups every 7 days.\n3. Maintain weed-free boundaries."
  }
};

let products = [...DEFAULT_PRODUCTS];
let customProducts = [];
let scanHistory = [];
let isAdminMode = false;
let selectedSampleLeaf = null;
let webcamStream = null;

// ================= DOM ELEMENTS =================
const pageSections = document.querySelectorAll('.page-section');
const navItems = document.querySelectorAll('.nav-item');
const toastsContainer = document.getElementById('toasts-container');
const ownerBadgeUI = document.getElementById('owner-badge-ui');
const ownerStatusLabel = document.getElementById('owner-status-label');
const ownerPortalBtn = document.getElementById('owner-portal-btn');
const adminBannerNode = document.getElementById('admin-banner-node');
const navAddProduct = document.getElementById('nav-add-product');
const adminLogoutBtn = document.getElementById('admin-logout-btn');

// Modals
const ownerLoginModal = document.getElementById('owner-login-modal');
const diagnosisModal = document.getElementById('diagnosis-modal');
const diagnosisModalBody = document.getElementById('diagnosis-modal-body');
const productModal = document.getElementById('product-modal');
const productModalBody = document.getElementById('product-modal-body');

// Form & Inputs
const ownerPasscodeInput = document.getElementById('owner-passcode-input');
const submitLoginBtn = document.getElementById('submit-login-btn');
const loginErrorMsg = document.getElementById('login-error-msg');
const addProductForm = document.getElementById('add-product-form');

// Scanner Elements
const cameraStream = document.getElementById('camera-stream');
const uploadedImagePreview = document.getElementById('uploaded-image-preview');
const scannerLaserLine = document.getElementById('scanner-laser-line');
const scannerOverlayScanning = document.getElementById('scanner-overlay-scanning');
const cameraFallbackUi = document.getElementById('camera-fallback-ui');
const toggleCameraBtn = document.getElementById('toggle-camera-btn');
const startScanBtn = document.getElementById('start-scan-btn');
const imageUploadInput = document.getElementById('image-upload-input');
const dropzoneLabel = document.getElementById('dropzone-label');
const sampleLeafCards = document.querySelectorAll('.sample-leaf-card');
const consoleLogsList = document.getElementById('console-logs-list');
const consoleStatusBadge = document.getElementById('console-status-badge');

// Shop & History Elements
const shopSearchInput = document.getElementById('shop-search-input');
const filterPillsGroup = document.getElementById('filter-pills-group');
const productsCardsGrid = document.getElementById('products-cards-grid');
const historyLogsTbody = document.getElementById('history-logs-tbody');
const historyEmptyState = document.getElementById('history-empty-state');

// Dashboard Counters
const dashboardScanCount = document.getElementById('dashboard-scan-count');
const dashboardProductCount = document.getElementById('dashboard-product-count');
const dashboardCriticalCount = document.getElementById('dashboard-critical-count');

// ================= INITIALIZATION =================
window.addEventListener('DOMContentLoaded', () => {
  loadLocalStorage();
  setupNavigation();
  setupAuthentication();
  setupScanner();
  setupRemedyShop();
  setupAddProduct();
  setupConsultationForm();
  updateDashboardCounters();
  renderProducts('All', '');
  renderScanHistory();
});

// ================= STORAGE CONTROLS =================
function loadLocalStorage() {
  // Load Custom Products
  const savedCustom = localStorage.getItem('agroshield_custom_products');
  if (savedCustom) {
    customProducts = JSON.parse(savedCustom);
    products = [...DEFAULT_PRODUCTS, ...customProducts];
  } else {
    products = [...DEFAULT_PRODUCTS];
  }

  // Load Scan History
  const savedHistory = localStorage.getItem('agroshield_scan_history');
  if (savedHistory) {
    scanHistory = JSON.parse(savedHistory);
  } else {
    scanHistory = [];
  }

  // Load Auth State
  const savedAuth = localStorage.getItem('agroshield_admin_mode');
  if (savedAuth === 'true') {
    isAdminMode = true;
    updateAuthUI();
  }
}

function saveCustomProduct(productObj) {
  customProducts.push(productObj);
  localStorage.setItem('agroshield_custom_products', JSON.stringify(customProducts));
  products = [...DEFAULT_PRODUCTS, ...customProducts];
  updateDashboardCounters();
}

function saveScanHistory(scanRecord) {
  scanHistory.unshift(scanRecord); // Add to beginning of array
  localStorage.setItem('agroshield_scan_history', JSON.stringify(scanHistory));
  updateDashboardCounters();
  renderScanHistory();
}

// ================= NAVIGATION ROUTER =================
function setupNavigation() {
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = item.getAttribute('data-tab');
      switchTab(tabName);
    });
  });
}

function switchTab(tabName) {
  // Handle sidebar active classes
  navItems.forEach(item => {
    if (item.getAttribute('data-tab') === tabName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Toggle page view
  pageSections.forEach(section => {
    if (section.id === `${tabName}-section`) {
      section.classList.add('active');
    } else {
      section.classList.remove('active');
    }
  });

  // Turn off webcam if navigating away from Scanner
  if (tabName !== 'scanner') {
    stopWebcam();
  }

  // Auto-scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================= OWNER AUTHENTICATION =================
function setupAuthentication() {
  ownerPortalBtn.addEventListener('click', () => {
    if (isAdminMode) {
      // Toggle off admin mode
      logoutAdmin();
    } else {
      openModal('owner-login-modal');
      ownerPasscodeInput.focus();
    }
  });

  submitLoginBtn.addEventListener('click', processLogin);
  ownerPasscodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') processLogin();
  });

  adminLogoutBtn.addEventListener('click', logoutAdmin);
}

function processLogin() {
  const code = ownerPasscodeInput.value.trim();
  if (code === 'pakistan1234@') {
    isAdminMode = true;
    localStorage.setItem('agroshield_admin_mode', 'true');
    updateAuthUI();
    closeModal('owner-login-modal');
    ownerPasscodeInput.value = '';
    loginErrorMsg.style.display = 'none';
    showToast('Authenticated! Administrative Mode enabled.', 'success');
  } else {
    loginErrorMsg.style.display = 'block';
    showToast('Invalid passcode. Access Denied.', 'error');
  }
}

function logoutAdmin() {
  isAdminMode = false;
  localStorage.setItem('agroshield_admin_mode', 'false');
  updateAuthUI();
  showToast('Exited Administrative Mode. Switched to Farmer Mode.', 'info');
  // If user was on Add Product page, redirect to Dashboard
  const activeTab = document.querySelector('.nav-item.active').getAttribute('data-tab');
  if (activeTab === 'add-product') {
    switchTab('dashboard');
  }
}

function updateAuthUI() {
  if (isAdminMode) {
    ownerBadgeUI.classList.add('logged-in');
    ownerStatusLabel.innerText = "Owner Mode";
    ownerPortalBtn.innerText = "Logout";
    adminBannerNode.style.display = "flex";
    navAddProduct.style.display = "block";
  } else {
    ownerBadgeUI.classList.remove('logged-in');
    ownerStatusLabel.innerText = "Farmer Mode";
    ownerPortalBtn.innerText = "Login";
    adminBannerNode.style.display = "none";
    navAddProduct.style.display = "none";
  }
}

// ================= TOAST SYSTEM =================
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast-item ${type}`;

  let iconSVG = '';
  if (type === 'success') {
    iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
  } else if (type === 'error') {
    iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  } else {
    iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
  }

  toast.innerHTML = `
    ${iconSVG}
    <span class="toast-text">${message}</span>
    <button class="toast-close-btn" onclick="this.parentElement.remove()">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  `;

  toastsContainer.appendChild(toast);

  // Auto remove toast after 4s
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.animation = 'fadeIn 0.3s ease-out reverse';
      setTimeout(() => toast.remove(), 300);
    }
  }, 4000);
}

// ================= MODAL OPEN/CLOSE =================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'flex';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
  }
}

// ================= CROP SCANNER CONTROLLERS =================
function setupScanner() {
  // Sample card selection clicks
  sampleLeafCards.forEach(card => {
    card.addEventListener('click', () => {
      // Toggle active states
      sampleLeafCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      selectedSampleLeaf = card.getAttribute('data-sample');

      // Stop camera stream if active to show preview thumbnail
      stopWebcam();

      // Show sample preview in scanner window
      cameraFallbackUi.style.display = 'none';
      cameraStream.style.display = 'none';
      uploadedImagePreview.style.display = 'block';

      // Set thumbnail display background color/gradients to mock leaf photo
      const thumbnailStyle = card.querySelector('.sample-leaf-thumbnail').style.background;
      uploadedImagePreview.src = '';
      uploadedImagePreview.style.background = thumbnailStyle;

      // Enable scan button
      startScanBtn.disabled = false;

      // Output logs
      clearConsoleLogs();
      addConsoleLog(`[SYSTEM] Loaded sample crop: ${DISEASE_DATABASE[selectedSampleLeaf].crop} leaf.`, 'info');
      addConsoleLog(`[SYSTEM] Ready for leaf analysis. Click "Scan Plant Leaf" to begin.`, 'info');
    });
  });

  // Toggle Camera Click
  toggleCameraBtn.addEventListener('click', () => {
    if (webcamStream) {
      stopWebcam();
    } else {
      startWebcam();
    }
  });

  // File Upload Handling
  imageUploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      // De-select sample leaves
      sampleLeafCards.forEach(c => c.classList.remove('active'));
      selectedSampleLeaf = null;

      // Stop webcam
      stopWebcam();

      // Read image
      const reader = new FileReader();
      reader.onload = (event) => {
        cameraFallbackUi.style.display = 'none';
        cameraStream.style.display = 'none';
        uploadedImagePreview.style.display = 'block';
        uploadedImagePreview.src = event.target.result;
        uploadedImagePreview.style.background = 'none';

        startScanBtn.disabled = false;

        clearConsoleLogs();
        addConsoleLog(`[SYSTEM] Local image uploaded successfully (${(file.size/1024).toFixed(1)} KB).`, 'success');
        addConsoleLog(`[SYSTEM] Image resolution parsed. Ready for diagnosis.`, 'info');
      };
      reader.readAsDataURL(file);
    }
  });

  // Start Scanner Trigger
  startScanBtn.addEventListener('click', executeCropDiagnosis);
}

// Start Webcam Stream
async function startWebcam() {
  try {
    // Clear selections
    sampleLeafCards.forEach(c => c.classList.remove('active'));
    selectedSampleLeaf = null;
    uploadedImagePreview.style.display = 'none';

    webcamStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false
    });

    cameraStream.srcObject = webcamStream;
    cameraStream.style.display = 'block';
    cameraFallbackUi.style.display = 'none';

    toggleCameraBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
      Stop Camera
    `;
    toggleCameraBtn.classList.remove('btn-secondary');
    toggleCameraBtn.classList.add('btn-danger');

    startScanBtn.disabled = false;

    clearConsoleLogs();
    addConsoleLog('[SYSTEM] Camera sensor connected. Live crop stream feeding...', 'success');
  } catch (err) {
    showToast('Webcam access failed. Please select leaf samples instead.', 'error');
    console.error('Camera Access Error:', err);
  }
}

// Stop Webcam Stream
function stopWebcam() {
  if (webcamStream) {
    webcamStream.getTracks().forEach(track => track.stop());
    webcamStream = null;
  }
  cameraStream.srcObject = null;
  cameraStream.style.display = 'none';
  
  // Revert buttons
  toggleCameraBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/><path d="M5 9h.01"/></svg>
    Start Webcam
  `;
  toggleCameraBtn.classList.remove('btn-danger');
  toggleCameraBtn.classList.add('btn-secondary');

  // If no sample leaf and no upload image, disable scan button
  if (!selectedSampleLeaf && !uploadedImagePreview.src) {
    startScanBtn.disabled = true;
    cameraFallbackUi.style.display = 'flex';
  }
}

// Console Logs Utility
function clearConsoleLogs() {
  consoleLogsList.innerHTML = '';
}

function addConsoleLog(message, type = 'info') {
  const line = document.createElement('div');
  line.className = `console-log-line ${type === 'success' ? 'text-success' : type === 'error' ? 'text-danger' : ''}`;
  
  // Format current timestamp
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${(now.getMilliseconds()/10).toFixed(0).toString().padStart(2, '0')}`;
  
  line.innerText = `[${timeStr}] ${message}`;
  consoleLogsList.appendChild(line);
  consoleLogsList.scrollTop = consoleLogsList.scrollHeight;
}

// Crop Scan Simulation
function executeCropDiagnosis() {
  // Update state to scanning
  startScanBtn.disabled = true;
  toggleCameraBtn.disabled = true;
  imageUploadInput.disabled = true;
  consoleStatusBadge.innerText = 'PROCESSING';
  consoleStatusBadge.style.color = 'var(--warning)';

  // Visual scan lines
  scannerLaserLine.style.display = 'block';
  scannerOverlayScanning.style.display = 'block';

  clearConsoleLogs();
  addConsoleLog('[PROCESS] Commencing diagnostic analysis sequence...', 'info');

  const steps = [
    { delay: 400, text: '[INFO] Mapping neural grids over leaf blade...' },
    { delay: 900, text: '[INFO] Calculating chlorophyll density index (NDVI)...' },
    { delay: 1400, text: '[PROCESS] Matching lesion textures against agricultural library...' },
    { delay: 2000, text: '[PROCESS] Compiling disease symptom correlation index...' },
    { delay: 2500, text: '[SUCCESS] Diagnosis completed.' }
  ];

  steps.forEach(step => {
    setTimeout(() => {
      addConsoleLog(step.text, step.text.includes('SUCCESS') ? 'success' : 'info');
    }, step.delay);
  });

  // Complete Scan after 3 seconds
  setTimeout(() => {
    // Reset scanner visuals
    scannerLaserLine.style.display = 'none';
    scannerOverlayScanning.style.display = 'none';
    startScanBtn.disabled = false;
    toggleCameraBtn.disabled = false;
    imageUploadInput.disabled = false;
    consoleStatusBadge.innerText = 'COMPLETED';
    consoleStatusBadge.style.color = 'var(--primary)';

    // Determine target disease result
    let diagnosisResultKey = '';
    
    if (selectedSampleLeaf) {
      diagnosisResultKey = selectedSampleLeaf;
    } else {
      // If camera capture or custom upload, randomize from DB (except healthy)
      const keys = Object.keys(DISEASE_DATABASE).filter(k => k !== 'healthy_crop');
      diagnosisResultKey = keys[Math.floor(Math.random() * keys.length)];
    }

    const diagnosis = DISEASE_DATABASE[diagnosisResultKey];
    addConsoleLog(`[RESULT] Disease Detected: ${diagnosis.name} (${diagnosis.pathogen})`, 'success');

    // Create log record
    const record = {
      id: "scan-" + Date.now(),
      timestamp: new Date().toLocaleString(),
      crop: diagnosis.crop,
      disease: diagnosis.name,
      severity: diagnosis.severity,
      remedyId: diagnosis.remedyId,
      dbKey: diagnosisResultKey
    };

    saveScanHistory(record);
    showToast(`Diagnosis success: ${diagnosis.name} identified.`, 'success');

    // Render report modal
    openDiagnosisReport(diagnosisResultKey);

  }, 3000);
}

// Open Diagnosis Report Modal
function openDiagnosisReport(dbKey) {
  const d = DISEASE_DATABASE[dbKey];
  const recommendedProduct = products.find(p => p.id === d.remedyId) || products[0];

  const severityClass = d.severity.toLowerCase();

  diagnosisModalBody.innerHTML = `
    <div class="diagnosis-hero-box ${dbKey === 'healthy_crop' ? 'healthy' : ''}">
      <div class="diagnosis-hero-icon">
        ${dbKey === 'healthy_crop' ? 
          `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>` :
          `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
        }
      </div>
      <div class="diagnosis-hero-info">
        <span class="diagnosis-severity-badge ${severityClass}">${d.severity} Severity</span>
        <span class="diagnosis-label-subtitle">Identified crop disease</span>
        <span class="diagnosis-value-name">${d.name}</span>
      </div>
    </div>

    <div class="diagnosis-details-sections">
      <div class="diagnosis-block-item">
        <span class="diagnosis-block-title">Pathogen / Scientific Name</span>
        <span class="diagnosis-block-text" style="font-style: italic; color:#fff;">${d.pathogen}</span>
      </div>
      <div class="diagnosis-block-item">
        <span class="diagnosis-block-title">Target Crop Family</span>
        <span class="diagnosis-block-text">${d.crop}</span>
      </div>
      <div class="diagnosis-block-item" style="grid-column: 1 / -1;">
        <span class="diagnosis-block-title">Key Symptoms</span>
        <span class="diagnosis-block-text">${d.symptoms}</span>
      </div>
      <div class="diagnosis-block-item" style="grid-column: 1 / -1;">
        <span class="diagnosis-block-title">Outbreak Triggers & Causes</span>
        <span class="diagnosis-block-text">${d.causes}</span>
      </div>
      <div class="diagnosis-block-item" style="grid-column: 1 / -1;">
        <span class="diagnosis-block-title">Preventative Crop Measures</span>
        <span class="diagnosis-block-text" style="white-space: pre-line;">${d.prevention}</span>
      </div>
    </div>

    <div class="diagnosis-block-item" style="margin-top: 0.5rem;">
      <span class="diagnosis-block-title">Suggested Crop Medicine Treatment</span>
      <div class="diagnosis-remedy-card">
        <div class="diagnosis-remedy-left">
          <div class="diagnosis-remedy-img" style="background: linear-gradient(135deg, #059669, #06b6d4); display: flex; align-items:center; justify-content:center; color:#fff; font-size:1.5rem;">💊</div>
          <div class="diagnosis-remedy-details">
            <span class="diagnosis-remedy-title">${recommendedProduct.name}</span>
            <span class="diagnosis-remedy-category">${recommendedProduct.category} • $${recommendedProduct.price}</span>
          </div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="closeModal('diagnosis-modal'); viewProductDetails('${recommendedProduct.id}')" style="flex:0 0 auto;">
          View Medicine
        </button>
      </div>
    </div>
  `;

  openModal('diagnosis-modal');
}

// Open disease details directly from Crop Library click
window.showDiseaseFromLibrary = function(dbKey) {
  openDiagnosisReport(dbKey);
};

// ================= REMEDY SHOP SYSTEM =================
function setupRemedyShop() {
  // Free text search typing
  shopSearchInput.addEventListener('input', () => {
    const query = shopSearchInput.value.toLowerCase().trim();
    const activePill = document.querySelector('.filter-pill.active');
    const category = activePill ? activePill.getAttribute('data-category') : 'All';
    renderProducts(category, query);
  });

  // Filter Pill clicks
  const pills = filterPillsGroup.querySelectorAll('.filter-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const category = pill.getAttribute('data-category');
      const query = shopSearchInput.value.toLowerCase().trim();
      renderProducts(category, query);
    });
  });
}

function renderProducts(category, searchQuery) {
  productsCardsGrid.innerHTML = '';
  
  const filtered = products.filter(p => {
    const matchesCategory = (category === 'All' || p.category === category);
    
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery) ||
      p.compatibleCrop.toLowerCase().includes(searchQuery) ||
      p.targetDisease.toLowerCase().includes(searchQuery);

    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    productsCardsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 0.5rem;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <p>No agricultural remedies match your filters.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'glass-card product-card';
    
    // Choose styling based on category
    let colorGradient = 'linear-gradient(135deg, #065f46, #06b6d4)';
    if (p.category === 'Insecticide') colorGradient = 'linear-gradient(135deg, #1e3a8a, #3b82f6)';
    if (p.category === 'Bio-Pesticide') colorGradient = 'linear-gradient(135deg, #78350f, #fbbf24)';
    if (p.category === 'Fertilizer') colorGradient = 'linear-gradient(135deg, #5b21b6, #8b5cf6)';

    card.innerHTML = `
      <div class="product-image-container" style="background: ${colorGradient}; display:flex; align-items:center; justify-content:center; color:#fff; font-size: 3rem;">
        🍃
        <span class="product-tag-category">${p.category}</span>
      </div>
      <div class="product-body-content">
        <div class="product-title-row">
          <h4 class="product-title">${p.name}</h4>
          <span class="product-price-label">$${p.price}</span>
        </div>
        <p class="product-desc-para">${p.description}</p>
        <div class="product-badges-row">
          <span class="product-target-badge crop">
            Crops: ${p.compatibleCrop}
          </span>
          <span class="product-target-badge">
            Targets: ${p.targetDisease}
          </span>
        </div>
        <div class="product-actions-footer">
          <button class="btn btn-secondary btn-sm" onclick="viewProductDetails('${p.id}')">Info Details</button>
          <button class="btn btn-primary btn-sm" onclick="purchaseProduct('${p.name}')">Buy Sample</button>
        </div>
      </div>
    `;

    productsCardsGrid.appendChild(card);
  });
}

// Purchase click handle
window.purchaseProduct = function(name) {
  showToast(`Sample order for ${name} initiated! Checking local stock.`, 'info');
};

// View Product Details Modal
window.viewProductDetails = function(prodId) {
  const p = products.find(item => item.id === prodId);
  if (!p) return;

  let colorGradient = 'linear-gradient(135deg, #065f46, #06b6d4)';
  if (p.category === 'Insecticide') colorGradient = 'linear-gradient(135deg, #1e3a8a, #3b82f6)';
  if (p.category === 'Bio-Pesticide') colorGradient = 'linear-gradient(135deg, #78350f, #fbbf24)';
  if (p.category === 'Fertilizer') colorGradient = 'linear-gradient(135deg, #5b21b6, #8b5cf6)';

  productModalBody.innerHTML = `
    <div class="product-detail-img-box" style="background: ${colorGradient}; display:flex; align-items:center; justify-content:center; color:#fff; font-size:6rem;">
      🌿
    </div>
    <div class="product-detail-info-block">
      <span class="product-detail-category-badge">${p.category}</span>
      <h3 class="product-detail-title-val">${p.name}</h3>
      <span class="product-detail-price-val">$${p.price}</span>
      
      <div class="product-meta-row">
        <div class="product-meta-item-val">
          <span class="product-meta-item-lbl">Crops:</span>
          <span class="product-meta-item-desc">${p.compatibleCrop}</span>
        </div>
        <div class="product-meta-item-val">
          <span class="product-meta-item-lbl">Targets:</span>
          <span class="product-meta-item-desc">${p.targetDisease}</span>
        </div>
        <div class="product-meta-item-val">
          <span class="product-meta-item-lbl">Dosage:</span>
          <span class="product-meta-item-desc" style="color:var(--warning);">${p.dosage}</span>
        </div>
      </div>
      
      <p class="product-detail-desc-val">${p.description}</p>
      
      <div style="margin-top: auto; display:flex; gap: 1rem;">
        <button class="btn btn-secondary" onclick="closeModal('product-modal')">Close Info</button>
        <button class="btn btn-primary" onclick="closeModal('product-modal'); purchaseProduct('${p.name}')">Purchase Sample</button>
      </div>
    </div>
  `;

  openModal('product-modal');
};

// ================= ADD REMEDY PRODUCT (OWNER ONLY) =================
function setupAddProduct() {
  addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Auth guard
    if (!isAdminMode) {
      showToast('Admin Mode is inactive. Please authenticate as Store Owner.', 'error');
      return;
    }

    const name = document.getElementById('prod-name').value.trim();
    const category = document.getElementById('prod-category').value;
    const price = parseFloat(document.getElementById('prod-price').value.trim()).toFixed(2);
    const crop = document.getElementById('prod-target-crop').value.trim();
    const disease = document.getElementById('prod-target-disease').value.trim();
    const dosage = document.getElementById('prod-dosage').value.trim();
    const desc = document.getElementById('prod-desc').value.trim();

    if (!name || !category || isNaN(price) || !crop || !disease || !dosage || !desc) {
      showToast('Please fill out all product details correctly.', 'error');
      return;
    }

    const newProd = {
      id: "prod-" + Date.now(),
      name: name,
      category: category,
      price: price,
      compatibleCrop: crop,
      targetDisease: disease,
      dosage: dosage,
      description: desc,
      imageUrl: ""
    };

    saveCustomProduct(newProd);
    showToast(`New remedy "${name}" successfully listed in catalog!`, 'success');
    
    // Clear form
    addProductForm.reset();

    // Re-render shop and route back to shop
    renderProducts('All', '');
    switchTab('shop');
  });
}

// ================= SCAN HISTORY RENDERING =================
function renderScanHistory() {
  historyLogsTbody.innerHTML = '';
  
  if (scanHistory.length === 0) {
    historyLogsTbody.innerHTML = '';
    historyEmptyState.style.display = 'block';
    return;
  }

  historyEmptyState.style.display = 'none';

  scanHistory.forEach(record => {
    const tr = document.createElement('tr');
    tr.className = 'history-row';

    const severityClass = record.severity.toLowerCase();

    tr.innerHTML = `
      <td style="color: var(--text-muted); font-size: 0.8rem;">${record.timestamp}</td>
      <td style="font-weight: 600; color:#fff;">${record.crop}</td>
      <td>${record.disease}</td>
      <td><span class="badge-history-severity ${severityClass}">${record.severity}</span></td>
      <td style="font-size:0.85rem; color: var(--primary);">${products.find(p => p.id === record.remedyId)?.name || 'Default Remedy'}</td>
      <td>
        <button class="btn-history-view" onclick="openDiagnosisReport('${record.dbKey}')">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          Report
        </button>
      </td>
    `;
    historyLogsTbody.appendChild(tr);
  });
}

// ================= STATS COUNTERS =================
function updateDashboardCounters() {
  dashboardScanCount.innerText = scanHistory.length;
  dashboardProductCount.innerText = products.length;
  
  // Calculate active diseases (severity Medium or High in history)
  const criticalCount = scanHistory.filter(r => (r.severity === 'Medium' || r.severity === 'High') && r.dbKey !== 'healthy_crop').length;
  dashboardCriticalCount.innerText = criticalCount;
}

// ================= CONSULTATION FORM HANDLER =================
function setupConsultationForm() {
  const consultForm = document.getElementById('consultation-form');
  if (!consultForm) return;

  consultForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('consult-name').value.trim();
    const phone = document.getElementById('consult-phone').value.trim();
    const msg = document.getElementById('consult-msg').value.trim();

    if (!name || !phone || !msg) {
      showToast('Please fill out all consultation fields.', 'error');
      return;
    }

    // Success response
    showToast(`Consultation request submitted! Our crop care specialist will contact you at ${phone} shortly.`, 'success');
    consultForm.reset();
  });
}

// ================= CONTACT FORM HANDLER =================
(function setupContactForm() {
  window.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const issueType = document.getElementById('contact-issue-type').value;
      const msg = document.getElementById('contact-msg').value.trim();
      if (!name || !phone || !issueType || !msg) {
        showToast('Please fill out all fields.', 'error');
        return;
      }
      // Save message to localStorage
      const messages = JSON.parse(localStorage.getItem('agroshield_customer_messages') || '[]');
      messages.unshift({
        id: 'msg-' + Date.now(),
        name, phone, issueType, msg,
        timestamp: new Date().toLocaleString(),
        status: 'New'
      });
      localStorage.setItem('agroshield_customer_messages', JSON.stringify(messages));
      showToast(`Message received, ${name}! We will contact you shortly.`, 'success');
      form.reset();
      // Update admin panel if open
      renderAdminMessages();
    });
  });
})();

// ================= FAQ TOGGLE =================
window.toggleFaq = function(el) {
  const answer = el.querySelector('.faq-answer');
  const arrow = el.querySelector('.faq-arrow');
  const isOpen = el.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-item.open').forEach(item => {
    item.classList.remove('open');
    item.querySelector('.faq-answer').style.maxHeight = '0';
    item.querySelector('.faq-arrow').style.transform = 'rotate(0deg)';
  });
  if (!isOpen) {
    el.classList.add('open');
    answer.style.maxHeight = answer.scrollHeight + 'px';
    arrow.style.transform = 'rotate(180deg)';
  }
};

// ================= ADMIN PANEL LOGIC =================
function renderAdminMedicineTable() {
  const tbody = document.getElementById('admin-medicine-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  products.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:600; color:#fff;">${p.name}</td>
      <td>${p.category}</td>
      <td style="color:var(--primary);">$${p.price}</td>
      <td style="font-size:0.8rem; color:var(--text-muted);">${p.compatibleCrop}</td>
      <td>
        ${p.id.startsWith('prod-1') || ['prod-1','prod-2','prod-3','prod-4','prod-5','prod-6'].includes(p.id) ? 
          '<span style="font-size:0.75rem; color:var(--text-muted);">Default</span>' :
          `<button class="btn-history-view" style="color:var(--danger);" onclick="adminDeleteProduct('${p.id}')">Remove</button>`
        }
      </td>
    `;
    tbody.appendChild(tr);
  });
  const countEl = document.getElementById('admin-total-products');
  if (countEl) countEl.textContent = products.length;
  const scansEl = document.getElementById('admin-scans-count');
  if (scansEl) scansEl.textContent = scanHistory.length;
}

function renderAdminMessages() {
  const container = document.getElementById('admin-messages-list');
  if (!container) return;
  const messages = JSON.parse(localStorage.getItem('agroshield_customer_messages') || '[]');
  const countEl = document.getElementById('admin-messages-count');
  if (countEl) countEl.textContent = messages.length;
  if (messages.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:2rem; color:var(--text-muted);">No customer messages yet.</div>';
    return;
  }
  container.innerHTML = messages.map(m => `
    <div style="border:0.5px solid rgba(255,255,255,0.08); border-radius:8px; padding:1rem; margin-bottom:0.75rem; background:rgba(255,255,255,0.02);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
        <span style="font-weight:600; color:#fff;">${m.name} <span style="color:var(--text-muted); font-weight:400; font-size:0.85rem;">— ${m.phone}</span></span>
        <span style="font-size:0.75rem; color:var(--text-muted);">${m.timestamp}</span>
      </div>
      <div style="margin-bottom:0.4rem;"><span style="background:rgba(16,185,129,0.12); color:var(--primary); font-size:0.75rem; padding:2px 8px; border-radius:20px;">${m.issueType}</span></div>
      <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.5; margin:0;">${m.msg}</p>
    </div>
  `).join('');
}

window.adminDeleteProduct = function(prodId) {
  customProducts = customProducts.filter(p => p.id !== prodId);
  products = [...DEFAULT_PRODUCTS, ...customProducts];
  localStorage.setItem('agroshield_custom_products', JSON.stringify(customProducts));
  renderAdminMedicineTable();
  renderProducts('All', '');
  updateDashboardCounters();
  showToast('Medicine removed from catalog.', 'info');
};

// Patch switchTab to refresh admin panel on entry
const _originalSwitchTab = switchTab;
window.switchTab = function(tabName) {
  _originalSwitchTab(tabName);
  if (tabName === 'admin-panel') {
    renderAdminMedicineTable();
    renderAdminMessages();
  }
};

// Patch updateAuthUI to also show admin-panel nav item
const _originalUpdateAuthUI = updateAuthUI;
window.updateAuthUI = function() {
  _originalUpdateAuthUI();
  const navAdminPanel = document.getElementById('nav-admin-panel');
  if (navAdminPanel) {
    navAdminPanel.style.display = isAdminMode ? 'block' : 'none';
  }
};
