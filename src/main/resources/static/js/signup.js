document.getElementById("signupForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const nickname = document.getElementById("nickname").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const universityId = parseInt(document.getElementById("university").value);
    const errorBox = document.getElementById("errorBox");

    if (!username || !nickname || !password || !confirmPassword || !universityId) {
        errorBox.textContent = "모든 필드를 입력해주세요.";
        return;
    }

    if (password !== confirmPassword) {
        errorBox.textContent = "비밀번호가 일치하지 않습니다.";
        return;
    }

    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                nickname,
                password,
                universityId
            })
        });

        if (response.ok) {
            alert("회원가입이 성공적으로 완료되었습니다.");
            window.location.href = "loginjb.html";
        } else {
            const errorData = await response.json();
            errorBox.style.color = "red";
            errorBox.textContent = errorData.message || "회원가입 중 오류가 발생했습니다.";
        }
    } catch (error) {
        console.error('Error:', error);
        errorBox.style.color = "red";
        errorBox.textContent = "서버와 통신 중 오류가 발생했습니다.";
    }
}); 