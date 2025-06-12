let stompClient = null;
let anonymousName = "익명";
let roomId = "anonymous";

function getUniversityNameFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.universityName;
    } catch (e) {
        console.error("토큰 파싱 실패:", e);
        return null;
    }
}

function generateAnonymousName() {
    const saved = localStorage.getItem("anonymousName");
    if (saved) {
        anonymousName = saved;
    } else {
        const randomNum = Math.floor(Math.random() * 900) + 100;
        anonymousName = `익명${randomNum}`;
        localStorage.setItem("anonymousName", anonymousName);
    }
}

function connect() {
    generateAnonymousName();
    const university = getUniversityNameFromToken();
    if (university) {
        roomId = `${university}_anonymous`;
    }

    const socket = new SockJS("/ws/chat");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
        stompClient.subscribe(`/topic/${roomId}`, (msg) => {
            const message = JSON.parse(msg.body);
            const div = document.createElement("div");
            div.textContent = `${message.sender}: ${message.content}`;
            const chatBox = document.getElementById("chat-box");
            chatBox.appendChild(div);
            chatBox.scrollTop = chatBox.scrollHeight;
        });

        stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify({
            sender: anonymousName,
            content: `${anonymousName}님이 입장하셨습니다.`,
            buildingId: roomId
        }));
    });
}

function sendMessage() {
    const input = document.getElementById("message");
    const content = input.value.trim();
    if (!content || !stompClient) return;

    stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify({
        sender: anonymousName,
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

window.onload = connect; 