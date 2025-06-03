let currentUser = null;

window.addEventListener("DOMContentLoaded", () => {
  fetch("/api/user/me", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
  .then(response => {
    if (!response.ok) throw new Error("인증 실패");
    return response.json();
  })
  .then(user => {
    currentUser = user;
    console.log("현재 로그인한 사용자 정보:", user);
    document.querySelector("#userGreeting").innerText = user.nickname + "님 안녕하세요!";
    if (user.universityName) {
      document.querySelector("#universityName").innerText = `🏫 ${user.universityName}`;
    }
    // 사용자 정보를 가져온 후 게시판 목록 로드
    loadUniversityBoards();
  })
  .catch(err => {
    console.error("사용자 정보 불러오기 실패:", err);
    document.querySelector("#userGreeting").innerText = "로그인이 필요합니다.";
    window.location.href = "loginjb.html";
  });
});

function loadUniversityBoards() {
  console.log("게시판 목록 로드 시작...");
  fetch("/api/boards/my-university", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
  .then(response => {
    if (!response.ok) throw new Error("게시판 목록을 가져오는데 실패했습니다.");
    return response.json();
  })
  .then(boards => {
    console.log("가져온 게시판 목록:", boards);
    const boardList = document.getElementById("boardList");
    boardList.innerHTML = ""; // 기존 목록 초기화
    
    boards.forEach(board => {
      console.log("게시판 정보:", board);
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `/board.html?id=${board.id}`;
      a.textContent = board.name;
      li.appendChild(a);
      boardList.appendChild(li);
    });
  })
  .catch(err => {
    console.error("게시판 목록 로드 실패:", err);
    const boardList = document.getElementById("boardList");
    boardList.innerHTML = "<li>게시판을 불러오는데 실패했습니다.</li>";
  });
}

function logout() {
  localStorage.removeItem("token");
  alert("로그아웃 되었습니다.");
  window.location.href = "loginjb.html";
}

function goChat() {
  window.location.href = "chat.html";
} 