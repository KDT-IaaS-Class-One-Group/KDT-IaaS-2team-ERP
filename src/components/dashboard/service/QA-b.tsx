"use client";

import React, { useState, ChangeEvent, useEffect, useCallback } from "react";
import styles from "@/styles/adminsidenav.module.scss";

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

  const [editedReply, setEditedReply] = useState<{ [userId: string]: string }>(
    {}
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [searchOption, setSearchOption] = useState("userId"); // 기본값은 userId로 설정

  const fetchData = useCallback(
    async (page: number) => {
      try {
        let apiUrl =
          "/api/admin/service?page=" + page + "&pageSize=" + pageSize;

        if (searchOption === "userId") {
          apiUrl += "&searchOption=userId&searchTerm=" + searchTerm;
        } else if (searchOption === "name") {
          apiUrl += "&searchOption=name&searchTerm=" + searchTerm;
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
    <div className={styles.subproduct}>
      <h1>Q&A 관리</h1>
      <label htmlFor="searchOption">검색 옵션:</label>
      <select
        id="searchOption"
        value={searchOption}
        onChange={(e) => setSearchOption(e.target.value)}
      >
        <option value="userId">User ID</option>
        <option value="name">Name</option>
      </select>
      <input
        type="text"
        placeholder={`${searchOption === "userId" ? "userId" : "name"}로 검색`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className={styles.userinfocontent}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>boardKey</th>
              <th>User ID</th>
              <th>title</th>
              <th>content</th>
              <th>date</th>
              <th>password</th>
              <th>image</th>
              <th>email</th>
              <th>phoneNumber</th>
              <th>name</th>
              <th>reply</th>
            </tr>
          </thead>
          <tbody>
            {boards.map((board) => (
              <tr key={board.boardKey}>
                <td>{board.boardKey}</td>
                <td>{board.userId}</td>
                <td>{board.title}</td>
                <td>{board.content}</td>
                <td>{formatDateTime(board.date)}</td>
                <td>{board.password}</td>
                <td>{board.image}</td>
                <td>{board.email}</td>
                <td>{board.phoneNumber}</td>
                <td>{board.name}</td>
                <td>{board.reply}</td>
                <td>
                  <input
                    type="text"
                    value={editedReply[board.userId] || ""}
                    onChange={(e) =>
                      setEditedReply((prev) => ({
                        ...prev,
                        [board.userId]: e.target.value,
                      }))
                    }
                  />
                  <button onClick={() => handleReplyEdit(board.userId)}>
                    등록
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.pagination}>
          {Array.from(
            { length: pageInfo.totalPages },
            (_, index) => index + 1
          ).map((pageNumber) => (
            <button
              key={pageNumber}
              className={`pagination-button ${
                pageNumber === pageInfo.currentPage ? "active" : ""
              }`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
