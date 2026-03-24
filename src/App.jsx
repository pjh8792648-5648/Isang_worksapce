import { useState, useEffect } from "react";
import { seedMembers, seedMinutes, seedLogs, seedEvents } from "./constants/data";

import Sidebar from "./components/Sidebar";
import HomeTab from "./components/HomeTab";
import MembersTab from "./components/MembersTab";
import ManageMembersTab from "./components/ManageMembersTab";
import MinutesTab from "./components/MinutesTab";
import LogsTab from "./components/LogsTab";
import CalendarTab from "./components/CalendarTab";

// 새로고침해도 데이터를 유지하기 위해 로컬 스토리지에서 불러오는 함수
function getInitialData(key, fallbackData) {
  const saved = localStorage.getItem(key);
  if (saved) {
    return JSON.parse(saved); // 저장된 게 있으면 불러오기
  }
  return fallbackData; // 없으면 처음 기본 데이터 쓰기
}

export default function App() {
  const [tab, setTab] = useState("home");
  
  // 상태 관리 (로컬 스토리지 연동)
  const [members, setMembers] = useState(() => getInitialData("app_members", seedMembers));
  const [minutes, setMinutes] = useState(() => getInitialData("app_minutes", seedMinutes));
  const [logs, setLogs] = useState(() => getInitialData("app_logs", seedLogs));
  const [events, setEvents] = useState(() => getInitialData("app_events", seedEvents));

  // 데이터가 변경될 때마다 로컬 스토리지에 자동 저장
  useEffect(() => { localStorage.setItem("app_members", JSON.stringify(members)); }, [members]);
  useEffect(() => { localStorage.setItem("app_minutes", JSON.stringify(minutes)); }, [minutes]);
  useEffect(() => { localStorage.setItem("app_logs", JSON.stringify(logs)); }, [logs]);
  useEffect(() => { localStorage.setItem("app_events", JSON.stringify(events)); }, [events]);

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

      {/* 좌측 사이드바 */}
      <Sidebar tab={tab} setTab={setTab} />

      {/* 메인 콘텐츠 */}
      <main style={{ marginLeft:220, flex:1, padding:"32px 32px 40px", minHeight:"100vh" }}>
        {tab==="home" && (
          <HomeTab members={members} minutes={minutes} logs={logs} events={events}
            calYear={calYear} calMonth={calMonth} setMinuteModal={setMinuteModal} setTab={setTab} />
        )}
        
        {/* 기존 조직도 형태의 부원 탭 */}
        {tab==="members" && (
          <MembersTab members={members} setMembers={setMembers} logs={logs}
            memberModal={memberModal} setMemberModal={setMemberModal} />
        )}

        {/* 새롭게 추가된 표 형태의 부원 관리 탭 */}
        {tab==="manage_members" && (
          <ManageMembersTab members={members} setMembers={setMembers} />
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
