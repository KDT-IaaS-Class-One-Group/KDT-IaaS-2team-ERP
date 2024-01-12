"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import styles from "@/styles/adminorder.module.scss";
import NavLinks from "@/components/dashboard/subscription/Subscription-nav-links-b";
import ImageUpload from "@/components/test/ImageUpload";
interface SubscriptionInfo {
  Subs_Index: string;
  name: string;
  week: number;
  size: number;
  price: string;
  imageUrl?: string; 
  timestamp: string;
}

const pageSize = 10; // 페이지당 표시할 항목 수

export default function SubsProduct(): React.ReactNode {
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingSubsIndex, setEditingSubsIndex] = useState<string | null>(null);
  const [subs, setSubs] = useState<SubscriptionInfo[]>([]);
  const [imageurl, setImageurl] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    pageSize: 10,
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
    Subs_Index: "",
    name: "",
    week: 4,
    size: 1,
    price: "",
    imageUrl:"",
    timestamp: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log(e.target)
    setSubscriptionInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setSubscriptionInfo({
      Subs_Index: "",
      name: "",
      week: 4,
      size: 1,
      price: "",
      imageUrl:"",
      timestamp: "",
    });
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
      setShowForm(false); // 폼 닫기
      } else {
        console.error(`Error adding subscription: ${response.status}`);
        alert("등록 실패");
      }
  
      // 입력 폼 초기화
      resetForm()
      setShowForm(false); // 폼 닫기
    } catch (error) {
      console.error("Error adding subscription:", error);
    }
  };



  const handleDelete = async (Subs_Index: string) => {
    try {
      const response = await fetch(`/api/subs-product/${Subs_Index}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        fetchData(pageInfo.currentPage);
        alert("삭제 완료");
      } else {
        console.error(`Error deleting subscription: ${response.status}`);
        alert("삭제 실패");
      }
    } catch (error) {
      console.error("Error deleting subscription:", error);
    }
  };

  const handleCorrection = (Subs_Index: string) => {
    setEditingSubsIndex(Subs_Index);
    setShowForm(false); // 추가 폼 숨기기
    
    const editingSub = subs.find((sub) => sub.Subs_Index === Subs_Index);
    if (editingSub) {
      setSubscriptionInfo(editingSub);
      setShowEditForm(true);
    }
  };


  const handleUpdate = async (Subs_Index: string) => {
    try {
      const { name, week, size, price } = subscriptionInfo;
      const updatedSubscription = { name, week, size, price };
      const response = await fetch(`/api/subs-product/${Subs_Index}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSubscription),
      });

      if (response.ok) {
        alert("수정 완료");
        fetchData(pageInfo.currentPage);
        setEditingSubsIndex(null);
        setShowEditForm(false);
        resetForm()
      } else {
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
  

  const handleAdd = () => {
    setShowEditForm(false); // 수정 폼 숨기기
    setShowForm(true); // 추가 폼 표시
    resetForm();
  };

  const formatdate = (date: string) => {
    const dateDate = new Date(date);
    const dateLocalString = dateDate.toLocaleDateString();
    return dateLocalString;
  };

  return (
    <>
      <div className={styles.sidelink}>
        <NavLinks />
      </div>
      <div className={styles.main}>
        <h1 className={styles.title}>구독 서비스 관리</h1>
        <button
          onClick={handleAdd}
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
              구독 서비스명 :
              <input
                type="text"
                name="name"
                value={subscriptionInfo.name}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <label className={styles.addLabel}>
              구독 주:
              <select
                name="week"
                value={subscriptionInfo.week}
                onChange={handleChange}
                className={styles.addInput}
              >
                {[4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48].map(
                  (option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  )
                )}
              </select>
            </label>
            <label className={styles.addLabel}>
              수량 :
              <select
                name="size"
                value={subscriptionInfo.size}
                onChange={handleChange}
                className={styles.addInput}
              >
                {[1, 2, 3].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.addLabel}>
              가격 :
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
              구독 서비스명 :
              <input
                type="text"
                name="name"
                value={subscriptionInfo.name}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <label className={styles.addLabel}>
              구독 주:
              <select
                name="week"
                value={subscriptionInfo.week}
                onChange={handleChange}
                className={styles.addInput}
              >
                {[4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48].map(
                  (option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  )
                )}
              </select>
            </label>
            <label className={styles.addLabel}>
              수량 :
              <select
                name="size"
                value={subscriptionInfo.size}
                onChange={handleChange}
                className={styles.addInput}
              >
                {[1, 2, 3].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.addLabel}>
              가격 :
              <input
                type="text"
                name="price"
                value={subscriptionInfo.price}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <button
              onClick={() => handleUpdate(subscriptionInfo.Subs_Index)}
              className={styles.delButton}
            >
              수정
            </button>
          </div>
        )}
        <div className={styles.orderContent}>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th>구독 서비스</th>
                <th>구독 서비스명</th>
                <th>기간 (주)</th>
                <th>상품 수량 (주)</th>
                <th>가격</th>
                <th>등록일</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subs.map((sub) => (
                <tr
                  key={sub.Subs_Index}                                         
                  className={`${styles.correction} ${
                    editingSubsIndex === sub.Subs_Index && showEditForm
                      ? styles.editingRow
                      : ""
                  }`}
                >
                  <td>{sub.Subs_Index}</td>
                  <td>{sub.name}</td>
                  <td>{sub.week}</td>
                  <td>{sub.size}</td>
                  <td>{sub.price}</td>
                  <td>{formatdate(sub.timestamp)}</td>
                  <td>
                    <button
                      className={styles.delButton}
                      onClick={() => handleCorrection(sub.Subs_Index)}
                    >
                      수정
                    </button>
                    <button
                      className={styles.delButton}
                      onClick={() => handleDelete(sub.Subs_Index)}
                    >
                      삭제
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
