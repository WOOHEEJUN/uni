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
});

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
    .then(res => {
        if (!res.ok) throw new Error("인증 실패");
        return res.json();
    })
    .then(user => {
        const status = (user.status || user.userStatus || user.verificationStatus || "").toUpperCase();

        if (status === "APPROVED") {
            location.href = "userIndex.html";
        } else {
            location.href = "noTokenUserIndex.html";
        }
    })
    .catch(() => {
        location.href = "noTokenUserIndex.html";
    });
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    alert("로그아웃 되었습니다.");
    location.href = "loginjb.html";
} 