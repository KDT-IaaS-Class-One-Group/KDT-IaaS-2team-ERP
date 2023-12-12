// 서버에서 데이터 가져오기
async function fetchData() {
  try {
    const response = await fetch("/get-posts");
    if (response.ok) {
      const data = await response.json(); // 여기서 초기화
      console.log(data);
      updateTable(data);
    } else {
      console.error("데이터 로드 실패:", response.statusText);
    }
  } catch (error) {
    console.error("데이터 로드 중 오류:", error);
  }
}

// 테이블 업데이트 함수
function updateTable(data) {
  const tableBody = document.querySelector("#userTable tbody");
  tableBody.innerHTML = "";  // 테이블 내용 초기화

  data.forEach(item => {
    const row = tableBody.insertRow();

    // 각 열에 데이터 추가
    const signupIdCell = row.insertCell();
    signupIdCell.textContent = item.signupId;

    const signupPasswordCell = row.insertCell();
    signupPasswordCell.textContent = item.signupPassword;

    const emailCell = row.insertCell();
    emailCell.textContent = item.email;

    const timestampCell = row.insertCell();
    timestampCell.textContent = item.timestamp;
  });
}

// 페이지 로드 시 데이터 가져오기
window.onload = fetchData;
