// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // 우리가 방금 분리해서 조립한 App 컴포넌트

// 팁: 만약 전체 배경색이나 폰트를 설정한 전역 CSS 파일이 있다면 여기서 불러와.
// (없거나 필요 없으면 아래 줄은 그냥 지워도 돼!)
// import './index.css' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
