let currentPostId = null;
let currentUserId = null;
let postAuthorId = null;

// 로그아웃 함수
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    alert("로그아웃 되었습니다.");
    location.href = "loginjb.html";
}

// 사용자 정보 로드
async function loadUserInfo() {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    if (!token) {
        window.location.href = "loginjb.html";
        return;
    }

    try {
        const response = await fetch("/api/user/me", {
            headers: { "Authorization": "Bearer " + token }
        });
        const user = await response.json();
        currentUserId = user.id;
        document.getElementById("nickname").innerText = `${user.nickname}님`;
    } catch (error) {
        console.error("Error:", error);
    }
}

// 게시글 정보 로드
async function loadPost() {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    if (!token) {
        window.location.href = "loginjb.html";
        return;
    }

    try {
        const response = await fetch(`/api/posts/${currentPostId}`, {
            headers: { "Authorization": "Bearer " + token }
        });
        const post = await response.json();

        // 작성자 확인
        postAuthorId = post.authorId;
        if (currentUserId !== postAuthorId) {
            alert("글 수정은 작성자만 가능합니다");
            window.location.href = `postDetail.html?postId=${currentPostId}`;
            return;
        }

        // 폼에 기존 내용 채우기
        document.getElementById("title").value = post.title;
        document.getElementById("content").value = post.content;
    } catch (error) {
        console.error("Error:", error);
        alert("게시글을 불러오는데 실패했습니다.");
    }
}

// 수정 제출
async function submitEdit(event) {
    event.preventDefault();
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    try {
        const response = await fetch(`/api/posts/${currentPostId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                title: title,
                content: content
            })
        });

        if (response.ok) {
            alert("게시글이 수정되었습니다.");
            window.location.href = `postDetail.html?postId=${currentPostId}`;
        } else {
            alert("게시글 수정에 실패했습니다.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("게시글 수정 중 오류가 발생했습니다.");
    }
}

// 목록으로 돌아가기
function goBack() {
    window.location.href = `postDetail.html?postId=${currentPostId}`;
}

// 페이지 로드 시 초기화
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    currentPostId = urlParams.get('postId');
    
    if (!currentPostId) {
        alert("게시글을 찾을 수 없습니다.");
        window.location.href = "boardHome.html";
        return;
    }

    loadUserInfo();
    loadPost();
}; 