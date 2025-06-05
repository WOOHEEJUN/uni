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

// HOT 게시물 로드
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
    
    hotPostsList.innerHTML = ""; // 기존 목록 초기화
    
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

// 시간표 미리보기 로드
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

// 미니 시간표 초기화
function initializeMiniTimetable(schedules) {
  const grid = document.getElementById("miniTimetableGrid");
  const days = ['', '월', '화', '수', '목', '금'];
  const hours = Array.from({length: 14}, (_, i) => i + 9); // 9시부터 22시까지

  // 요일 헤더 추가
  days.forEach(day => {
    const dayHeader = document.createElement("div");
    dayHeader.className = "mini-day-header";
    dayHeader.textContent = day;
    grid.appendChild(dayHeader);
  });

  // 시간대별 셀 추가
  hours.forEach(hour => {
    // 시간 표시
    const timeSlot = document.createElement("div");
    timeSlot.className = "mini-time-slot";
    timeSlot.textContent = `${hour}:00`;
    grid.appendChild(timeSlot);

    // 각 요일별 셀
    for (let i = 1; i <= 5; i++) {
      const cell = document.createElement("div");
      cell.className = "mini-time-slot";
      cell.dataset.day = i;
      cell.dataset.hour = hour;
      grid.appendChild(cell);
    }
  });

  // 일정 추가
  if (schedules && schedules.length > 0) {
    schedules.forEach(schedule => {
      addScheduleToMiniGrid(schedule);
    });
  }
}

// 일정을 미니 그리드에 추가
function addScheduleToMiniGrid(schedule) {
    const startTime = schedule.startTime.split(':');
    const endTime = schedule.endTime.split(':');
    const startHour = parseInt(startTime[0]);
    const startMinute = parseInt(startTime[1]);
    const endHour = parseInt(endTime[0]);
    const endMinute = parseInt(endTime[1]);
    const day = schedule.dayOfWeek; // 1:월, 2:화, ..., 5:금

    const grid = document.getElementById('miniTimetableGrid');
    const gridRect = grid.getBoundingClientRect();
    const cellHeight = 20; // CSS의 .mini-time-slot min-height와 일치
    const gridStartTimeHour = 9; // 시간표 시작 시간 (9시)

    // 스케줄 아이템 생성
    const scheduleItem = document.createElement('div');
    scheduleItem.className = 'mini-schedule-item';
    scheduleItem.style.backgroundColor = schedule.color;
    scheduleItem.textContent = schedule.title;

    // 그리드 내에서의 시작 시간 (분 단위, 9시 0분 기준)
    const startMinutesFromGridStart = (startHour - gridStartTimeHour) * 60 + startMinute;
    // 그리드 내에서의 종료 시간 (분 단위, 9시 0분 기준)
    const endMinutesFromGridStart = (endHour - gridStartTimeHour) * 60 + endMinute;
    
    const totalMinutes = endMinutesFromGridStart - startMinutesFromGridStart;

    // 위치 (top) 계산: (그리드 시작 시간으로부터의 분 / 30분) * (30분 슬롯 높이)
    const thirtyMinuteSlotHeight = cellHeight / 2; // 30분 슬롯의 높이 (10px)
    let topPosition = (startMinutesFromGridStart / 30) * thirtyMinuteSlotHeight;

    // 시간 슬롯 영역의 시작 오프셋을 더함
    const firstTimeSlot = document.querySelector(`.mini-time-slot[data-hour="${gridStartTimeHour}"]`);
    if (firstTimeSlot) {
        topPosition += firstTimeSlot.offsetTop;
    } else {
        console.error(`Could not find the first mini time slot cell for hour ${gridStartTimeHour}`);
        return; // 첫 시간 슬롯을 찾지 못하면 스케줄을 추가하지 않음
    }

    scheduleItem.style.top = `${topPosition}px`;

    // 높이 (height) 계산: (총 시간 / 30분) * (30분 슬롯 높이)
    const height = (totalMinutes / 30) * thirtyMinuteSlotHeight;
    // 높이가 음수 또는 0이면 표시하지 않음
    if (height <= 0) return;
    scheduleItem.style.height = `${height}px`;

    // 요일에 따른 위치 (left)와 너비 (width) 계산
    // 해당 요일 헤더 셀을 기준으로 위치와 너비 계산
    // 요일 헤더는 그리드 레이아웃에 직접적인 영향을 받으므로 offsetLeft를 사용
    const dayHeaderCell = document.querySelector(`.mini-day-header:nth-child(${day + 1})`); // 요일 헤더는 시간 헤더(1번째) 다음부터 시작 (2:월, 3:화, ... 6:금)

    if (dayHeaderCell) {
        scheduleItem.style.left = `${dayHeaderCell.offsetLeft}px`;
        scheduleItem.style.width = `${dayHeaderCell.offsetWidth}px`;
    } else {
         console.error(`Could not find mini day header cell for day ${day}`);
         return; // 해당 셀을 찾지 못하면 스케줄을 추가하지 않음
    }

    // 그리드에 스케줄 아이템 직접 추가 (절대 위치 사용)
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