import React, { useState } from "react";

const MenuTab = () => {
  const [activeTab, setActiveTab] = useState("회원관리");

  return (
    <div>
      <ul>
        <li
          onClick={() => setActiveTab("회원관리")}
          className={activeTab === "회원관리" ? "active" : ""}
        >
          회원관리
        </li>
        <li
          onClick={() => setActiveTab("구독관리")}
          className={activeTab === "구독관리" ? "active" : ""}
        >
          구독관리
        </li>
        <li
          onClick={() => setActiveTab("통계분석")}
          className={activeTab === "통계분석" ? "active" : ""}
        >
          통계분석
        </li>
        <li
          onClick={() => setActiveTab("고객지원")}
          className={activeTab === "고객지원" ? "active" : ""}
        >
          고객지원
        </li>
      </ul>

      {activeTab === "회원관리" && (
        <div>회원관리 페이지</div>
      )}
      {activeTab === "구독관리" && (
        <div>구독관리 페이지</div>
      )}
      {activeTab === "통계분석" && (
        <div>통계분석 페이지</div>
      )}
      {activeTab === "고객지원" && (
        <div>고객지원 페이지</div>
      )}
    </div>
  );
};

export default MenuTab;