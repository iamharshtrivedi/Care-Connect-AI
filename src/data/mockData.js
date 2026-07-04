// Seeded mock data for the entire CareConnect AI prototype

export const MOCK_PATIENT_PROFILE = {
  id: "PAT-2024-0847",
  name: "Sarah Mitchell",
  age: 34,
  gender: "Female",
  bloodType: "O+",
  allergies: ["Penicillin", "Latex"],
  currentMedications: ["Aspirin 81mg daily", "Lisinopril 10mg daily"],
  conditions: ["Mild Hypertension"],
  insuranceProvider: "BlueCross Shield",
  lastVisit: "2024-11-28",
  emergencyContact: "James Mitchell (Spouse) — 555-0142"
};

export const MOCK_MEDICATIONS = [
  { id: 1, name: "Aspirin 81mg", schedule: "Daily — Morning", taken: true, time: "08:00 AM" },
  { id: 2, name: "Lisinopril 10mg", schedule: "Daily — Evening", taken: true, time: "08:00 PM" },
  { id: 3, name: "Vitamin D3 2000 IU", schedule: "Daily — Morning", taken: false, time: "08:00 AM" },
  { id: 4, name: "Omega-3 Fish Oil", schedule: "Daily — Lunch", taken: false, time: "12:00 PM" },
];

export const MOCK_WEARABLE_DATA = {
  heartRate: {
    current: 72,
    resting: 65,
    max: 142,
    data: [
      { time: "00:00", bpm: 62 }, { time: "02:00", bpm: 58 }, { time: "04:00", bpm: 55 },
      { time: "06:00", bpm: 64 }, { time: "08:00", bpm: 78 }, { time: "10:00", bpm: 85 },
      { time: "12:00", bpm: 82 }, { time: "14:00", bpm: 90 }, { time: "16:00", bpm: 88 },
      { time: "18:00", bpm: 76 }, { time: "20:00", bpm: 72 }, { time: "22:00", bpm: 68 },
    ]
  },
  sleepQuality: 78,
  steps: 8432,
  stepsGoal: 10000,
  calories: 1856,
  caloriesGoal: 2200,
  bloodOxygen: 98,
};

export const MOCK_VOICE_SYMPTOMS = [
  "Severe throbbing headache on the right side for 2 days, accompanied by nausea and light sensitivity",
  "Persistent dry cough for the past week, with occasional chest tightness and mild fever of 100.2°F",
  "Sharp intermittent abdominal pain in the lower right quadrant, worse after eating, with mild bloating",
  "Recurring dizziness when standing up quickly, with occasional blurred vision and fatigue lasting 3 days",
];

export const MOCK_IMAGE_ANALYSIS = {
  imageType: "Dermatological Assessment",
  findings: [
    { label: "Lesion Pattern", value: "Circular, well-demarcated erythematous patch" },
    { label: "Distribution", value: "Localized, single site — left forearm" },
    { label: "Surface Texture", value: "Slightly raised with fine scaling at periphery" },
    { label: "Color Analysis", value: "Central clearing with active erythematous border" },
  ],
  aiAssessment: "Pattern consistent with Tinea Corporis (ringworm). Recommend topical antifungal. Low urgency — suitable for telehealth follow-up.",
  confidence: 82,
};

export const INITIAL_CASE_QUEUE = [
  {
    id: "CASE-001",
    patientName: "Robert Chen",
    age: 58,
    symptoms: "Chest tightness, shortness of breath during exertion, radiating discomfort to left arm",
    submittedAt: "14:12:03",
    urgency: "emergency",
    status: "pending",
    aiDiagnosis: {
      differential: [
        { condition: "Acute Coronary Syndrome", confidencePct: 78, reasoning: "Classic presentation of exertional chest pain with left arm radiation in a 58-year-old male. Risk factors suggest cardiac etiology." },
        { condition: "Stable Angina", confidencePct: 15, reasoning: "Exertional symptoms could indicate stable angina, though radiation pattern raises concern for ACS." },
        { condition: "Musculoskeletal Strain", confidencePct: 7, reasoning: "Less likely given the exertional nature and radiation pattern." },
      ],
      urgency: "emergency",
      remedies: ["Seek immediate emergency care", "Chew 325mg Aspirin if not allergic", "Do not drive — call 911"],
      disclaimer: "This is AI-generated decision support, not a medical diagnosis."
    },
    medications: ["Metformin 500mg", "Atorvastatin 20mg"],
  },
  {
    id: "CASE-002",
    patientName: "Emily Watson",
    age: 27,
    symptoms: "Recurring lower back pain for 3 weeks, worse in the morning, stiffness lasting over 1 hour",
    submittedAt: "13:45:22",
    urgency: "moderate",
    status: "pending",
    aiDiagnosis: {
      differential: [
        { condition: "Ankylosing Spondylitis", confidencePct: 55, reasoning: "Morning stiffness >1 hour with chronic lower back pain in a young adult is suggestive of inflammatory spondyloarthropathy." },
        { condition: "Mechanical Low Back Pain", confidencePct: 35, reasoning: "Common cause of back pain, but morning stiffness duration is atypical for purely mechanical origin." },
        { condition: "Herniated Disc", confidencePct: 10, reasoning: "Could cause persistent pain but usually associated with radicular symptoms." },
      ],
      urgency: "moderate",
      remedies: ["Apply heat therapy in the morning", "Gentle stretching exercises", "NSAIDs for pain management", "Schedule rheumatology referral"],
      disclaimer: "This is AI-generated decision support, not a medical diagnosis."
    },
    medications: ["Ibuprofen 400mg PRN"],
  },
  {
    id: "CASE-003",
    patientName: "David Park",
    age: 42,
    symptoms: "Itchy, watery eyes with sneezing and nasal congestion, seasonal pattern for past 3 years",
    submittedAt: "12:30:15",
    urgency: "low",
    status: "reviewed",
    aiDiagnosis: {
      differential: [
        { condition: "Allergic Rhinitis", confidencePct: 92, reasoning: "Classic triad of sneezing, nasal congestion, and ocular symptoms with seasonal recurrence strongly suggests allergic rhinitis." },
        { condition: "Non-Allergic Rhinitis", confidencePct: 6, reasoning: "Similar symptoms but seasonal pattern makes allergic etiology more likely." },
        { condition: "Viral Upper Respiratory Infection", confidencePct: 2, reasoning: "Unlikely given chronic seasonal pattern over 3 years." },
      ],
      urgency: "low",
      remedies: ["Start oral antihistamine (Cetirizine 10mg daily)", "Intranasal corticosteroid spray", "Avoid known allergen triggers", "Consider allergen immunotherapy if persistent"],
      disclaimer: "This is AI-generated decision support, not a medical diagnosis."
    },
    medications: [],
    doctorDecision: "accepted",
  },
  {
    id: "CASE-004",
    patientName: "Maria Gonzalez",
    age: 65,
    symptoms: "Sudden onset of weakness in right arm, difficulty speaking clearly, started 45 minutes ago",
    submittedAt: "15:02:18",
    urgency: "emergency",
    status: "pending",
    aiDiagnosis: {
      differential: [
        { condition: "Acute Ischemic Stroke", confidencePct: 88, reasoning: "Sudden onset of focal neurological deficits (unilateral weakness, aphasia) strongly indicates acute cerebrovascular event. Time window (< 4.5h) is critical for thrombolytics." },
        { condition: "Transient Ischemic Attack (TIA)", confidencePct: 10, reasoning: "Symptoms could resolve, but must be treated as acute stroke until proven otherwise." },
        { condition: "Complicated Migraine", confidencePct: 2, reasoning: "Can mimic stroke, but less likely given patient age and lack of headache history." }
      ],
      urgency: "emergency",
      remedies: ["Call 911 immediately", "Note exact time symptoms started", "Do not give aspirin until CT scan rules out hemorrhage", "Keep patient lying flat"],
      disclaimer: "This is AI-generated decision support, not a medical diagnosis."
    },
    medications: ["Lisinopril 20mg", "Amlodipine 5mg"],
  }
];

export const MOCK_DOCTOR_ANALYTICS = {
  timeSaved: [
    { day: "Mon", minutes: 42 }, { day: "Tue", minutes: 38 },
    { day: "Wed", minutes: 55 }, { day: "Thu", minutes: 47 },
    { day: "Fri", minutes: 61 }, { day: "Sat", minutes: 33 },
    { day: "Sun", minutes: 28 },
  ],
  overrideRates: [
    { week: "W1", rate: 28 }, { week: "W2", rate: 22 },
    { week: "W3", rate: 18 }, { week: "W4", rate: 15 },
    { week: "W5", rate: 12 }, { week: "W6", rate: 14 },
    { week: "W7", rate: 10 }, { week: "W8", rate: 8 },
  ],
  totalCasesToday: 18,
  avgConfidence: 84.2,
  aiAccuracy: 91.7,
};

export const DRUG_INTERACTIONS = {
  "Warfarin": ["Aspirin", "Ibuprofen", "Naproxen"],
  "Methotrexate": ["Ibuprofen", "Naproxen", "Aspirin"],
  "Lithium": ["Ibuprofen", "Naproxen", "ACE Inhibitors"],
  "Digoxin": ["Amiodarone", "Verapamil"],
  "Aspirin": ["Warfarin", "Clopidogrel", "Methotrexate"],
};

export const CASE_STUDIES = [
  {
    id: "CS-001",
    title: "Migraine vs. Tension Headache — Differential Analysis",
    category: "Neurology",
    difficulty: "Intermediate",
    presentation: "A 29-year-old female presents with recurring episodes of unilateral pulsating headaches lasting 4-72 hours. She reports associated photophobia, phonophobia, and nausea. Symptoms worsen with physical activity. She notes a visual aura (zigzag lines) preceding some episodes.",
    aiReasoning: [
      { step: 1, title: "Symptom Pattern Analysis", detail: "AI identified unilateral pulsating pain quality with duration 4-72 hours — matching ICHD-3 criteria for migraine without aura." },
      { step: 2, title: "Associated Symptom Weighting", detail: "Presence of photophobia (sensitivity = 0.87), phonophobia (sensitivity = 0.82), and nausea (sensitivity = 0.73) significantly increased migraine probability." },
      { step: 3, title: "Aura Classification", detail: "Visual aura (zigzag lines) preceding headache classified as typical migraine aura, adding diagnostic confidence." },
      { step: 4, title: "Differential Exclusion", detail: "Unilateral nature and exacerbation with activity strongly differentiate from tension-type headache, which is typically bilateral and not worsened by routine activity." },
    ],
    doctorDecision: "Confirmed migraine with aura diagnosis. Initiated triptan therapy for acute attacks and recommended lifestyle modifications. Added prophylactic beta-blocker due to frequency (>4 attacks/month).",
    aiDifferential: [
      { condition: "Migraine with Aura", confidencePct: 89 },
      { condition: "Tension-Type Headache", confidencePct: 8 },
      { condition: "Cluster Headache", confidencePct: 3 },
    ],
  },
  {
    id: "CS-002",
    title: "Diabetic Ketoacidosis — Emergency Triage",
    category: "Endocrinology / Emergency",
    difficulty: "Advanced",
    presentation: "A 22-year-old male with Type 1 Diabetes presents to the ED with severe abdominal pain, vomiting, rapid deep breathing (Kussmaul respirations), and confusion. Blood glucose reads 485 mg/dL. He reports missing insulin doses for 2 days due to illness.",
    aiReasoning: [
      { step: 1, title: "Critical Vitals Detection", detail: "AI flagged hyperglycemia (485 mg/dL), Kussmaul breathing pattern, and altered mental status as emergency indicators." },
      { step: 2, title: "Historical Context Weighting", detail: "Known T1DM + missed insulin doses for 48 hours during illness strongly suggests precipitating factor for DKA." },
      { step: 3, title: "Symptom Constellation Matching", detail: "Abdominal pain + vomiting + rapid breathing + confusion matches DKA presentation with 94% pattern match in training data." },
      { step: 4, title: "Urgency Escalation", detail: "AI auto-escalated to EMERGENCY triage level based on life-threatening metabolic decompensation risk." },
    ],
    doctorDecision: "Confirmed DKA. Initiated IV fluid resuscitation, continuous insulin infusion, and electrolyte monitoring. Admitted to ICU for close monitoring. Diabetes education team consulted for discharge planning.",
    aiDifferential: [
      { condition: "Diabetic Ketoacidosis", confidencePct: 94 },
      { condition: "Hyperosmolar Hyperglycemic State", confidencePct: 4 },
      { condition: "Sepsis-related Hyperglycemia", confidencePct: 2 },
    ],
  },
  {
    id: "CS-003",
    title: "Atypical Chest Pain — Cardiac vs. Non-Cardiac",
    category: "Cardiology",
    difficulty: "Intermediate",
    presentation: "A 45-year-old male presents with left-sided chest pain that is sharp, worsens with deep breathing and body movement, and improves when leaning forward. No radiation to the arm or jaw. Pain started 3 days ago after a viral illness. ECG shows diffuse ST elevation with PR depression.",
    aiReasoning: [
      { step: 1, title: "Pain Characterization", detail: "Sharp, pleuritic chest pain worsened by inspiration and movement — inconsistent with typical ischemic chest pain pattern." },
      { step: 2, title: "Positional Variation Analysis", detail: "Improvement with leaning forward is a hallmark feature of pericarditis (likelihood ratio = 4.2)." },
      { step: 3, title: "ECG Pattern Recognition", detail: "Diffuse ST elevation with PR depression — classic pericarditis pattern. Distinct from territorial ST elevation seen in STEMI." },
      { step: 4, title: "Clinical Context Integration", detail: "Recent viral illness preceding symptoms supports viral/post-viral pericarditis as most likely etiology." },
    ],
    doctorDecision: "Confirmed acute viral pericarditis. Prescribed high-dose NSAIDs (Ibuprofen 600mg TID) with colchicine for 3 months. Ordered echocardiogram to rule out pericardial effusion. Follow-up in 1 week.",
    aiDifferential: [
      { condition: "Acute Pericarditis", confidencePct: 88 },
      { condition: "STEMI / Acute MI", confidencePct: 7 },
      { condition: "Costochondritis", confidencePct: 5 },
    ],
  },
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "A patient presents with unilateral, pulsating headache with nausea and photophobia. Based on the AI's analysis, what is the MOST likely diagnosis?",
    options: ["Tension-Type Headache", "Migraine without Aura", "Cluster Headache", "Subarachnoid Hemorrhage"],
    correctIndex: 1,
    explanation: "The combination of unilateral pulsating pain, nausea, and photophobia meets the ICHD-3 diagnostic criteria for migraine. Tension headaches are typically bilateral and pressing. Cluster headaches involve severe periorbital pain with autonomic features.",
  },
  {
    id: 2,
    question: "The CareConnect AI assigned 'EMERGENCY' triage to a patient with blood glucose of 485 mg/dL and Kussmaul breathing. Which clinical feature MOST justified this urgency level?",
    options: ["High blood glucose alone", "Kussmaul breathing indicating metabolic acidosis", "Patient's young age", "History of Type 1 Diabetes"],
    correctIndex: 1,
    explanation: "Kussmaul breathing (deep, rapid respirations) is a compensatory mechanism for severe metabolic acidosis, indicating the body's attempt to blow off CO2. This suggests life-threatening acid-base derangement requiring emergent intervention.",
  },
  {
    id: 3,
    question: "The AI differentiated acute pericarditis from STEMI based on ECG findings. Which ECG pattern is MOST specific for pericarditis?",
    options: ["Territorial ST elevation in leads V1-V4", "Diffuse ST elevation with PR depression", "ST depression with T-wave inversion", "Pathological Q waves"],
    correctIndex: 1,
    explanation: "Diffuse (widespread, non-territorial) ST elevation with PR depression is the classic ECG signature of acute pericarditis. STEMI shows territorial ST elevation corresponding to a specific coronary artery distribution. This distinction is critical for treatment decisions.",
  },
];

export const TUTOR_RESPONSES = {
  "Why did the AI prioritize Migraine over Tension Headache here?": {
    response: "Great question! The AI used a multi-factor weighting system. Three key features drove the differential:\n\n1. **Unilateral location** — Migraines are classically one-sided, while tension headaches are bilateral. This alone shifts the probability significantly (LR+ = 3.2).\n\n2. **Pulsating quality** — The throbbing nature of the pain is characteristic of vascular-origin headaches like migraines, not the \"pressing/tightening\" quality of tension headaches.\n\n3. **Associated symptoms** — Photophobia and nausea are diagnostic multipliers. The ICHD-3 criteria require at least one of these, and having both increases confidence substantially.\n\nThe AI essentially ran a Bayesian analysis where each feature independently contributed to the posterior probability of each diagnosis."
  },
  "What evidence would change the AI's top diagnosis?": {
    response: "Excellent clinical reasoning question! Several findings would shift the differential:\n\n**Toward Tension Headache:**\n- If the pain became bilateral and pressing\n- If the intensity was mild-moderate (not severe)\n- If there was no nausea or photophobia\n- If the pain was NOT worsened by physical activity\n\n**Toward Cluster Headache:**\n- Strictly periorbital location\n- Autonomic features (lacrimation, nasal congestion)\n- Attack duration 15-180 minutes (shorter than migraine)\n- Circadian pattern (attacks at same time daily)\n\n**Red Flags requiring immediate escalation:**\n- Sudden \"thunderclap\" onset → suggests SAH\n- Focal neurological deficits → suggests stroke or mass lesion\n- Fever with stiff neck → suggests meningitis\n\nThis demonstrates how the AI continuously re-evaluates its differential as new data points emerge."
  },
  "How does the confidence percentage map to clinical decision-making?": {
    response: "This is a critical concept for understanding AI-assisted medicine!\n\nThe confidence percentage represents the AI's **posterior probability** after analyzing all available evidence:\n\n- **>85% confidence:** Strong diagnostic signal. The AI recommends proceeding with targeted workup for the top diagnosis. However, dangerous mimics should still be excluded.\n\n- **60-85% confidence:** Moderate signal. The AI recommends additional data gathering (labs, imaging) to differentiate between top 2-3 diagnoses.\n\n- **<60% confidence:** Low signal. The presentation is ambiguous. The AI recommends broad-spectrum workup and close follow-up.\n\n**Key principle:** These percentages are decision SUPPORT tools, not decision MAKERS. A 5% probability of a life-threatening condition (like ACS) demands full workup regardless of the top diagnosis's high confidence. This is why the AI always generates a full differential, not just the top answer.\n\nIn CareConnect, doctors retain full authority — the AI accelerates triage but never replaces clinical judgment."
  },
};

export const ADMIN_METRICS = {
  apiLatency: 342,
  tokenUptime: 99.98,
  requestsPerDay: 1420,
  activeUsers: 47,
  modelsDeployed: 3,
  avgResponseTime: 1.2,
};

export const ADMIN_CONFIDENCE_DISTRIBUTION = [
  { range: "0-10%", count: 2 },
  { range: "10-20%", count: 5 },
  { range: "20-30%", count: 8 },
  { range: "30-40%", count: 12 },
  { range: "40-50%", count: 18 },
  { range: "50-60%", count: 28 },
  { range: "60-70%", count: 45 },
  { range: "70-80%", count: 72 },
  { range: "80-90%", count: 98 },
  { range: "90-100%", count: 62 },
];

export const ADMIN_AUDIT_LOG = [
  { timestamp: "14:22:01", action: "AI Suggested 'Migraine'", result: "Doctor Confirmed", match: "100% Match", type: "success" },
  { timestamp: "14:18:33", action: "AI Suggested 'Acute Coronary Syndrome'", result: "Escalated to Cardiology", match: "Pending Review", type: "warning" },
  { timestamp: "14:12:05", action: "AI Triage: EMERGENCY Level", result: "Auto-routed to ED Queue", match: "Protocol Match", type: "emergency" },
  { timestamp: "13:55:42", action: "AI Suggested 'Allergic Rhinitis'", result: "Doctor Confirmed", match: "100% Match", type: "success" },
  { timestamp: "13:48:19", action: "Drug Interaction Alert: Warfarin + Aspirin", result: "Doctor Modified Rx", match: "Safety Block", type: "warning" },
  { timestamp: "13:30:11", action: "AI Suggested 'Ankylosing Spondylitis'", result: "Doctor Ordered MRI First", match: "Partial Match", type: "info" },
  { timestamp: "13:15:07", action: "System Health Check", result: "All Services Operational", match: "Uptime OK", type: "success" },
  { timestamp: "12:58:44", action: "AI Confidence Below Threshold (45%)", result: "Flagged for Senior Review", match: "Escalated", type: "warning" },
];

export const COMMON_PRESCRIPTIONS = [
  "Ibuprofen 400mg",
  "Acetaminophen 500mg",
  "Amoxicillin 500mg",
  "Warfarin 5mg",
  "Omeprazole 20mg",
  "Metformin 500mg",
  "Atorvastatin 20mg",
  "Cetirizine 10mg",
  "Prednisone 10mg",
  "Aspirin 325mg",
];
