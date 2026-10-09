import { useState } from "react";
import { ACCOUNTS, QUEUE, USERS, FOLLOWUP_RULES } from "./data/mock";
import { TopBar } from "./components/TopBar";
import { RecapTrail } from "./components/RecapTrail";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { BreakScreen } from "./screens/BreakScreen";
import { LoaderScreen } from "./screens/LoaderScreen";
import { FoundScreen } from "./screens/FoundScreen";
import { PrepStep } from "./screens/PrepStep";
import { CallStep } from "./screens/CallStep";
import { ReviewStep } from "./screens/ReviewStep";
import { FaxStep } from "./screens/FaxStep";
import { ManagerShell } from "./screens/Admin";
import { AppShell } from "./components/SideNav";
import { Route } from "./components/icons";

const CALLER_NAV = [{ id: "workflow", label: "Engagements", icon: Route }];

export default function WorkflowAssistant() {
  const [role, setRole] = useState("caller"); // caller | manager
  const [status, setStatus] = useState("available");
  const [account, setAccount] = useState(ACCOUNTS[0]);
  const [phase, setPhase] = useState("welcome"); // welcome | break | loading | found | prep | call | review | fax
  const [candidateIdx, setCandidateIdx] = useState(0);
  const [engagement, setEngagement] = useState(null);
  const [agenda, setAgenda] = useState([]);
  const [observations, setObservations] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [recap, setRecap] = useState([]);
  const [userId, setUserId] = useState(USERS[0].id);
  const user = USERS.find((u) => u.id === userId);
  const otherUser = USERS.find((u) => u.id !== userId);
  const queue = user.queue.map((id) => QUEUE.find((e) => e.id === id));

  // Demo helper: swap to the other caller, whose queue holds a different kind of engagement. Starts them fresh.
  function switchUser() {
    setUserId(otherUser.id);
    setStatus("available");
    setPhase("welcome");
    setCandidateIdx(0);
    setEngagement(null); setAgenda([]); setObservations([]); setFollowUps([]); setRecap([]); setCompletedCount(0);
  }

  function startSearch() {
    setRecap([]);
    setCandidateIdx(0);
    setPhase("loading");
    setTimeout(() => { setEngagement(queue[0]); setPhase("found"); }, 2200);
  }
  function showAnother() {
    const next = (candidateIdx + 1) % queue.length;
    setCandidateIdx(next);
    setEngagement(queue[next]);
  }
  function goPrep() {
    setAgenda(engagement.tasks.map((t) => ({ id: t.id, label: t.label, status: "pending", source: "task", patientId: t.patientId })));
    setRecap((r) => [...r, `Found ${engagement.name} — ${engagement.priority.toLowerCase()} priority, ${engagement.reason.toLowerCase()}`]);
    setPhase("prep");
  }
  function startCall() {
    setObservations([]);
    setRecap((r) => [...r, `Prepped — ${agenda.length} agenda item${agenda.length === 1 ? "" : "s"} ready`]);
    setStatus("on_call");
    setPhase("call");
  }
  function endCall() {
    const confirmedIds = new Set(agenda.filter((a) => a.status === "confirmed").map((a) => a.id));
    const generated = [];
    agenda.forEach((a) => { if (confirmedIds.has(a.id) && FOLLOWUP_RULES[a.id]) { const r = FOLLOWUP_RULES[a.id]; generated.push({ id: `f-${a.id}`, type: r.type, label: r.label, recipient: r.recipient, status: "pending", patientId: a.patientId }); } });
    observations.forEach((o) => {
      if (o.blockedFax) {
        generated.push({
          id: `f-${o.id}`, type: "fax", label: o.blockedFax.label, recipient: o.blockedFax.entityName,
          status: "blocked", patientId: o.patientId,
          precondition: { component: "add_care_team_member", data: { entityName: o.blockedFax.entityName, role: o.blockedFax.role } },
        });
      } else {
        generated.push({ id: `f-${o.id}`, type: "data-entry", label: `Update record: ${o.text}`, status: "pending", patientId: o.patientId, needsPatientCheck: o.needsPatientCheck });
      }
    });
    setFollowUps(generated);
    setRecap((r) => [...r, `Call complete — ${confirmedIds.size} agenda item${confirmedIds.size === 1 ? "" : "s"} confirmed, ${observations.length} new note${observations.length === 1 ? "" : "s"}`]);
    setStatus("available");
    setPhase("review");
  }
  function proceedToFax() {
    const approved = followUps.filter((f) => f.status === "approved").length;
    setRecap((r) => [...r, `Reviewed — ${approved} follow-up${approved === 1 ? "" : "s"} approved`]);
    setPhase("fax");
  }
  function finishEngagement() {
    setCompletedCount((c) => c + 1);
    setEngagement(null); setAgenda([]); setObservations([]); setFollowUps([]); setRecap([]);
    setPhase("welcome");
  }
  function goOnBreak() {
    setStatus("break");
    setPhase("break");
  }
  function backFromBreak() {
    setStatus("available");
    setPhase("welcome");
  }

  const wide = phase === "call" || phase === "prep";
  const toggleRole = () => setRole((r) => (r === "caller" ? "manager" : "caller"));

  // The engagement journey is shared: the caller's main view, and an "Engagements" page in the manager nav
  const journey = (
    <div className={`relative mx-auto px-4 sm:px-8 pb-10 ${wide ? "max-w-5xl" : "max-w-xl"}`} style={{ paddingTop: 24 }}>
      <RecapTrail items={recap} />

      {phase === "welcome" && <WelcomeScreen completedCount={completedCount} onFind={startSearch} onBreak={goOnBreak} />}
      {phase === "break" && <BreakScreen onReturn={backFromBreak} />}
      {phase === "loading" && <LoaderScreen />}
      {phase === "found" && engagement && <FoundScreen engagement={engagement} onPrep={goPrep} onShowAnother={showAnother} />}
      {phase === "prep" && engagement && <PrepStep engagement={engagement} agenda={agenda} setAgenda={setAgenda} onBack={() => setPhase("found")} onStartCall={startCall} />}
      {phase === "call" && engagement && <CallStep engagement={engagement} agenda={agenda} setAgenda={setAgenda} observations={observations} setObservations={setObservations} onEndCall={endCall} />}
      {phase === "review" && <ReviewStep engagement={engagement} agenda={agenda} followUps={followUps} setFollowUps={setFollowUps} onBack={() => setPhase("call")} onProceed={proceedToFax} />}
      {phase === "fax" && <FaxStep engagement={engagement} followUps={followUps} setFollowUps={setFollowUps} onFinish={finishEngagement} />}
    </div>
  );

  if (role === "manager") {
    return <ManagerShell onToggleRole={toggleRole} engagements={journey} />;
  }

  const background = (
    <>
      <div className="blob" style={{ position: "absolute", top: "-10%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "#FF5DA2", opacity: 0.35, filter: "blur(90px)", animation: "drift1 18s ease-in-out infinite" }} />
      <div className="blob" style={{ position: "absolute", top: "30%", left: "-15%", width: 460, height: 460, borderRadius: "50%", background: "#8B7CF6", opacity: 0.3, filter: "blur(90px)", animation: "drift2 22s ease-in-out infinite" }} />
      <div className="blob" style={{ position: "absolute", bottom: "-15%", right: "10%", width: 420, height: 420, borderRadius: "50%", background: "#36E2C8", opacity: 0.25, filter: "blur(90px)", animation: "drift3 20s ease-in-out infinite" }} />
    </>
  );

  return (
    <AppShell
      navItems={CALLER_NAV} activeId="workflow" onSelect={() => {}} background={background}
      profileProps={{ name: user.name, status, onGoBreak: goOnBreak, onBackFromBreak: backFromBreak, role, onToggleRole: toggleRole, onSwitchUser: switchUser, otherUserName: otherUser.name }}
    >
      <TopBar userName={user.first} completedCount={completedCount} account={account} setAccount={setAccount} />
      {journey}
    </AppShell>
  );
}
