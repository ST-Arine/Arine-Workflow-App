import { ArrowLeftRight, Settings, BarChart, Users, Plug, Sliders, Route } from "../components/icons";

// ---------- mock data ----------
export const ACCOUNTS = ["Mercy Health Network", "Riverside Health Partners", "Sunrise Medical Group"];
export const QUEUE = [
  {
    id: "e1", kind: "patient", name: "Maria Chen", priority: "High", reason: "Refill due in 2 days",
    dob: "Apr 12, 1958", mrn: "MRN-88213", phone: "(555) 019-2231", insurance: "Meridian Health PPO",
    allergies: "No known allergies",
    medications: [
      { name: "Metformin", dose: "500mg", freq: "Twice daily" },
      { name: "Lisinopril", dose: "10mg", freq: "Once daily" },
    ],
    history: [
      "Last contact 14 days ago — refill reminder sent, unconfirmed",
      "Consistently fills on time over the past 6 months",
    ],
    pastNotes: [
      { date: "Sep 18", note: "Refill reminder call — no answer, left voicemail." },
      { date: "Aug 30", note: "Confirmed delivery address, no changes." },
    ],
    tasks: [
      { id: "a1", label: "Metformin refill needed in two days" },
      { id: "a2", label: "Remind about annual wellness visit" },
      { id: "a3", label: "Ask about missed dose last week" },
    ],
    aiAgendaSuggestions: [],
    careTeam: ["Dr. Lee (Provider)", "MedFast Pharmacy (preferred)"],
  },
  {
    id: "e2", kind: "pharmacy", name: "Riverside Drug", priority: "Medium", reason: "3 patient tasks bundled on one line",
    phone: "(555) 402-7710", insurance: null, allergies: null, medications: null,
    history: ["Preferred contact window: 1–4pm", "Last call handled by Dana R., 3 days ago"],
    pastNotes: [{ date: "Sep 29", note: "Pharmacist asked us to batch insurance questions going forward." }],
    tasks: [
      { id: "b1", label: "Clarify dosage — J. Alvarez" },
      { id: "b2", label: "Confirm delivery address — T. Nguyen" },
      { id: "b3", label: "Insurance override — K. Patel" },
    ],
    aiAgendaSuggestions: [],
  },
  {
    id: "e3", kind: "patient", name: "Omar Siddiqui", priority: "Medium", reason: "Flagged by provider note",
    dob: "Nov 2, 1990", mrn: "MRN-55042", phone: "(555) 771-9034", insurance: "Coastal Direct",
    allergies: "Penicillin (rash)",
    medications: [{ name: "Amoxicillin", dose: "500mg", freq: "3x daily" }],
    history: ["New prescription started 6 days ago", "Provider note: watch for GI side effects"],
    pastNotes: [{ date: "Sep 28", note: "Provider flagged to monitor GI symptoms after new prescription." }],
    tasks: [{ id: "c1", label: "Follow up on new prescription side effects" }],
    aiAgendaSuggestions: [],
  },
  {
    // Provider call: one conversation covers several patients, so tasks, observations and follow-ups each belong to a patient.
    id: "e4", kind: "provider", name: "Dr. Lee", practice: "Northside Family Clinic", priority: "High", reason: "3 patients with open questions for the provider",
    phone: "(555) 330-4182", insurance: null, allergies: null, medications: null,
    patients: [
      { id: "p1", name: "Maria Chen", dob: "Apr 12, 1958", mrn: "MRN-88213" },
      { id: "p2", name: "Omar Siddiqui", dob: "Nov 2, 1990", mrn: "MRN-55042" },
      { id: "p3", name: "Helen Park", dob: "Jun 3, 1949", mrn: "MRN-67190" },
    ],
    history: ["Prefers fax for prescription changes", "Last call handled by Dana R., 9 days ago"],
    pastNotes: [{ date: "Sep 24", note: "Asked us to send questions grouped by patient." }],
    tasks: [
      { id: "d1", patientId: "p1", label: "Confirm no Metformin adjustment after a missed dose" },
      { id: "d2", patientId: "p2", label: "Amoxicillin side effects — continue or switch?" },
      { id: "d3", patientId: "p3", label: "Request renewed Lisinopril prescription" },
    ],
    aiAgendaSuggestions: [],
  },
];

// Demo users: each caller has their own queue. Jordan's is the provider call so it's quick to reach.
export const USERS = [
  { id: "dana", name: "Dana R.", first: "Dana", queue: ["e1", "e2", "e3"] },
  { id: "jordan", name: "Jordan K.", first: "Jordan", queue: ["e4"] },
];

export const CALL_SCRIPT = {
  e1: [
    { speaker: "Dana", text: "Hi Maria, this is Dana calling from HealthLine Pharmacy Services." },
    { speaker: "Maria", text: "Oh hi, yes — I've been expecting a call about my Metformin.", match: "a1" },
    { speaker: "Dana", text: "Great. Your refill looks due — want me to go ahead and process it?" },
    { speaker: "Maria", text: "Yes please, that would be great.", confirm: "a1" },
    { speaker: "Maria", text: "Actually, I did miss a dose last Thursday — forgot after a trip.", match: "a3" },
    { speaker: "Dana", text: "Good to know, I'll note that. Also, you're due for your annual wellness visit.", match: "a2" },
    { speaker: "Maria", text: "Oh, I forgot about that. Can you send me some times?", confirm: "a2", observation: "Patient asked for available wellness-visit times to be sent." },
    { speaker: "Maria", text: "One more thing — my address changed, we moved last month.", observation: "Patient reports a new mailing address — needs update on file." },
    { speaker: "Maria", text: "Actually, can you send my next refill to Riverside Pharmacy instead? It's closer to my new place.",
      observation: "Patient requests prescription pickup transferred to Riverside Pharmacy.",
      blockedFax: { entityName: "Riverside Pharmacy", role: "pharmacy", label: "Fax Riverside Pharmacy: transfer Maria's Metformin prescription for pickup" } },
  ],
};

CALL_SCRIPT.e4 = [
  { speaker: "Dana", text: "Hi Dr. Lee, this is Dana from HealthLine Pharmacy Services — I have a few patient questions for you today." },
  { speaker: "Dr. Lee", text: "Sure, go ahead." },
  { speaker: "Dana", text: "First, Maria Chen missed a Metformin dose last week. Does her dose need any adjustment?", match: "d1" },
  { speaker: "Dr. Lee", text: "No adjustment — have her continue as prescribed.", confirm: "d1" },
  { speaker: "Dana", text: "Next, Omar Siddiqui is reporting stomach upset on the Amoxicillin.", match: "d2" },
  { speaker: "Dr. Lee", text: "Let's switch him to Azithromycin — with his penicillin allergy I'd rather not push through.", confirm: "d2",
    observation: "Provider is switching from Amoxicillin to Azithromycin 250mg.", patientId: "p2" },
  { speaker: "Dana", text: "And Helen Park is due for a renewed Lisinopril prescription.", match: "d3" },
  { speaker: "Dr. Lee", text: "I'll send that over today.", confirm: "d3" },
  { speaker: "Dr. Lee", text: "Oh, and one of them mentioned a new sulfa allergy — please get that on file.",
    observation: "New sulfa allergy reported — needs to be added to the record.", patientId: "p2", needsPatientCheck: true },
  { speaker: "Dr. Lee", text: "Also, please fax me Maria's latest A1c results when you have them.",
    observation: "Provider asked for the latest A1c results to be faxed to the clinic.", patientId: "p1" },
];

export const FOLLOWUP_RULES = {
  a1: { type: "data-entry", label: "Process Metformin refill in system" },
  a2: { type: "new-task", label: "Schedule annual wellness visit — send Maria available times" },
  a3: { type: "fax", label: "Fax Dr. Lee: patient missed one dose last week — confirm no adjustment needed", recipient: "Dr. Lee (Provider)" },
  // Provider call: labels avoid patient names because the follow-up is filed under a patient (and can be moved to another)
  d1: { type: "data-entry", label: "Document: provider confirms no Metformin dose adjustment needed" },
  d2: { type: "fax", label: "Fax MedFast Pharmacy: prescription changed from Amoxicillin to Azithromycin 250mg (per Dr. Lee)", recipient: "MedFast Pharmacy" },
  d3: { type: "new-task", label: "Follow up on renewed Lisinopril prescription from Dr. Lee" },
};

export const PHARMACISTS = [{ name: "Dr. Alvarez", status: "available", wait: null }, { name: "Dr. Kim", status: "busy", wait: "~6 min" }];

// ---------- manager admin mock data ----------
export const NAV_ITEMS = [
  { id: "engagements", label: "Engagements", icon: Route },
  { id: "overview", label: "Overview", icon: BarChart },
  { id: "agents", label: "Agents", icon: Users },
  { id: "priority", label: "Engagement Priority", icon: Sliders },
  { id: "quickconnects", label: "Quick connects", icon: ArrowLeftRight },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "settings", label: "Settings", icon: Settings },
];
export const MOCK_AGENTS = [
  { name: "Dana R.", status: "available", callsToday: 14 },
  { name: "Marcus T.", status: "on_call", callsToday: 11 },
  { name: "Priya N.", status: "break", callsToday: 9 },
  { name: "Jordan K.", status: "available", callsToday: 16 },
];
export const PRIORITY_RULES = [
  { label: "Refill due within 3 days", weight: "+40" },
  { label: "Flagged by provider note", weight: "+35" },
  { label: "Pharmacy call bundles 2+ tasks", weight: "+20" },
  { label: "No contact in 14+ days", weight: "+15" },
];
export const INTEGRATIONS = [
  { name: "AWS Connect", desc: "Click-to-call, agent status, warm transfer", status: "connected" },
  { name: "Fax provider", desc: "Sends provider and pharmacy recommendations", status: "connected" },
  { name: "EHR", desc: "Patient history, medications, care team", status: "not_connected" },
];

export const LOADER_LINES = ["Scanning the queue 🔍", "Matching urgency + vibe 🎯", "Found someone great 🎉"];
