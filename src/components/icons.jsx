// ---------- tiny inline icon set ----------
export const Icon = ({ path, size = 15, color = "currentColor", fill = "none", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">{path}</svg>
);
export const Check = (p) => <Icon {...p} path={<polyline points="20 6 9 17 4 12" />} />;
export const X = (p) => <Icon {...p} path={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>} />;
export const Circle = (p) => <Icon {...p} path={<circle cx="12" cy="12" r="9" />} fill={p.filled ? (p.color || "currentColor") : "none"} />;
export const CheckCircle2 = (p) => <Icon {...p} path={<><circle cx="12" cy="12" r="9"/><polyline points="8.5 12 11 14.5 16 9"/></>} />;
export const Phone = (p) => <Icon {...p} path={<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>} />;
export const PhoneOff = (p) => <Icon {...p} path={<><path d="M5 4h4l1.5 3.8M15 13l1 .4V17a2 2 0 0 1-2 2A16 16 0 0 1 4 8"/><line x1="3" y1="3" x2="21" y2="21"/></>} />;
export const Coffee = (p) => <Icon {...p} path={<><path d="M4 9h13a1 1 0 0 1 1 1 5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V9z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17"/><line x1="7" y1="2" x2="7" y2="4"/><line x1="11" y1="2" x2="11" y2="4"/></>} />;
export const Play = (p) => <Icon {...p} path={<polygon points="6 3 20 12 6 21 6 3" />} fill="currentColor" />;
export const Pause = (p) => <Icon {...p} path={<><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>} fill="currentColor" />;
export const Pencil = (p) => <Icon {...p} path={<path d="M12 20h9M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z"/>} />;
export const Trash = (p) => <Icon {...p} path={<><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></>} />;
export const Plus = (p) => <Icon {...p} path={<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>} />;
export const Send = (p) => <Icon {...p} path={<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>} />;
export const ChevronRight = (p) => <Icon {...p} path={<polyline points="9 18 15 12 9 6" />} />;
export const AlertCircle = (p) => <Icon {...p} path={<><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16" x2="12" y2="16.01"/></>} />;
export const ArrowLeftRight = (p) => <Icon {...p} path={<><polyline points="17 2 21 6 17 10"/><line x1="21" y1="6" x2="3" y2="6"/><polyline points="7 22 3 18 7 14"/><line x1="3" y1="18" x2="21" y2="18"/></>} />;
export const Mic = (p) => <Icon {...p} path={<><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></>} />;
export const MicOff = (p) => <Icon {...p} path={<><line x1="2" y1="2" x2="22" y2="22"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M19 10v2a7 7 0 0 1-9.9 6.36M5 10v2a7 7 0 0 0 .34 2.17"/><path d="M12 19v4M8 23h8"/></>} />;
export const Dialpad = (p) => <Icon {...p} path={<><circle cx="7" cy="5" r="1.6"/><circle cx="17" cy="5" r="1.6"/><circle cx="7" cy="12" r="1.6"/><circle cx="17" cy="12" r="1.6"/><circle cx="7" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/></>} fill="currentColor" />;
export const RotateCcw = (p) => <Icon {...p} path={<><polyline points="1 4 1 10 7 10"/><path d="M3.5 15a9 9 0 1 0 2-10L1 10"/></>} />;
export const Sparkle = (p) => <Icon {...p} path={<path d="M12 3v4M12 17v4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M3 12h4M17 12h4M4.2 19.8l2.8-2.8M17 7l2.8-2.8" />} />;
export const User = (p) => <Icon {...p} path={<><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a8 8 0 0 1 16 0v1"/></>} />;
export const Flame = (p) => <Icon {...p} path={<path d="M12 2c1 3-3 4-3 8a3 3 0 0 0 6 0c0-1-.5-2-1-2.5.8 1 1.5 2 1.5 3.5a4.5 4.5 0 0 1-9 0C6.5 7 10 6 12 2z" />} fill={p.fill || "currentColor"} />;
export const ChevronDown = (p) => <Icon {...p} path={<polyline points="6 9 12 15 18 9" />} />;
export const Building = (p) => <Icon {...p} path={<><rect x="4" y="4" width="16" height="17" rx="1"/><line x1="8" y1="8" x2="8" y2="8"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="16" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="8" y2="12"/><line x1="12" y1="12" x2="12" y2="12"/><line x1="16" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="12" y1="16" x2="12" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></>} />;
export const Settings = (p) => <Icon {...p} path={<><line x1="4" y1="6" x2="20" y2="6"/><circle cx="9" cy="6" r="1.6"/><line x1="4" y1="12" x2="20" y2="12"/><circle cx="15" cy="12" r="1.6"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="7" cy="18" r="1.6"/></>} />;
export const LogOut = (p) => <Icon {...p} path={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>} />;
export const Menu = (p) => <Icon {...p} path={<><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>} />;
export const BarChart = (p) => <Icon {...p} path={<><line x1="4" y1="20" x2="4" y2="11"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="20" y1="20" x2="20" y2="15"/></>} />;
export const Users = (p) => <Icon {...p} path={<><circle cx="9" cy="8" r="3.2"/><path d="M3.5 20c0-3.3 2.5-6 5.5-6s5.5 2.7 5.5 6"/><circle cx="18" cy="9" r="2.4"/><path d="M15.5 20c0-2.5 1.2-4.5 3-5.3"/></>} />;
export const Plug = (p) => <Icon {...p} path={<><path d="M9 2v6M15 2v6M7 8h10l-1 6a4 4 0 0 1-4 4h0a4 4 0 0 1-4-4z"/><line x1="12" y1="18" x2="12" y2="22"/></>} />;
export const Sliders = (p) => <Icon {...p} path={<><line x1="6" y1="4" x2="6" y2="20"/><circle cx="6" cy="9" r="1.6"/><line x1="12" y1="4" x2="12" y2="20"/><circle cx="12" cy="15" r="1.6"/><line x1="18" y1="4" x2="18" y2="20"/><circle cx="18" cy="7" r="1.6"/></>} />;
export const Route = (p) => <Icon {...p} path={<><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></>} />;
