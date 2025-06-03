document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const errorBox = document.getElementById("errorBox");

    if (!username || !password) {
        errorBox.textContent = "아이디와 비밀번호를 모두 입력해주세요.";
        return;
    }

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();

            // 토큰 저장
            localStorage.setItem('token', data.token);

            // 상태 체크 후 페이지 이동
            if (data.role === 'ADMIN') {
                window.location.replace("admin.html");
            } else if (data.status === 'APPROVED') {
                window.location.replace("userindex.html");
            } else if (data.status === 'PENDING') {
                window.location.replace("pending.html");
            } else if (data.status === 'REJECTED') {
                window.location.replace("submitEnrollment.html");
            } else {
                window.location.replace("noTokenUserIndex.html");
            }

        } else {
            const errorData = await response.json();
            errorBox.textContent = errorData.message || "로그인에 실패했습니다.";
        }
    } catch (error) {
        console.error('Error:', error);
        errorBox.textContent = "서버와 통신 중 오류가 발생했습니다.";
    }
}); 