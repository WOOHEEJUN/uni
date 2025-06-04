// 현재 게시판 타입을 저장할 변수
let currentBoardType = '';

// 로그아웃 함수
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    alert("로그아웃 되었습니다.");
    location.href = "loginjb.html";
}

// 게시판 변경 함수
async function changeBoard(boardType) {
    currentBoardType = boardType;
    
    // 활성화된 링크 스타일 변경
    document.querySelectorAll('.board-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.type === boardType) {
            link.classList.add('active');
        }
    });

    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    if (!token) {
        window.location.href = "loginjb.html";
        return;
    }

    try {
        // 해당 타입의 게시판 ID 가져오기
        const boardRes = await fetch(`/api/boards/type/${boardType}`, {
            headers: { "Authorization": "Bearer " + token }
        });
        const board = await boardRes.json();

        if (!board) {
            alert("게시판을 찾을 수 없습니다.");
            return;
        }

        // 게시판의 게시글 가져오기
        const postRes = await fetch(`/api/posts/board/${board.id}`, {
            headers: { "Authorization": "Bearer " + token }
        });
        const posts = await postRes.json();

        // 각 게시글의 좋아요 수 가져오기
        const postsWithLikes = await Promise.all(posts.map(async (post) => {
            try {
                const likeRes = await fetch(`/api/posts/${post.id}/like`, {
                    headers: { "Authorization": "Bearer " + token }
                });
                if (likeRes.ok) {
                    const likeStatus = await likeRes.json();
                    return {
                        ...post,
                        likeCount: likeStatus.likeCount
                    };
                }
            } catch (error) {
                console.error(`Error fetching likes for post ${post.id}:`, error);
            }
            return {
                ...post,
                likeCount: 0
            };
        }));

        // 게시글 목록 업데이트
        updatePostTable(postsWithLikes);

        // URL 업데이트
        const newUrl = `/boardHome.html?boardId=${board.id}&boardType=${boardType}`;
        window.history.pushState({}, '', newUrl);

    } catch (e) {
        console.error("오류 발생:", e);
        alert("게시글을 불러오는데 실패했습니다.");
    }
}

// 게시글 테이블 업데이트 함수
function updatePostTable(posts) {
    const tbody = document.getElementById("postTableBody");
    tbody.innerHTML = posts.map((post, idx) => `
        <tr onclick="location.href='postDetail.html?postId=${post.id}'">
            <td>${posts.length - idx}</td>
            <td>${post.anonymous ? '익명' : post.authorName}</td>
            <td>${post.title}</td>
            <td>${post.viewCount || 0}</td>
            <td>${post.likeCount || 0}</td>
            <td>${new Date(post.createdAt).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

// 글쓰기 페이지로 이동
function goToWritePost() {
    const urlParams = new URLSearchParams(window.location.search);
    const boardId = urlParams.get('boardId');
    const boardType = urlParams.get('boardType');
    
    if (!boardId || !boardType) {
        alert('게시판 정보를 찾을 수 없습니다.');
        return;
    }
    
    window.location.href = `writePost.html?boardId=${boardId}&boardType=${boardType}`;
}

// 페이지 로드 시 초기화
async function initializePage() {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    if (!token) {
        window.location.href = "loginjb.html";
        return;
    }

    // URL에서 boardId와 boardType 파라미터 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const boardId = urlParams.get('boardId');
    const boardType = urlParams.get('boardType');

    // 초기 게시판 타입 설정
    currentBoardType = boardType || 'FREE';
    
    // 초기 게시판 활성화
    document.querySelector(`.board-link[data-type="${currentBoardType}"]`)?.classList.add('active');

    try {
        const userRes = await fetch("/api/user/me", {
            headers: { "Authorization": "Bearer " + token }
        });
        const user = await userRes.json();

        document.getElementById("nickname").innerText = `${user.nickname}님`;
        if (user.university && user.university.name) {
            document.getElementById("universityName").innerText = `${user.university.name} 게시판입니다`;
        }

        // 게시판 ID가 있으면 해당 게시판의 게시글을, 없으면 기본 게시판(자유게시판)의 게시글을 가져옴
        const targetBoardId = boardId || (await fetch(`/api/boards/type/FREE`, {
            headers: { "Authorization": "Bearer " + token }
        }).then(res => res.json())).id;

        const postRes = await fetch(`/api/posts/board/${targetBoardId}`, {
            headers: { "Authorization": "Bearer " + token }
        });
        const posts = await postRes.json();

        updatePostTable(posts);

        // 게시판 타입에 따라 글쓰기 버튼 표시 여부 설정
        const writeButton = document.querySelector('.section-header button');
        writeButton.style.display = 'block';  // 모든 게시판에서 글쓰기 버튼 표시
    } catch (e) {
        console.error("오류 발생:", e);
        alert("게시글을 불러오는데 실패했습니다.");
    }
}

// 페이지 로드 시 초기화 함수 실행
window.onload = initializePage; 