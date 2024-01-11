"use client";
import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import styles from "@/styles/adminorder.module.scss";
import NavLinks from "@/components/dashboard/subscription/Subscription-nav-links-b";
import ImageUploadp
 from "@/components/test/ImageUploadp";
interface ProductInfo {
  product_id: string;
  product_name: string;
  stock_quantity: number;
  registration_date: string;
  imageurl: string;
  display_status: string;
  info: string;
}

const pageSize = 13; // 페이지당 표시할 항목 수

export default function Product() : React.ReactNode {
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProductIndex, setEditingProductIndex] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductInfo[]>([]);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    pageSize: 13,
    totalPages: 1,
  });
  const [imageurl, setImageurl] = useState<string | null>(null);

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
        `/api/admin/product?page=${page}&pageSize=${pageSize}`
      );
      const data = await response.json();
      setProducts(data.products);

      setPageInfo({
        currentPage: data.pageInfo.currentPage,
        pageSize: data.pageInfo.pageSize,
        totalPages: data.pageInfo.totalPages,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const [productInfo, setProductInfo] = useState<ProductInfo>({
    product_id: "",
    product_name: "",
    stock_quantity: 0,
    registration_date: "",
    imageurl: "",
    display_status: "",
    info: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const updatedProductInfo = {
        ...productInfo,
        imageUrl: imageurl, // 이미지 URL 추가
      };


      const response = await fetch("/api/admin/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProductInfo),
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
      setProductInfo({
        product_id: "",
        product_name: "",
        stock_quantity: 0,
        registration_date: "",
        imageurl: "",
        display_status: "",
        info: ""
      });
      setShowForm(false); // 폼 닫기
    } catch (error) {
      // 네트워크 오류 및 기타 예외 처리
      console.error("Error adding subscription:", error);
    }
  };

  const handleDelete = async (product_id: string) => {
    try {
      const response = await fetch(`/api/admin/product/${product_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log("Product deleted successfully");
        fetchData(pageInfo.currentPage);
        alert("삭제 완료");
      } else {
        console.error(`Error deleting Product: ${response.status}`);
        alert("삭제 실패");
      }
    } catch (error) {
      console.error("Error deleting Product:", error);
    }
  };

  const handleCorrection = (product_id: string) => {
    // 수정 중인 열의 인덱스 설정
    setEditingProductIndex(product_id);
    // 수정 중인 열의 정보를 입력 폼에 표시
    const editingProduct = products.find((product) => product.product_id === product_id);
    if (editingProduct) {
      setProductInfo(editingProduct);
      setShowEditForm(true); // 수정 폼 표시
    }
  };

  const handleUpdate = async (product_id: string) => {
    try {
      const response = await fetch(`/api/admin/product/${product_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productInfo),
      });

      if (response.ok) {
        alert("수정 완료");
        fetchData(pageInfo.currentPage);
        setEditingProductIndex(null);
        setShowEditForm(false); // 폼 닫기
      } else {
        // 오류 응답 처리
        console.error(`Error updating product: ${response.status}`);
        alert("수정 실패");
      }

    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const formatdate = (date: string) => {
    const dateDate = new Date(date);
    const dateLocalString = dateDate.toLocaleDateString();
    return dateLocalString;
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
        <h1 className={styles.title}>상품 관리</h1>
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
                <ImageUploadp onImageUpload={handleImageUpload} />
              </div>
             </label>
            <label className={styles.addLabel}>
              Name:
              <input
                type="text"
                name="product_name"
                value={productInfo.product_name}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <label className={styles.addLabel}>
            stock:
              <input
                type="text"
                name="stock_quantity"
                value={productInfo.stock_quantity}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <label className={styles.addLabel}>
            display:
              <input
                type="text"
                name="display_status"
                value={productInfo.display_status}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <label className={styles.addLabel}>
            info:
              <input
                type="text"
                name="info"
                value={productInfo.info}
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
                name="product_name"
                value={productInfo.product_name}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <label className={styles.addLabel}>
            stock:
              <input
                type="text"
                name="stock_quantity"
                value={productInfo.stock_quantity}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>

            <label className={styles.addLabel}>
            display:
              <input
                type="text"
                name="display_status"
                value={productInfo.display_status}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <label className={styles.addLabel}>
            info:
              <input
                type="text"
                name="info"
                value={productInfo.info}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <button onClick={() => handleUpdate(productInfo.product_id)} className={styles.delButton}>
              수정
            </button>
          </div>
        )}
        <div className={styles.orderContent}>
          <table className={styles.orderTable}>
            <thead>  
              <tr>
                <th>product_id</th>
                <th>product_name</th>
                <th>stock</th>
                <th>registration_date</th>
                <th>imggeUrl</th>
                <th>display</th>
                <th>info</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.product_id}
                  className={`${styles.correction} ${
                    editingProductIndex === product.product_id ? styles.editingRow : ""
                  }`}
                >
                  <td>{product.product_id}</td>
                  <td>{product.product_name}</td>
                  <td>{product.stock_quantity}</td>
                  <td>{formatdate(product.registration_date)}</td>
                  <td>{product.imageurl}</td>
                  <td>{product.display_status}</td>
                  <td className={styles.truncate} >{product.info}</td>
                  <td>
                    <button
                      className={styles.delButton}
                      onClick={() => handleDelete(product.product_id)}
                    >
                      삭제
                    </button>
                    <button
                      className={styles.delButton}
                      onClick={() => handleCorrection(product.product_id)}
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
