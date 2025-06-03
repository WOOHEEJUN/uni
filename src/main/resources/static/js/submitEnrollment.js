window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
  if (!token) return;

  fetch("/api/user/me", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + token
    }
  })
  .then(response => {
    if (!response.ok) throw new Error("인증 실패");
    return response.json();
  })
  .then(user => {
    const nickname = user.nickname || "사용자";
    document.getElementById("nicknameArea").innerText = `${nickname}님 안녕하세요!`;
  })
  .catch(err => {
    console.error("닉네임 불러오기 실패:", err);
    document.getElementById("nicknameArea").innerText = "로그인 오류";
  });

  // 파일 제출 폼 이벤트 리스너 추가
  document.getElementById("enrollmentForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const fileInput = document.getElementById("enrollmentProof");
    const file = fileInput.files[0];
    const successMsg = document.getElementById("successMsg");
    
    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }

    // 파일 형식 검사
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert("PDF, JPG, PNG 파일만 업로드 가능합니다.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      // 1. 파일 업로드
      const uploadResponse = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (uploadResponse.ok) {
        // 2. 사용자 상태를 PENDING으로 변경
        const statusResponse = await fetch('/api/user/status', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'PENDING' })
        });

        if (statusResponse.ok) {
          successMsg.style.display = "block";
          successMsg.textContent = "재학증명서가 성공적으로 제출되었습니다. 관리자 승인을 기다려주세요.";
          fileInput.value = ""; // 파일 입력 초기화
          
          // 3초 후 pending.html로 이동
          setTimeout(() => {
            window.location.href = "pending.html";
          }, 3000);
        } else {
          throw new Error("상태 변경에 실패했습니다.");
        }
      } else {
        const errorData = await uploadResponse.json();
        alert(errorData.message || "파일 업로드에 실패했습니다.");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  });
});

function logout() {
  alert("로그아웃 되었습니다.");
  location.href = "loginjb.html";
}

function goMain() {
  const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
  if (!token) {
    location.href = "noTokenUserIndex.html";
    return;
  }

  fetch("/api/user/me", {
    headers: {
      "Authorization": "Bearer " + token
    }
  })
  .then(res => res.ok ? res.json() : Promise.reject("인증 실패"))
  .then(user => {
    const status = user.status || user.userStatus || user.verificationStatus;
    if (status === "APPROVED") {
      location.href = "userIndex.html";
    } else {
      location.href = "noTokenUserIndex.html";
    }
  })
  .catch(() => location.href = "noTokenUserIndex.html");
} 