// 전역 변수
let currentBoardId = null;
let currentBoardType = null;

// 로그아웃 함수
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    alert("로그아웃 되었습니다.");
    location.href = "loginjb.html";
}

// 게시글 작성 제출
async function submitPost(event) {
    event.preventDefault();
    
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    if (!token) {
        alert("로그인이 필요합니다.");
        window.location.href = "loginjb.html";
        return;
    }

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const isAnonymous = currentBoardType === 'ANONYMOUS' || document.getElementById("isAnonymous").checked;

    try {
        const response = await fetch("/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                boardId: currentBoardId,
                title: title,
                content: content,
                isAnonymous: isAnonymous
            })
        });

        if (response.ok) {
            alert("게시글이 등록되었습니다.");
            window.location.href = `boardHome.html?boardId=${currentBoardId}&boardType=${currentBoardType}`;
        } else {
            const error = await response.json();
            alert(error.message || "게시글 등록에 실패했습니다.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("게시글 등록 중 오류가 발생했습니다.");
    }
}

// 페이지 로드 시 초기화
window.onload = function () {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    if (!token) {
        window.location.href = "loginjb.html";
        return;
    }

    // URL에서 boardId와 boardType 파라미터 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    currentBoardId = urlParams.get('boardId');
    currentBoardType = urlParams.get('boardType');

    if (!currentBoardId || !currentBoardType) {
        alert("게시판 정보를 찾을 수 없습니다.");
        window.location.href = "userIndex.html";
        return;
    }

    // 비밀게시판인 경우 익명 체크박스 표시, 다른 게시판에서는 숨기기
    if (currentBoardType === 'ANONYMOUS') {
        document.querySelector('.anonymous-check').style.display = 'flex';
        // 비밀게시판에서는 기본적으로 익명 체크박스 활성화
        document.getElementById("isAnonymous").checked = true;
    } else {
        document.querySelector('.anonymous-check').style.display = 'none';
    }

    // 사용자 정보 가져오기
    fetch("/api/user/me", {
        headers: { "Authorization": "Bearer " + token }
    })
        .then(res => res.json())
        .then(user => {
            document.getElementById("nickname").innerText = `${user.nickname}님`;
        })
        .catch(() => {
            document.getElementById("nickname").innerText = "익명님";
        });
}; 