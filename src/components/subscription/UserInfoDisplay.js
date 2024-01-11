import React from "react";

const UserInfoDisplay = ({ userInfo }) => {
  return (
    <div>
      {userInfo && (
        <div className="myinfo">
          <div>
            <p>이름: {userInfo.name}</p>
            <p>전화번호: {userInfo.phoneNumber}</p>
            <p>이메일: {userInfo.email}</p>
            <p>나의 캐쉬: {userInfo.cash}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfoDisplay;