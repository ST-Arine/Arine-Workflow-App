import { useState, useEffect, useRef } from "react";
import { C, serif, sans } from "../theme";
import { Check, X, Circle, CheckCircle2, PhoneOff, Play, Pause, Plus, AlertCircle, ArrowLeftRight, Mic, MicOff, Dialpad, User } from "../components/icons";
import { CALL_SCRIPT, PHARMACISTS } from "../data/mock";
import { Badge, Panel, PrimaryButton, GhostButton, TextLink, Modal, IconToggle } from "../components/ui";

export function CallStep({ engagement, agenda, setAgenda, observations, setObservations, onEndCall }) {
  const script = CALL_SCRIPT[engagement.id] || [];
  const [lineIndex, setLineIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [pendingMatch, setPendingMatch] = useState(null);
  const [muted, setMuted] = useState(false);
  const [onHold, setOnHold] = useState(false);
  const [keypadOpen, setKeypadOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferState, setTransferState] = useState("idle");
  const [swapActive, setSwapActive] = useState("customer");
  const [addingObs, setAddingObs] = useState(false);
  const [obsDraft, setObsDraft] = useState("");

  function addManualObservation() {
    if (!obsDraft.trim()) return;
    setObservations((prev) => [...prev, { id: `custom-${Date.now()}`, text: obsDraft.trim(), status: "confirmed", custom: true }]);
    setObsDraft("");
    setAddingObs(false);
  }
  const scrollRef = useRef(null);
  const transferring = transferState !== "idle" && transferState !== "done";

  function callQuickConnect() {
    setTransferState("calling");
    setOnHold(true);
    setTimeout(() => setTransferState("connected"), 1400);
  }
  function joinConference() { setTransferState("conference"); setOnHold(false); }
  function leaveCall() { setTransferState("done"); setOnHold(false); }

  useEffect(() => {
    if (!autoplay || onHold) return;
    if (lineIndex >= script.length) { setAutoplay(false); return; }
    const t = setTimeout(() => advance(), 2200);
    return () => clearTimeout(t);
  }, [autoplay, lineIndex, onHold]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [lineIndex, pendingMatch]);

  function advance() {
    if (lineIndex >= script.length) return;
    const line = script[lineIndex];
    if (line.match) {
      setAgenda((prev) => {
        if (prev.some((a) => a.id === line.match)) return prev;
        const suggestion = engagement.aiAgendaSuggestions.find((s) => s.id === line.match);
        return suggestion ? [...prev, { id: suggestion.id, label: suggestion.label, source: "ai", status: "pending" }] : prev;
      });
      setPendingMatch(line.match);
    }
    if (line.confirm) setAgenda((prev) => prev.map((a) => (a.id === line.confirm ? { ...a, status: "confirmed" } : a)));
    if (line.observation) setObservations((prev) => [...prev, { id: `o${prev.length}-${Date.now()}`, text: line.observation, status: "suggested", blockedFax: line.blockedFax || null }]);
    setLineIndex((i) => i + 1);
  }
  function resolveMatch(decision) {
    if (decision === "confirm") setAgenda((prev) => prev.map((a) => (a.id === pendingMatch ? { ...a, status: "confirmed" } : a)));
    setPendingMatch(null);
  }
  function resolveObservation(id, decision) {
    setObservations((prev) => decision === "discard" ? prev.filter((o) => o.id !== id) : prev.map((o) => (o.id === id ? { ...o, status: "confirmed" } : o)));
  }
  const noScript = script.length === 0;

  return (
    <div className="rise-in">
      <p style={{ ...sans, color: C.inkMuted }} className="text-sm mb-3">Live now 🎙️</p>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-4">
          <Panel>
            <div style={{ ...sans, color: C.inkMuted }} className="text-xs font-medium mb-3 uppercase tracking-wide">Agenda</div>
            <ul className="flex flex-col gap-2">
              {agenda.map((a) => (
                <li key={a.id} className="flex items-start gap-2">
                  {a.status === "confirmed" ? <span key={a.id + "-c"} className="pop-in" style={{ display: "inline-flex" }}><CheckCircle2 size={15} color={C.green} /></span> : <Circle size={15} color={C.border} />}
                  <span style={{ ...sans, color: a.status === "confirmed" ? C.ink : C.inkMuted, transition: "color 0.4s ease" }} className="text-sm">{a.label}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel>
            <div style={{ ...sans, color: C.inkMuted }} className="text-xs font-medium mb-3 uppercase tracking-wide">New observations</div>
            {observations.length === 0 && !addingObs && <p style={{ ...sans, color: C.inkMuted }} className="text-sm">None yet.</p>}
            <ul className="flex flex-col gap-2 mb-2">
              {observations.map((o) => (
                <li key={o.id} style={{ background: o.status === "suggested" ? C.amberSoft : C.greenSoft }} className="p-2 rounded-sm">
                  <p style={{ ...sans, color: C.ink }} className="text-sm mb-1.5">{o.text}</p>
                  {o.status === "suggested" ? (
                    <div className="flex gap-2">
                      <button onClick={() => resolveObservation(o.id, "confirm")} style={{ ...sans, color: C.green }} className="text-xs font-medium py-1.5 -my-1.5">Keep</button>
                      <button onClick={() => resolveObservation(o.id, "discard")} style={{ ...sans, color: C.inkMuted }} className="text-xs font-medium py-1.5 -my-1.5">Discard</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Badge tone="green">Confirmed</Badge>
                      {o.custom && <Badge tone="primary"><User size={11} /> Added by you</Badge>}
                    </div>
                  )}
                </li>
              ))}
            </ul>
            {addingObs ? (
              <div className="fade-in flex flex-col gap-2">
                <textarea
                  autoFocus value={obsDraft} onChange={(e) => setObsDraft(e.target.value)} placeholder="What did you notice?"
                  style={{ ...sans, borderColor: C.border, color: "#FFFFFF" }} className="w-full text-sm p-2 border rounded-sm" rows={2}
                />
                <div className="flex items-center gap-2">
                  <GhostButton onClick={addManualObservation}><Check size={13} color={C.green} /> Add</GhostButton>
                  <GhostButton onClick={() => { setAddingObs(false); setObsDraft(""); }}>Cancel</GhostButton>
                </div>
              </div>
            ) : (
              <GhostButton onClick={() => setAddingObs(true)}><Plus size={13} /> Add observation</GhostButton>
            )}
          </Panel>
          {transferState !== "idle" && (
            <Panel>
              <div style={{ ...sans, color: C.inkMuted }} className="text-xs font-medium mb-2 uppercase tracking-wide">Transfer status</div>
              {transferState === "calling" && <p style={{ ...sans, color: C.inkMuted }} className="text-sm">Calling Dr. Alvarez…</p>}
              {(transferState === "connected" || transferState === "conference") && (
                <p style={{ ...sans, color: C.ink }} className="text-sm">{transferState === "conference" ? "In conference with Dr. Alvarez" : "Connected to Dr. Alvarez"}</p>
              )}
              {transferState === "done" && <p style={{ ...sans, color: C.green }} className="text-sm font-medium flex items-center gap-1.5"><CheckCircle2 size={13} /> Transferred to Dr. Alvarez</p>}
              {transferState !== "done" && <TextLink onClick={() => setTransferModalOpen(true)}>Open transfer panel</TextLink>}
            </Panel>
          )}
        </div>
        <div className="flex-1">
          <Panel elevated style={{ height: 380, display: "flex", flexDirection: "column" }}>
            <div className="flex items-center flex-wrap gap-2 mb-3 pb-3" style={{ borderBottom: `1px solid ${C.border}` }}>
              <IconToggle active={muted} onClick={() => setMuted((m) => !m)} icon={muted ? MicOff : Mic} label={muted ? "Unmute" : "Mute"} />
              <IconToggle active={onHold} onClick={() => setOnHold((h) => !h)} icon={Pause} label={onHold ? "Resume" : "Put on Hold"} disabled={transferring} />
              <IconToggle active={keypadOpen} onClick={() => setKeypadOpen((k) => !k)} icon={Dialpad} label="Keypad" />
              <IconToggle active={transferModalOpen || transferring} onClick={() => setTransferModalOpen(true)} icon={ArrowLeftRight} label="Transfer" />
              {onHold && (
                <span style={{ ...sans, color: C.amber }} className="fade-in text-xs font-semibold ml-auto flex items-center gap-1.5">
                  <span style={{ background: C.amber, width: 6, height: 6, borderRadius: "50%", display: "inline-block", animation: "softPulse 1.8s ease-in-out infinite" }} />
                  On hold
                </span>
              )}
            </div>
            {keypadOpen && (
              <div className="grid grid-cols-3 gap-1.5 mb-3 fade-in" style={{ maxWidth: 160 }}>
                {["1","2","3","4","5","6","7","8","9","*","0","#"].map((k) => (
                  <button key={k} style={{ ...sans, color: C.ink, borderColor: C.border }} className="border rounded-sm py-1.5 text-sm hover:bg-white/5 transition-colors">{k}</button>
                ))}
              </div>
            )}
            <div ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1" style={{ opacity: onHold ? 0.45 : 1, transition: "opacity 0.3s ease" }}>
              {noScript && <p style={{ ...sans, color: C.inkMuted }} className="text-sm">No scripted transcript for this engagement in the demo — try Maria Chen from the start.</p>}
              {script.slice(0, lineIndex).map((l, i) => (
                <div key={i}>
                  <span style={{ ...sans, color: C.inkMuted }} className="text-xs font-medium">{l.speaker}</span>
                  <p style={{ ...sans, color: C.ink }} className="text-sm">{l.text}</p>
                </div>
              ))}
              {pendingMatch && (
                <div style={{ background: C.amberSoft }} className="p-3 rounded-sm flex items-center gap-2">
                  <AlertCircle size={15} color={C.amber} />
                  <span style={{ ...sans, color: C.ink }} className="text-sm flex-1">This sounds like it covers an agenda item. Mark it?</span>
                  <button onClick={() => resolveMatch("confirm")} className="p-2 -m-2"><Check size={16} color={C.green} /></button>
                  <button onClick={() => resolveMatch("dismiss")} className="p-2 -m-2"><X size={16} color={C.inkMuted} /></button>
                </div>
              )}
            </div>
            <div style={{ borderColor: C.border }} className="border-t pt-3 mt-3 flex items-center gap-2">
              <GhostButton onClick={advance} disabled={onHold}>{lineIndex >= script.length ? "End of transcript" : "Next moment"}</GhostButton>
              <GhostButton onClick={() => setAutoplay((a) => !a)} disabled={onHold}>{autoplay ? <Pause size={13} /> : <Play size={13} />} {autoplay ? "Pause" : "Play"}</GhostButton>
              <div className="flex-1" />
              <PrimaryButton onClick={onEndCall} icon={PhoneOff}>Wrap up call</PrimaryButton>
            </div>
          </Panel>
        </div>
      </div>
      {transferModalOpen && (
        <Modal onClose={() => setTransferModalOpen(false)}>
          <h3 style={{ ...serif, color: C.ink }} className="text-lg mb-1">Transfer call</h3>

          {transferState === "idle" && (
            <>
              <p style={{ ...sans, color: C.inkMuted }} className="text-sm mb-4">Who's available to take this?</p>
              <div className="flex flex-col gap-2">
                {PHARMACISTS.map((p) => (
                  <div key={p.name} style={{ borderColor: C.border }} className="flex items-center justify-between border rounded-xl p-3">
                    <div>
                      <div style={{ ...sans, color: C.ink }} className="text-sm font-semibold">{p.name}</div>
                      <Badge tone={p.status === "available" ? "green" : "muted"}>{p.status === "available" ? "Available" : `Busy · ${p.wait}`}</Badge>
                    </div>
                    <PrimaryButton disabled={p.status !== "available"} onClick={callQuickConnect}>Transfer</PrimaryButton>
                  </div>
                ))}
              </div>
            </>
          )}

          {transferState === "calling" && (
            <p style={{ ...sans, color: C.inkMuted }} className="text-sm fade-in">Calling Dr. Alvarez… customer is on hold.</p>
          )}

          {(transferState === "connected" || transferState === "conference") && (
            <div className="flex flex-col gap-3">
              <div style={{ borderColor: C.border }} className="flex items-center justify-between border rounded-xl p-3">
                <span style={{ ...sans, color: C.ink }} className="text-sm">{engagement.name}</span>
                <Badge tone={transferState === "conference" ? "green" : (swapActive === "customer" ? "green" : "muted")}>
                  {transferState === "conference" ? "In conference" : swapActive === "customer" ? "Speaking" : "On hold"}
                </Badge>
              </div>
              <div style={{ borderColor: C.border }} className="flex items-center justify-between border rounded-xl p-3">
                <span style={{ ...sans, color: C.ink }} className="text-sm">Dr. Alvarez</span>
                <Badge tone={transferState === "conference" ? "green" : (swapActive === "other" ? "green" : "muted")}>
                  {transferState === "conference" ? "In conference" : swapActive === "other" ? "Speaking" : "On hold"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1">
                {transferState === "connected" && (
                  <GhostButton onClick={() => setSwapActive((s) => (s === "customer" ? "other" : "customer"))}>Swap</GhostButton>
                )}
                <GhostButton tone="danger" onClick={leaveCall}>Leave</GhostButton>
                {transferState === "connected" && <PrimaryButton onClick={joinConference}>Join</PrimaryButton>}
              </div>
            </div>
          )}

          {transferState === "done" && (
            <div>
              <p style={{ ...sans, color: C.green }} className="text-sm font-medium flex items-center gap-1.5 mb-4"><CheckCircle2 size={14} /> Transferred to Dr. Alvarez</p>
              <div className="flex justify-end"><PrimaryButton onClick={() => setTransferModalOpen(false)}>Close</PrimaryButton></div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
