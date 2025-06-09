let currentUser = null;

window.addEventListener("DOMContentLoaded", () => {
  fetch("/api/user/me", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
    .then(response => {
      if (!response.ok) throw new Error("인증 실패");
      return response.json();
    })
    .then(user => {
      if ((user.status || "").toUpperCase() !== "APPROVED") {
        window.location.href = "notokenuserindex.html";
        return;
      }
      currentUser = user;
      document.querySelector("#userGreeting").innerText = `${user.nickname}님 안녕하세요!`;
      if (user.universityName) {
        document.querySelector("#universityName").innerText = `학교 ${user.universityName}`;
      }
      loadUniversityBoards();
      if (user.universityId) loadHotPosts(user.universityId);
      loadTimetablePreview();
    })
    .catch(() => {
      window.location.href = "loginjb.html";
    });
});

function loadUniversityBoards() {
  fetch("/api/boards/my-university", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
    .then(response => response.json())
    .then(boards => {
      const boardList = document.getElementById("boardList");
      boardList.innerHTML = "";
      boards.forEach(board => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `/boardHome.html?boardId=${board.id}&boardType=${board.type}`;
        a.textContent = board.name;
        li.appendChild(a);
        boardList.appendChild(li);
      });
    });
}

function loadHotPosts(universityId) {
  fetch(`/api/posts/hot/${universityId}`, {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
    .then(response => response.json())
    .then(posts => {
      const hotPostsList = document.getElementById("hotPostsList");
      hotPostsList.innerHTML = "";
      if (!posts.length) {
        hotPostsList.innerHTML = "<li>아직 HOT 게시물이 없습니다.</li>";
        return;
      }
      posts.forEach(post => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `postDetail.html?postId=${post.id}`;
        a.textContent = `🔥 ${post.title}`;
        li.appendChild(a);
        hotPostsList.appendChild(li);
      });
    });
}

function loadTimetablePreview() {
  fetch("/api/schedules", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
    .then(response => response.json())
    .then(schedules => renderMiniTimetable(schedules));
}

function renderMiniTimetable(schedules) {
  // 일정 렌더링
  requestAnimationFrame(() => {
    schedules.forEach(schedule => {
      const [startHour, startMinute] = schedule.startTime.split(":").map(Number);
      const [endHour, endMinute] = schedule.endTime.split(":").map(Number);
      const totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);

      const day = typeof schedule.dayOfWeek === "string"
        ? { "월": 1, "화": 2, "수": 3, "목": 4, "금": 5 }[schedule.dayOfWeek]
        : schedule.dayOfWeek;

      const cell = document.querySelector(`.mini-day-column[data-day="${day}"][data-hour="${startHour}"]`);
      if (!cell) return;

      const slotHeight = cell.offsetHeight;
      const minuteHeight = slotHeight / 60;
      const offsetTop = startMinute * minuteHeight;
      const blockHeight = totalMinutes * minuteHeight;

      const item = document.createElement("div");
      item.className = "mini-schedule-item";
      item.textContent = schedule.title;
      item.style.backgroundColor = schedule.color || "#4285F4";
      item.style.position = "absolute";
      item.style.top = `${offsetTop}px`;
      item.style.left = "0";
      item.style.right = "0";
      item.style.height = `${blockHeight}px`;

      cell.appendChild(item);
    });
  });
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "loginjb.html";
}

function goChat() {
  window.location.href = "chat.html";
}

window.addEventListener("resize", () => {
  if (currentUser) loadTimetablePreview();
});