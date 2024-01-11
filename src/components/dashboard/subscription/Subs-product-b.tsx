"use client";
import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import styles from "@/styles/adminorder.module.scss";
import NavLinks from "@/components/dashboard/subscription/Subscription-nav-links-b";
import ImageUpload from "@/components/test/ImageUpload";
interface SubscriptionInfo {
  subs_index: string;
  name: string;
  week: string;
  size: string;
  price: string;
  imageUrl?: string; 
}

const pageSize = 13; // 페이지당 표시할 항목 수

export default function SubsProduct(): React.ReactNode {
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingSubsIndex, setEditingSubsIndex] = useState<string | null>(null);
  const [subs, setSubs] = useState<SubscriptionInfo[]>([]);
  const [imageurl, setImageurl] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    pageSize: 13,
    totalPages: 1,
  });

  const handlePageChange = (newPage: number) => {
    setPageInfo({
      ...pageInfo,
      currentPage: newPage,
    });
  };

  useEffect(() => {
    fetchData(pageInfo.currentPage);
  }, [pageInfo.currentPage]);

  const fetchData = async (page: number) => {
    try {
      const response = await fetch(
        `/api/subs-product?page=${page}&pageSize=${pageSize}`
      );
      const data = await response.json();
      setSubs(data.subs);

      setPageInfo({
        currentPage: data.pageInfo.currentPage,
        pageSize: data.pageInfo.pageSize,
        totalPages: data.pageInfo.totalPages,
      });
    } catch (error) {
      console.error("Error fetching subs:", error);
    }
  };

  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    subs_index: "",
    name: "",
    week: "",
    size: "",
    price: "",
    imageUrl:"",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSubscriptionInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const updatedSubscriptionInfo = {
        ...subscriptionInfo,
        imageUrl: imageurl, // 이미지 URL 추가
      };

      const response = await fetch("/api/subs-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSubscriptionInfo),
      });
  
      if (response.ok) {
        fetchData(pageInfo.currentPage);
        alert("등록 완료");
      } else {
        // 오류 응답 처리
        console.error(`Error adding subscription: ${response.status}`);
        alert("등록 실패");
      }
  
      // 입력 폼 초기화
      setSubscriptionInfo({
        subs_index: "",
        name: "",
        week: "",
        size: "",
        price: "",
      });
      setShowForm(false); // 폼 닫기
    } catch (error) {
      // 네트워크 오류 및 기타 예외 처리
      console.error("Error adding subscription:", error);
    }
  };

  const handleDelete = async (subs_index: string) => {
    try {
      const response = await fetch(`/api/subs-product/${subs_index}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log("Subscription deleted successfully");
        fetchData(pageInfo.currentPage);
        alert("삭제 완료");
      } else {
        console.error(`Error deleting subscription: ${response.status}`);
        alert("삭제 실패");
      }
    } catch (error) {
      // 네트워크 오류 및 기타 예외 처리
      console.error("Error deleting subscription:", error);
    }
  };

  const handleCorrection = (subs_index: string) => {
    // 수정 중인 열의 인덱스 설정
    setEditingSubsIndex(subs_index);
    // 수정 중인 열의 정보를 입력 폼에 표시
    const editingSub = subs.find((sub) => sub.subs_index === subs_index);
    if (editingSub) {
      setSubscriptionInfo(editingSub);
      setShowEditForm(true); // 수정 폼 표시
    }
  };

  const handleUpdate = async (subs_index: string) => {
    try {
      const response = await fetch(`/api/subs-product/${subs_index}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscriptionInfo),
      });

      if (response.ok) {
        alert("수정 완료");
        fetchData(pageInfo.currentPage);
        setEditingSubsIndex(null);
        setShowEditForm(false); // 폼 닫기
      } else {
        // 오류 응답 처리
        console.error(`Error updating subscription: ${response.status}`);
        alert("수정 실패");
      }

    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };
 
  const handleImageUpload = (imageUrl: string) => {
    // 이미지 업로드 성공 시, 이미지 URL을 state에 업데이트
    setImageurl(imageUrl);
    console.log("이미지 업로드 성공:", imageUrl);
  };
  

  return (
    <>
      <div className={styles.sidelink}>
        <NavLinks />
      </div>
      <div className={styles.main}>
        <h1 className={styles.title}>구독 관리</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className={styles.addButton}
        >
          추가
        </button>
        {showForm && (
          <div className={styles.addSubscription}>
            <label className={styles.addLabel}>
              <div>
                <ImageUpload onImageUpload={handleImageUpload} />
              </div>
             </label>
            <label className={styles.addLabel}>
              Name:
              <input
                type="text"
                name="name"
                value={subscriptionInfo.name}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <label className={styles.addLabel}>
              Week:
              <input
                type="text"
                name="week"
                value={subscriptionInfo.week}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <label className={styles.addLabel}>
              Size:
              <input
                type="text"
                name="size"
                value={subscriptionInfo.size}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <label className={styles.addLabel}>
              Price:
              <input
                type="text"
                name="price"
                value={subscriptionInfo.price}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <button onClick={handleSubmit} className={styles.delButton}>
              등록
            </button>
          </div>
        )}
        {showEditForm && (
          <div className={styles.addSubscription}>
            <label className={styles.addLabel}>
              Name:
              <input
                type="text"
                name="name"
                value={subscriptionInfo.name}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <label className={styles.addLabel}>
              Week:
              <input
                type="text"
                name="week"
                value={subscriptionInfo.week}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <label className={styles.addLabel}>
              Size:
              <input
                type="text"
                name="size"
                value={subscriptionInfo.size}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <label className={styles.addLabel}>
              Price:
              <input
                type="text"
                name="price"
                value={subscriptionInfo.price}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <button onClick={() => handleUpdate(subscriptionInfo.subs_index)} className={styles.delButton}>
              수정
            </button>
          </div>
        )}
        <div className={styles.orderContent}>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th>subs_index</th>
                <th>name</th>
                <th>week</th>
                <th>size</th>
                <th>price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subs.map((sub) => (
                <tr
                  key={sub.subs_index}
                  className={`${styles.correction} ${
                    editingSubsIndex === sub.subs_index ? styles.editingRow : ""
                  }`}
                >
                  <td>{sub.subs_index}</td>
                  <td>{sub.name}</td>
                  <td>{sub.week}</td>
                  <td>{sub.size}</td>
                  <td>{sub.price}</td>
                  <td>
                    <button
                      className={styles.delButton}
                      onClick={() => handleDelete(sub.subs_index)}
                    >
                      삭제
                    </button>
                    <button
                      className={styles.delButton}
                      onClick={() => handleCorrection(sub.subs_index)}
                    >
                      수정
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
