"use client";

import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import Topbar from "@/components/Topbar/Topbar";
import { useRouter } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";
import styles from "@/styles/qna.module.scss";

interface BoardInfo {
  Board_Index: string;
  userId: string;
  title: string;
  content: string;
  date: string;
  password: string;
  image: string;
  email: string;
  phoneNumber: string;
  name: string;
  reply: string;
  replyStatus: number;
}

const pageSize = 8;

export default function QA() {
  const [boards, setBoards] = useState<BoardInfo[]>([]);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    pageSize: 8,
    totalPages: 1,
  });
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchOption, setSearchOption] = useState("userId"); // 기본값은 userId로 설정
  const [selectedBoard, setSelectedBoard] = useState<BoardInfo | null>(null);
  const [BoardInfo, setBoardInfo] = useState<BoardInfo>({
    Board_Index: "",
    userId: "",
    title: "",
    content: "",
    date: "",
    password: "",
    image: "",
    email: "",
    phoneNumber: "",
    name: "",
    reply: "",
    replyStatus: 1,
  });
  const [showForm, setShowForm] = useState(false);
  const resetForm = () => {
    setBoardInfo({
      Board_Index: "",
      userId: "",
      title: "",
      content: "",
      date: "",
      password: "",
      image: "",
      email: "",
      phoneNumber: "",
      name: "",
      reply: "",
      replyStatus: 1,
    });
  };
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);
  const fetchData = useCallback(
    async (page: number) => {
      try {
        let apiUrl = "/api/service?page=" + page + "&pageSize=" + pageSize;

        if (searchOption === "userId") {
          apiUrl += "&searchOption=userId&searchTerm=" + searchTerm;
        } else if (searchOption === "title") {
          apiUrl += "&searchOption=title&searchTerm=" + searchTerm;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();

        setBoards(data.boards);
        setPageInfo({
          currentPage: data.pageInfo.currentPage,
          pageSize: data.pageInfo.pageSize,
          totalPages: data.pageInfo.totalPages,
        });
      } catch (error) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);
      }
    },
    [searchTerm, searchOption]
  );

  const handleRowClick = (board: BoardInfo) => {
    // 모달을 열 때, 비밀번호를 입력받을 수 있는 폼을 렌더링
    const enteredPassword = prompt("비밀번호를 입력하세요:");

    // 서버로 비밀번호 확인 요청
    fetch(`/api/service/${board.Board_Index}/check-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: enteredPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // 비밀번호가 일치하면 모달 열기
          setSelectedBoard(board);
        } else {
          // 비밀번호가 일치하지 않으면 에러 처리 또는 다른 행동 수행
          alert("비밀번호가 일치하지 않습니다.");
        }
      })
      .catch((error) => {
        console.error("Error checking password:", error);
      });
  };

  const handlePageChange = (newPage: number) => {
    setPageInfo({
      ...pageInfo,
      currentPage: newPage,
    });
  };

  const handleAdd = () => {
    if (!token) {
      router.push("/login");
      return;
    }

    setShowForm(true); // Show the form for adding a new post
    resetForm();
  };

  const handleSubmit = async () => {
    try {
      const updatedBoardinfo = {
        ...BoardInfo,
      };

      const currentToken = token || "";

      const response = await fetch("/api/service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify(updatedBoardinfo),
      });

      if (response.ok) {
        fetchData(pageInfo.currentPage);
        alert("등록 완료");
        setShowForm(false); // 폼 닫기
      } else {
        console.error(`Error adding board: ${response.status}`);
        alert("등록 실패");
      }

      // 입력 폼 초기화
      resetForm();
      setShowForm(false); // 폼 닫기
    } catch (error) {
      console.error("Error adding board:", error);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBoardInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const formatDateTime = (datetime: string) => {
    const dateTime = new Date(datetime);
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    };
    const dateTimeString = dateTime.toLocaleString();
    return dateTimeString;
  };

  const handleModalClose = () => {
    setSelectedBoard(null);
    setShowForm(false);
  };

  useEffect(() => {
    fetchData(pageInfo.currentPage);
  }, [fetchData, pageInfo.currentPage]);

  useEffect(() => {
    setSearchTerm("");
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.top}>
        <Topbar />
      </div>
      <div className={styles.main}>
        <div className={styles.titleD}>

        <h1 className={styles.title}>Q&A</h1>
        </div>
        <div>
          <label htmlFor="searchOption"></label>
          <select
            id="searchOption"
            value={searchOption}
            onChange={(e) => setSearchOption(e.target.value)}
            className={styles.select}
          >
            <option value="userId">ID</option>
            <option value="title">제목</option>
          </select>
          <input
            type="text"
            placeholder={`${
              searchOption === "userId" ? "ID로 검색" : "제목으로 검색"
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.search}
          />
          <button onClick={handleAdd} className={styles.addButton}>
            글쓰기
          </button>
        </div>
        <div className={styles.qnaContent}>
          <table className={styles.qnaTable}>
            <thead>
              <tr>
                <th>No</th>
                <th>제목</th>
                <th>글쓴이</th>
                <th>작성시간</th>
                <th>답변상태</th>
              </tr>
            </thead>
            <tbody>
              {boards.map((board) => (
                <tr
                  key={board.Board_Index}
                  onClick={() => handleRowClick(board)}
                >
                  <td>{board.Board_Index}</td>
                  <td>{board.title}</td>
                  <td>{board.userId}</td>
                  <td>{formatDateTime(board.date)}</td>
                  <td>{board.replyStatus === 0 ? "미답변" : "답변완료"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedBoard !== null && (
            <div className={`${styles.modal} ${styles.show}`}>
              <div>
                <div className={styles.modalContent}>
                  <span className={styles.close} onClick={handleModalClose}>
                    &times;
                  </span>
                  <table className={styles.infoTable}>
                    <tbody>
                      <tr>
                        <td>No</td>
                        <td>{selectedBoard.Board_Index}</td>

                        <td>작성시간</td>
                        <td>{formatDateTime(selectedBoard.date)}</td>

                        <td>글쓴이</td>
                        <td>{selectedBoard.userId}</td>
                      </tr>
                      <tr>
                        <th colSpan="6">제목</th>
                      </tr>
                      <tr>
                        <td colSpan="6">{selectedBoard.title}</td>
                      </tr>
                      <tr>
                        <th colSpan="6">내용</th>
                      </tr>
                      <tr>
                        <td colSpan="6">{selectedBoard.content}</td>
                      </tr>
                      <tr>
                        <th colSpan="6">답변</th>
                      </tr>
                      <tr>
                        <td colSpan="6">{selectedBoard.reply}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {showForm && (
            <div className={`${styles.modal} ${styles.show}`}>
              <div className={styles.modalContent}>
                <span className={styles.close} onClick={handleModalClose}>
                  &times;
                </span>
                <table className={styles.wirteTable}>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="password"
                          name="password"
                          value={BoardInfo.password}
                          onChange={handleChange}
                          className={styles.writePassword}
                          placeholder="password"
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="title"
                          name="title"
                          value={BoardInfo.title}
                          onChange={handleChange}
                          className={styles.writeTitle}
                          placeholder="제목"
                          required />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <textarea
                          name="content"
                          value={BoardInfo.content}
                          onChange={handleChange}
                          className={styles.writeContent}
                          placeholder="내용"
                        />
                      </td>
                    </tr>
                    <button
                      onClick={() => handleSubmit()}
                      className={styles.delButton}
                    >
                      등록
                    </button>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div>
            {Array.from(
              { length: pageInfo.totalPages },
              (_, index) => index + 1
            ).map((pageNumber) => (
              <button
                key={pageNumber}
                className={`${styles.paginationButton} ${
                  pageNumber === pageInfo.currentPage ? styles.active : ""
                }`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
