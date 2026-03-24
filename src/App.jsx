import { useState, useEffect } from "react";
import { supabase } from "./supabase"; // 👈 우리가 만든 수파베이스 열쇠 불러오기!

import Sidebar from "./components/Sidebar";
import HomeTab from "./components/HomeTab";
import MembersTab from "./components/MembersTab";
import ManageMembersTab from "./components/ManageMembersTab";
import MinutesTab from "./components/MinutesTab";
import LogsTab from "./components/LogsTab";
import CalendarTab from "./components/CalendarTab";

export default function App() {
  const [tab, setTab] = useState("home");
  
  // 1. 초기 데이터는 빈 배열([])로 비워둬! (서버에서 가져올 거니까)
  const [members, setMembers] = useState([]);
  const [minutes, setMinutes] = useState([]);
  const [logs, setLogs] = useState([]);
  const [events, setEvents] = useState([]);

  // 2. 앱이 처음 켜질 때 수파베이스 서버에서 진짜 데이터를 싹 가져오기!
  useEffect(() => {
    async function fetchAllData() {
      // 각 엑셀 표(테이블)에서 데이터 가져와라!
      const { data: mData } = await supabase.from('members').select('*');
      const { data: minData } = await supabase.from('minutes').select('*');
      const { data: lData } = await supabase.from('logs').select('*');
      const { data: eData } = await supabase.from('events').select('*');

      // 가져온 데이터가 있으면 화면 데이터로 세팅!
      if (mData) setMembers(mData);
      if (minData) setMinutes(minData);
      if (lData) setLogs(lData);
      if (eData) setEvents(eData);
    }
    fetchAllData();
  }, []);

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
        
        {/* 조직도 형태의 부원 탭 */}
        {tab==="members" && (
          <MembersTab members={members} setMembers={setMembers} logs={logs}
            memberModal={memberModal} setMemberModal={setMemberModal} />
        )}

        {/* 표 형태의 부원 관리 탭 */}
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
