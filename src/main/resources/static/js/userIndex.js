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
    // 사용자 정보를 가져온 후 게시판 목록과 HOT 게시물 로드
    loadUniversityBoards();
    if (user.universityId) {
      console.log("대학교 ID로 HOT 게시물 로드 시작:", user.universityId);
      loadHotPosts(user.universityId);
    } else {
      console.error("대학교 ID가 없습니다.");
    }
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
      a.href = `/boardHome.html?boardId=${board.id}&boardType=${board.type}`;
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

// HOT 게시물 로드
function loadHotPosts(universityId) {
  console.log("HOT 게시물 로드 시작...", universityId);
  if (!universityId) {
    console.error("universityId가 없습니다.");
    const hotPostsList = document.getElementById("hotPostsList");
    if (hotPostsList) {
      hotPostsList.innerHTML = "<li>대학교 정보가 없어 HOT 게시물을 불러올 수 없습니다.</li>";
    }
    return;
  }

  fetch(`/api/posts/hot/${universityId}`, {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
  .then(response => {
    console.log("서버 응답 상태:", response.status);
    if (!response.ok) {
      throw new Error(`HOT 게시물을 가져오는데 실패했습니다. (${response.status})`);
    }
    return response.json();
  })
  .then(posts => {
    console.log("가져온 HOT 게시물:", posts);
    const hotPostsList = document.getElementById("hotPostsList");
    if (!hotPostsList) {
      console.error("hotPostsList 요소를 찾을 수 없습니다.");
      return;
    }
    
    hotPostsList.innerHTML = ""; // 기존 목록 초기화
    
    if (!posts || posts.length === 0) {
      hotPostsList.innerHTML = "<li>아직 HOT 게시물이 없습니다. 첫 번째 게시물을 작성해보세요!</li>";
      return;
    }
    
    posts.forEach((post, index) => {
      console.log(`게시물 ${index + 1} 처리:`, post);
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `postDetail.html?postId=${post.id}`;
      a.textContent = `🔥 ${post.title}`;
      li.appendChild(a);
      hotPostsList.appendChild(li);
    });
  })
  .catch(err => {
    console.error("HOT 게시물 로드 실패:", err);
    const hotPostsList = document.getElementById("hotPostsList");
    if (hotPostsList) {
      hotPostsList.innerHTML = "<li>HOT 게시물을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.</li>";
    }
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