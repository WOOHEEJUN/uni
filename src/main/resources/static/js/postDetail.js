// 전역 변수
let currentPostId = null;
let currentUserId = null;
let isLiked = false;
let isSecretBoard = false;

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
        document.getElementById("nickname").innerText = `${user.nickname}님`;
    } catch (error) {
        console.error("Error:", error);
    }
}

// 게시글 로드
async function loadPost() {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    if (!token) {
        window.location.href = "loginjb.html";
        return;
    }

    try {
        // 게시글 조회 및 조회수 증가
        const response = await fetch(`/api/posts/${currentPostId}`, {
            headers: { "Authorization": "Bearer " + token }
        });
        const post = await response.json();

        // 게시글 정보 표시
        document.getElementById("postTitle").textContent = post.title;
        document.getElementById("postAuthor").textContent = post.anonymous ? "익명" : post.authorName;
        document.getElementById("postDate").textContent = new Date(post.createdAt).toLocaleDateString();
        document.getElementById("postContent").textContent = post.content;

        // 비밀 게시판 여부 확인
        isSecretBoard = post.boardType === "SECRET";

        // 좋아요 상태와 좋아요 수 확인
        const likeResponse = await fetch(`/api/posts/${currentPostId}/like`, {
            headers: { "Authorization": "Bearer " + token }
        });
        const likeStatus = await likeResponse.json();
        isLiked = likeStatus.liked;
        document.getElementById("likeCount").textContent = likeStatus.likeCount;
        updateLikeButton();

        // 댓글 목록 로드
        loadComments();

    } catch (error) {
        console.error("Error:", error);
        alert("게시글을 불러오는데 실패했습니다.");
    }
}

// 댓글 목록 로드
async function loadComments() {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    try {
        const response = await fetch(`/api/posts/${currentPostId}/comments`, {
            headers: { "Authorization": "Bearer " + token }
        });
        const comments = await response.json();

        const commentList = document.getElementById("commentList");
        commentList.innerHTML = comments.map(comment => `
            <div class="comment-item">
                <div class="comment-header">
                    <span class="comment-author">${comment.boardType === "SECRET" ? "익명" : (comment.anonymous ? "익명" : comment.authorName)}</span>
                    <span class="comment-date">${new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <div class="comment-content">${comment.content}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error:", error);
    }
}

// 댓글 작성
async function submitComment(event) {
    event.preventDefault();
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    const content = document.getElementById("commentContent").value;

    try {
        const response = await fetch(`/api/posts/${currentPostId}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                content: content,
                isAnonymous: isSecretBoard  // 비밀 게시판이면 자동으로 익명 처리
            })
        });

        if (response.ok) {
            document.getElementById("commentContent").value = "";
            loadComments();
        } else {
            alert("댓글 작성에 실패했습니다.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("댓글 작성 중 오류가 발생했습니다.");
    }
}

// 좋아요 토글
async function toggleLike() {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    try {
        const response = await fetch(`/api/posts/${currentPostId}/like`, {
            method: "POST",
            headers: { "Authorization": "Bearer " + token }
        });
        const result = await response.json();
        isLiked = result.liked;
        document.getElementById("likeCount").textContent = result.likeCount;
        updateLikeButton();
    } catch (error) {
        console.error("Error:", error);
    }
}

// 좋아요 버튼 업데이트
function updateLikeButton() {
    const likeIcon = document.getElementById("likeIcon");
    likeIcon.style.color = isLiked ? "#ff4757" : "#666";
}

// 목록으로 돌아가기
function goBack() {
    window.history.back();
}

// 수정 페이지로 이동
function goToEdit() {
    window.location.href = `editPost.html?postId=${currentPostId}`;
}

// 게시글 삭제
async function deletePost() {
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    try {
        const response = await fetch(`/api/posts/${currentPostId}`, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
        });

        if (response.ok) {
            alert("게시글이 삭제되었습니다.");
            goBack();
        } else {
            alert("게시글 삭제에 실패했습니다.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("게시글 삭제 중 오류가 발생했습니다.");
    }
}

// 페이지 로드 시 초기화
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    currentPostId = urlParams.get('postId');
    
    if (!currentPostId) {
        alert("게시글을 찾을 수 없습니다.");
        goBack();
        return;
    }

    loadUserInfo();  // 사용자 정보 로드
    loadPost();
}; 