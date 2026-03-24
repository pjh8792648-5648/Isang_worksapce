import { useState } from "react";
import { seedMembers, seedMinutes, seedLogs, seedEvents } from "./constants/data";

import Sidebar from "./components/Sidebar";
import HomeTab from "./components/HomeTab";
import MembersTab from "./components/MembersTab";
import MinutesTab from "./components/MinutesTab";
import LogsTab from "./components/LogsTab";
import CalendarTab from "./components/CalendarTab";

export default function App() {
  const [tab, setTab] = useState("home");
  const [members, setMembers] = useState(seedMembers);
  const [minutes, setMinutes] = useState(seedMinutes);
  const [logs, setLogs] = useState(seedLogs);
  const [events, setEvents] = useState(seedEvents);

  const [calYear, setCalYear] = useState(2025);
  const [calMonth, setCalMonth] = useState(2);
  const [calMode, setCalMode] = useState("전체");
  const [calDept, setCalDept] = useState("기획부");
  const [calMemberId, setCalMemberId] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const [memberModal, setMemberModal] = useState(null);
  const [minuteModal, setMinuteModal] = useState(null);
  const [logModal, setLogModal] = useState(null);
  const [eventModal, setEventModal] = useState(null);
  const [minuteFilter, setMinuteFilter] = useState("전체");
  const [logFilter, setLogFilter] = useState("전체");

  return (
    <div style={{ fontFamily:"'Noto Sans KR', sans-serif", display:"flex", minHeight:"100vh", background:"#F0F4FA", color:"#1A202C" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      <Sidebar tab={tab} setTab={setTab} />

      <main style={{ marginLeft:220, flex:1, padding:"32px 32px 40px", minHeight:"100vh" }}>
        {tab==="home" && (
          <HomeTab members={members} minutes={minutes} logs={logs} events={events}
            calYear={calYear} calMonth={calMonth} setMinuteModal={setMinuteModal} setTab={setTab} />
        )}
        {tab==="members" && (
          <MembersTab members={members} setMembers={setMembers} logs={logs}
            memberModal={memberModal} setMemberModal={setMemberModal} />
        )}
        {tab==="minutes" && (
          <MinutesTab minutes={minutes} setMinutes={setMinutes}
            minuteModal={minuteModal} setMinuteModal={setMinuteModal}
            minuteFilter={minuteFilter} setMinuteFilter={setMinuteFilter} />
        )}
        {tab==="logs" && (
          <LogsTab members={members} logs={logs} setLogs={setLogs}
            logModal={logModal} setLogModal={setLogModal}
            logFilter={logFilter} setLogFilter={setLogFilter} />
        )}
        {tab==="calendar" && (
          <CalendarTab members={members} logs={logs} events={events} setEvents={setEvents}
            calYear={calYear} setCalYear={setCalYear} calMonth={calMonth} setCalMonth={setCalMonth}
            calMode={calMode} setCalMode={setCalMode} calDept={calDept} setCalDept={setCalDept}
            calMemberId={calMemberId} setCalMemberId={setCalMemberId}
            selectedDay={selectedDay} setSelectedDay={setSelectedDay}
            eventModal={eventModal} setEventModal={setEventModal} />
        )}
      </main>
    </div>
  );
}
