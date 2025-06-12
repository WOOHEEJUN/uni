let stompClient = null;
let buildingId = null;
let nickname = null;
let university = null;
let roomId = null;

window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("로그인이 필요합니다.");
        location.href = "/loginjb.html";
        return;
    }

    fetch("/api/user/me", {
        headers: { "Authorization": "Bearer " + token }
    })
    .then(res => res.ok ? res.json() : Promise.reject("인증 실패"))
    .then(user => {
        nickname = user.nickname;
        university = user.universityName;
    })
    .catch(() => {
        alert("인증 실패. 다시 로그인해주세요.");
        location.href = "/loginjb.html";
    });
});

function slugify(text) {
    return text.replace(/\s+/g, '_').toLowerCase();
}

function joinChat() {
    buildingId = document.getElementById("building-select").value;

    if (!nickname || !university) {
        alert("사용자 정보가 준비되지 않았습니다.");
        return;
    }

    roomId = `${slugify(university)}_${buildingId}`;

    if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
            console.log("이전 WebSocket 연결 해제됨.");
            connectToRoom();
        });
    } else {
        connectToRoom();
    }
}

function connectToRoom() {
    const socket = new SockJS("/ws/chat");
    stompClient = Stomp.over(socket);
    const token = localStorage.getItem("token");

    // ✅ 메시지 초기화
    document.getElementById("chat-messages").innerHTML = "";

    stompClient.connect(
        { Authorization: "Bearer " + token },
        () => {
            stompClient.subscribe(`/topic/${roomId}`, (msg) => {
                const message = JSON.parse(msg.body);
                const div = document.createElement("div");
                div.textContent = `${message.sender}: ${message.content}`;
                const chatBox = document.getElementById("chat-messages");
                chatBox.appendChild(div);
                chatBox.scrollTop = chatBox.scrollHeight;
            });

            document.getElementById("chat-section").style.display = "block";

            stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify({
                sender: nickname,
                content: `${nickname}님이 입장하셨습니다.`,
                buildingId: roomId
            }));
        },
        (err) => {
            console.error("WebSocket 연결 실패:", err);
            alert("WebSocket 연결에 실패했습니다.");
        }
    );
}

function sendMessage() {
    const input = document.getElementById("chat-input");
    const content = input.value.trim();
    if (!content || !nickname || !stompClient || !roomId) return;

    stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify({
        sender: nickname,
        content: content,
        buildingId: roomId
    }));
    input.value = "";
}

function handleKey(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function logout() {
    localStorage.removeItem("token");
    alert("로그아웃 되었습니다.");
    location.href = "index.html";
} 