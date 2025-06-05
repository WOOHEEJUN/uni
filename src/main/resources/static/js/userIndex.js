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
      console.warn("승인되지 않은 사용자입니다. 리디렉션 중...");
      window.location.href = "notokenuserindex.html";
      return;
    }

    currentUser = user;
    console.log("현재 로그인한 사용자 정보:", user);
    document.querySelector("#userGreeting").innerText = user.nickname + "님 안녕하세요!";
    if (user.universityName) {
      document.querySelector("#universityName").innerText = `🏫 ${user.universityName}`;
    }
    // 사용자 정보를 가져온 후 게시판 목록과 HOT 게시물, 시간표 미리보기 로드
    loadUniversityBoards();
    if (user.universityId) {
      console.log("대학교 ID로 HOT 게시물 로드 시작:", user.universityId);
      loadHotPosts(user.universityId);
    } else {
      console.error("대학교 ID가 없습니다.");
    }
    loadTimetablePreview(); // 시간표 미리보기 로드 추가
  })
  .catch(err => {
    console.error("사용자 정보 불러오기 실패:", err);
    document.querySelector("#userGreeting").innerText = "로그인이 필요합니다.";
    window.location.href = "loginjb.html";
  });
});

function loadUniversityBoards() {
  console.log("게시판 목록 로드 시작...");
  fetch("/api/boards/my-university", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
  .then(response => {
    if (!response.ok) throw new Error("게시판 목록을 가져오는데 실패했습니다.");
    return response.json();
  })
  .then(boards => {
    console.log("가져온 게시판 목록:", boards);
    const boardList = document.getElementById("boardList");
    boardList.innerHTML = ""; // 기존 목록 초기화

    boards.forEach(board => {
      console.log("게시판 정보:", board);
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `/boardHome.html?boardId=${board.id}&boardType=${board.type}`;
      a.textContent = board.name;
      li.appendChild(a);
      boardList.appendChild(li);
    });
  })
  .catch(err => {
    console.error("게시판 목록 로드 실패:", err);
    const boardList = document.getElementById("boardList");
    boardList.innerHTML = "<li>게시판을 불러오는데 실패했습니다.</li>";
  });
}

function loadHotPosts(universityId) {
  console.log("HOT 게시물 로드 시작...", universityId);
  if (!universityId) {
    console.error("universityId가 없습니다.");
    const hotPostsList = document.getElementById("hotPostsList");
    if (hotPostsList) {
      hotPostsList.innerHTML = "<li>대학교 정보가 없어 HOT 게시물을 불러올 수 없습니다.</li>";
    }
    return;
  }

  fetch(`/api/posts/hot/${universityId}`, {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
  .then(response => {
    console.log("서버 응답 상태:", response.status);
    if (!response.ok) {
      throw new Error(`HOT 게시물을 가져오는데 실패했습니다. (${response.status})`);
    }
    return response.json();
  })
  .then(posts => {
    console.log("가져온 HOT 게시물:", posts);
    const hotPostsList = document.getElementById("hotPostsList");
    if (!hotPostsList) {
      console.error("hotPostsList 요소를 찾을 수 없습니다.");
      return;
    }

    hotPostsList.innerHTML = "";

    if (!posts || posts.length === 0) {
      hotPostsList.innerHTML = "<li>아직 HOT 게시물이 없습니다. 첫 번째 게시물을 작성해보세요!</li>";
      return;
    }

    posts.forEach((post, index) => {
      console.log(`게시물 ${index + 1} 처리:`, post);
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `postDetail.html?postId=${post.id}`;
      a.textContent = `🔥 ${post.title}`;
      li.appendChild(a);
      hotPostsList.appendChild(li);
    });
  })
  .catch(err => {
    console.error("HOT 게시물 로드 실패:", err);
    const hotPostsList = document.getElementById("hotPostsList");
    if (hotPostsList) {
      hotPostsList.innerHTML = "<li>HOT 게시물을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.</li>";
    }
  });
}

function loadTimetablePreview() {
  console.log("시간표 미리보기 로드 시작...");
  fetch("/api/schedules", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
  .then(response => {
    if (!response.ok) throw new Error("시간표를 불러오는데 실패했습니다.");
    return response.json();
  })
  .then(schedules => {
    console.log("가져온 일정:", schedules);
    initializeMiniTimetable(schedules);
  })
  .catch(err => {
    console.error("시간표 미리보기 로드 실패:", err);
    const timetablePreview = document.getElementById("timetablePreview");
    timetablePreview.innerHTML = "<p>시간표를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.</p>";
  });
}

function initializeMiniTimetable(schedules) {
  const grid = document.getElementById("miniTimetableGrid");
  const days = ['', '월', '화', '수', '목', '금'];
  const hours = Array.from({length: 14}, (_, i) => i + 9);

  days.forEach(day => {
    const dayHeader = document.createElement("div");
    dayHeader.className = "mini-day-header";
    dayHeader.textContent = day;
    grid.appendChild(dayHeader);
  });

  hours.forEach(hour => {
    const timeSlot = document.createElement("div");
    timeSlot.className = "mini-time-slot";
    timeSlot.textContent = `${hour}:00`;
    grid.appendChild(timeSlot);

    for (let i = 1; i <= 5; i++) {
      const cell = document.createElement("div");
      cell.className = "mini-time-slot";
      cell.dataset.day = i;
      cell.dataset.hour = hour;
      grid.appendChild(cell);
    }
  });

  if (schedules && schedules.length > 0) {
    schedules.forEach(schedule => {
      addScheduleToMiniGrid(schedule);
    });
  }
}

function addScheduleToMiniGrid(schedule) {
  const startTime = schedule.startTime.split(':');
  const endTime = schedule.endTime.split(':');
  const startHour = parseInt(startTime[0]);
  const startMinute = parseInt(startTime[1]);
  const endHour = parseInt(endTime[0]);
  const endMinute = parseInt(endTime[1]);
  const day = schedule.dayOfWeek;

  const grid = document.getElementById('miniTimetableGrid');
  const gridRect = grid.getBoundingClientRect();
  const cellHeight = 20;
  const gridStartTimeHour = 9;

  const scheduleItem = document.createElement('div');
  scheduleItem.className = 'mini-schedule-item';
  scheduleItem.style.backgroundColor = schedule.color;
  scheduleItem.textContent = schedule.title;

  const startMinutesFromGridStart = (startHour - gridStartTimeHour) * 60 + startMinute;
  const endMinutesFromGridStart = (endHour - gridStartTimeHour) * 60 + endMinute;
  const totalMinutes = endMinutesFromGridStart - startMinutesFromGridStart;

  const thirtyMinuteSlotHeight = cellHeight / 2;
  let topPosition = (startMinutesFromGridStart / 30) * thirtyMinuteSlotHeight;

  const firstTimeSlot = document.querySelector(`.mini-time-slot[data-hour="${gridStartTimeHour}"]`);
  if (firstTimeSlot) {
    topPosition += firstTimeSlot.offsetTop;
  } else {
    console.error(`Could not find the first mini time slot cell for hour ${gridStartTimeHour}`);
    return;
  }

  scheduleItem.style.top = `${topPosition}px`;
  const height = (totalMinutes / 30) * thirtyMinuteSlotHeight;
  if (height <= 0) return;
  scheduleItem.style.height = `${height}px`;

  const dayHeaderCell = document.querySelector(`.mini-day-header:nth-child(${day + 1})`);
  if (dayHeaderCell) {
    scheduleItem.style.left = `${dayHeaderCell.offsetLeft}px`;
    scheduleItem.style.width = `${dayHeaderCell.offsetWidth}px`;
  } else {
    console.error(`Could not find mini day header cell for day ${day}`);
    return;
  }

  grid.appendChild(scheduleItem);
}

function logout() {
  localStorage.removeItem("token");
  alert("로그아웃 되었습니다.");
  window.location.href = "loginjb.html";
}

function goChat() {
  window.location.href = "chat.html";
}
