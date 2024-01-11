import React from "react";

const UserInfoDisplay = ({ userInfo }) => {
  return (
    <div>
      {userInfo && (
        <div className="myinfo">
            <h2> 주문자 정보 </h2>
          <div>
            <p>이름: {userInfo.name}</p>
            <p>전화번호: {userInfo.phoneNumber}</p>
            <p>이메일: {userInfo.email}</p>
            <p>주소: {userInfo.address}</p>
          </div>
          <div>
            <p>나의 캐쉬: {userInfo.cash}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfoDisplay;