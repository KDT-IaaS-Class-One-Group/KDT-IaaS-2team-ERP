"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "@/styles/adminqna.module.scss";
import NavLinks from "@/components/dashboard/service/Service-nav-links-b";

interface BoardInfo {
  boardKey: string;
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
}

const pageSize = 10;

export default function QA() {
  const [boards, setBoards] = useState<BoardInfo[]>([]);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchOption, setSearchOption] = useState("userId"); // 기본값은 userId로 설정
  const [selectedBoard, setSelectedBoard] = useState<BoardInfo | null>(null);
  const [editedReply, setEditedReply] = useState<{ [userId: string]: string }>(
    {}
  );

  const fetchData = useCallback(
    async (page: number) => {
      try {
        let apiUrl =
          "/api/admin/service?page=" + page + "&pageSize=" + pageSize;

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
    setSelectedBoard(board);
  };

  const handleModalClose = () => {
    setSelectedBoard(null);
  };

  const handlePageChange = (newPage: number) => {
    setPageInfo({
      ...pageInfo,
      currentPage: newPage,
    });
  };

  const handleReplyEdit = async (userId: string) => {
    try {
      await fetch(`/api/updateReply/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reply: editedReply[userId] }),
      });
      // 수정 후 데이터 다시 불러오기
      fetchData(pageInfo.currentPage);
      // 수정된 Cash 값을 초기화
      setEditedReply((prev) => ({ ...prev, [userId]: "" }));
      setSelectedBoard(null);
    } catch (error) {
      console.error("Error updating reply:", error);
    }
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

  useEffect(() => {
    fetchData(pageInfo.currentPage);
  }, [fetchData, pageInfo.currentPage]);

  useEffect(() => {
    setSearchTerm("");
  }, []);

  return (
    <>
      <div className={styles.sidelink}>
        <NavLinks />
      </div>
      <div className={styles.main}>
        <h1 className={styles.title}>Q&A 관리</h1>
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
        <div className={styles.qnaContent}>
          <table className={styles.qnaTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>email</th>
                <th>제목</th>
                <th>내용</th>
                <th>답변</th>
                <th>작성일자</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {boards.map((board) => (
                <tr key={board.boardKey}>
                  <td>{board.userId}</td>
                  <td>{board.email}</td>
                  <td>{board.title}</td>
                  <td>{board.content}</td>
                  <td>{board.reply}</td>
                  <td>{formatDateTime(board.date)}</td>
                  <td>
                    <button onClick={() => handleRowClick(board)} className={styles.replyButton}>답변</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedBoard !== null && (
            <div className={`${styles.modal} ${styles.show}`}>
              <div>
                <div  className={styles.modalContent}>
                <span className={styles.close} onClick={handleModalClose}>
                  &times;
                </span>
                <div className={styles.info}>
                <div className={styles.id}>ID : {selectedBoard.userId}</div>
                <div className={styles.email}>email : {selectedBoard.email} </div>
                </div>
                <div className={styles.modalTitle}>제목 : {selectedBoard.title}</div>
                <div className={styles.content}>내용 : {selectedBoard.content}</div>
                <div className={styles.reply}>답변 : {selectedBoard.reply}</div>
                <div>
                  <input
                    type="text"
                    value={editedReply[selectedBoard.userId] || ""}
                    onChange={(e) =>
                      setEditedReply((prev) => ({
                        ...prev,
                        [selectedBoard.userId]: e.target.value,
                      }))
                    }
                    className={styles.replyInput}
                  />
                  <button onClick={() => handleReplyEdit(selectedBoard.userId)} className={styles.replyButton}>
                    등록
                  </button>
                  </div>
                </div>
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
    </>
  );
}
