// 페이지 로드 시 현재 사용자 정보 가져오기
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('/api/user/me', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
            document.getElementById('nickname').value = userData.nickname;
        } else {
            window.location.href = '/login.html';
        }
    } catch (error) {
        console.error('Error:', error);
        window.location.href = '/login.html';
    }
});

// 폼 제출 처리
document.getElementById("updateForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const nickname = document.getElementById("nickname").value;
    const errorBox = document.getElementById("errorBox");
    
    try {
        const response = await fetch('/api/user/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                currentPassword,
                newPassword,
                nickname
            })
        });
        
        if (response.ok) {
            alert('회원정보가 수정되었습니다.');
            window.location.href = '/userindex.html';
        } else {
            const error = await response.json();
            errorBox.textContent = error.message || '회원정보 수정에 실패했습니다.';
        }
    } catch (error) {
        console.error('Error:', error);
        errorBox.textContent = "서버와 통신 중 오류가 발생했습니다.";
    }
}); 