import { useState, useEffect } from "react";
import { supabase } from "./supabase"; 
import Sidebar from "./components/Sidebar";
import HomeTab from "./components/HomeTab";
import MembersTab from "./components/MembersTab";
import ManageMembersTab from "./components/ManageMembersTab";
import MinutesTab from "./components/MinutesTab";
import LogsTab from "./components/LogsTab";
import CalendarTab from "./components/CalendarTab";

export default function App() {
  const [tab, setTab] = useState("home");
  const [members, setMembers] = useState([]);
  const [minutes, setMinutes] = useState([]);
  const [logs, setLogs] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchAllData() {
      const { data: mData } = await supabase.from('members').select('*');
      const { data: minData } = await supabase.from('minutes').select('*');
      const { data: lData } = await supabase.from('logs').select('*');
      const { data: eData } = await supabase.from('events').select('*');
      if (mData) setMembers(mData);
      if (minData) setMinutes(minData);
      if (lData) setLogs(lData);
      if (eData) setEvents(eData);
    }
    fetchAllData();
  }, []);

  // ... (이하 상태 관리 코드 생략 - 이전 메시지의 전체 코드를 사용하세요)
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#F0F4FA" }}>
      <Sidebar tab={tab} setTab={setTab} />
      <main style={{ marginLeft:220, flex:1, padding:32 }}>
        {tab==="home" && <HomeTab members={members} minutes={minutes} logs={logs} events={events} setTab={setTab} />}
        {tab==="members" && <MembersTab members={members} setMembers={setMembers} logs={logs} />}
        {tab==="manage_members" && <ManageMembersTab members={members} setMembers={setMembers} />}
        {tab==="minutes" && <MinutesTab minutes={minutes} setMinutes={setMinutes} />}
        {tab==="logs" && <LogsTab members={members} logs={logs} setLogs={setLogs} />}
        {tab==="calendar" && <CalendarTab members={members} logs={logs} events={events} setEvents={setEvents} />}
      </main>
    </div>
  );
}
