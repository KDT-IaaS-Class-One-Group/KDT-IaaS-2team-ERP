const root = document.getElementById("root");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginForm = document.getElementById("loginForm");

// 로그인 함수
loginBtn.addEventListener("click", async function () {
  const userId = document.getElementById("userId").value;
  const userPassword = document.getElementById("userPassword").value;

  if (userId === "admin" && userPassword === "1234") {
    // 로그인 성공 시
    console.log("Login successful");
    loginForm.style.display = "none";
    logoutBtn.style.display = "block";
    const member = document.createElement("div");
    root.appendChild(member);
    member.style.width = "10vw";
    member.style.height = "5vh";
    member.textContent = "회원관리";
    member.addEventListener("click", function () {
      window.location = "http://localhost:8000/member.html";
    });
  } else {
    // 로그인 실패 시
    console.error("Login failed:", result);
    alert("올바른 ID와 PASSWORD를 입력해주세요");
  }
});
