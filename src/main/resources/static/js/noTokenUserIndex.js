window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    if (!token) return;

    fetch("/api/user/me", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("인증 실패");
        return res.json();
    })
    .then(user => {
        if (user.status === "APPROVED") {
            location.href = "userIndex.html";
            return;
        }
        const nickname = user.nickname || "게스트";
        document.getElementById("nicknameArea").innerText = `${nickname}님 안녕하세요!`;
    })
    .catch(err => {
        console.warn("닉네임 불러오기 실패:", err);
        document.getElementById("nicknameArea").innerText = "게스트님 안녕하세요!";
    });
});

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    alert("로그아웃 되었습니다.");
    location.href = "index.html";
} 