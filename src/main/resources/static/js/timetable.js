// 시간표 초기화
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('로그인이 필요합니다.');
        window.location.href = 'loginjb.html';
        return;
    }

    initializeTimetable();
    loadSchedules();
    setupTimeInputs();
});

// 시간 입력 필드 설정
function setupTimeInputs() {
    const startHour = document.getElementById('startHour');
    const startMinute = document.getElementById('startMinute');
    const endHour = document.getElementById('endHour');
    const endMinute = document.getElementById('endMinute');

    // 시작 시간 변경 시
    function updateStartTime() {
        if (startHour.value && startMinute.value) {
            const startTime = `${startHour.value}:${startMinute.value}`;
            
            // 종료 시간이 시작 시간보다 이전이면 종료 시간 업데이트
            if (endHour.value && endMinute.value) {
                const endTime = `${endHour.value}:${endMinute.value}`;
                if (endTime <= startTime) {
                    endHour.value = startHour.value;
                    endMinute.value = startMinute.value;
                }
            }
        }
    }

    // 종료 시간 변경 시
    function updateEndTime() {
        if (endHour.value && endMinute.value) {
            const endTime = `${endHour.value}:${endMinute.value}`;
            
            // 시작 시간이 종료 시간보다 이후면 시작 시간 업데이트
            if (startHour.value && startMinute.value) {
                const startTime = `${startHour.value}:${startMinute.value}`;
                if (startTime >= endTime) {
                    startHour.value = endHour.value;
                    startMinute.value = endMinute.value;
                }
            }
        }
    }

    startHour.addEventListener('change', updateStartTime);
    startMinute.addEventListener('change', updateStartTime);
    endHour.addEventListener('change', updateEndTime);
    endMinute.addEventListener('change', updateEndTime);
}

// 시간표 그리드 초기화
function initializeTimetable() {
    const grid = document.getElementById('timetableGrid');
    const days = ['', '월', '화', '수', '목', '금'];
    const hours = Array.from({length: 14}, (_, i) => i + 9); // 9시부터 22시까지

    // 요일 헤더 추가
    days.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = day;
        grid.appendChild(dayHeader);
    });

    // 시간대별 셀 추가
    hours.forEach(hour => {
        // 시간 표시
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.textContent = `${hour}:00`;
        grid.appendChild(timeSlot);

        // 각 요일별 셀
        for (let i = 1; i <= 5; i++) {
            const cell = document.createElement('div');
            cell.className = 'time-slot';
            cell.dataset.day = i;
            cell.dataset.hour = hour;
            grid.appendChild(cell);
        }
    });
}

// 일정 불러오기
async function loadSchedules() {
    try {
        const response = await fetch('/api/schedules', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '일정을 불러오는데 실패했습니다.');
        }

        const schedules = await response.json();
        schedules.forEach(schedule => {
            addScheduleToGrid(schedule);
        });
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
}

// 일정을 그리드에 추가
function addScheduleToGrid(schedule) {
    const startTime = schedule.startTime.split(':');
    const endTime = schedule.endTime.split(':');
    const startHour = parseInt(startTime[0]);
    const startMinute = parseInt(startTime[1]);
    const endHour = parseInt(endTime[0]);
    const endMinute = parseInt(endTime[1]);
    const day = schedule.dayOfWeek; // 1:월, 2:화, ..., 5:금

    const grid = document.getElementById('timetableGrid');
    const gridRect = grid.getBoundingClientRect();
    const cellHeight = 60; // CSS의 .time-slot min-height와 일치
    const gridStartTimeHour = 9; // 시간표 시작 시간 (9시)

    // 스케줄 아이템 생성
    const scheduleItem = document.createElement('div');
    scheduleItem.className = 'schedule-item';
    scheduleItem.style.backgroundColor = schedule.color;
    scheduleItem.textContent = schedule.title;

    // 그리드 내에서의 시작 시간 (분 단위, 9시 0분 기준)
    const startMinutesFromGridStart = (startHour - gridStartTimeHour) * 60 + startMinute;
    // 그리드 내에서의 종료 시간 (분 단위, 9시 0분 기준)
    const endMinutesFromGridStart = (endHour - gridStartTimeHour) * 60 + endMinute;
    
    const totalMinutes = endMinutesFromGridStart - startMinutesFromGridStart;

    // 위치 (top) 계산: (그리드 시작 시간으로부터의 분 / 30분) * (30분 슬롯 높이)
    const thirtyMinuteSlotHeight = cellHeight / 2; // 30분 슬롯의 높이 (30px)
    let topPosition = (startMinutesFromGridStart / 30) * thirtyMinuteSlotHeight;

    // 시간 슬롯 영역의 시작 오프셋을 더함
    const firstTimeSlot = document.querySelector(`.time-slot[data-hour="${gridStartTimeHour}"]`);
    if (firstTimeSlot) {
        topPosition += firstTimeSlot.offsetTop;
    } else {
        console.error(`Could not find the first time slot cell for hour ${gridStartTimeHour}`);
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
    const dayHeaderCell = document.querySelector(`.day-header:nth-child(${day + 1})`); // 요일 헤더는 시간 헤더(1번째) 다음부터 시작 (2:월, 3:화, ... 6:금)

    if (dayHeaderCell) {
        scheduleItem.style.left = `${dayHeaderCell.offsetLeft}px`;
        scheduleItem.style.width = `${dayHeaderCell.offsetWidth}px`;
    } else {
         console.error(`Could not find day header cell for day ${day}`);
         return; // 해당 셀을 찾지 못하면 스케줄을 추가하지 않음
    }

    // 그리드에 스케줄 아이템 직접 추가 (절대 위치 사용)
    grid.appendChild(scheduleItem);
}

// 모달 열기
function openModal() {
    document.getElementById('scheduleModal').style.display = 'block';
}

// 모달 닫기
function closeModal() {
    document.getElementById('scheduleModal').style.display = 'none';
}

// 일정 추가 폼 제출
document.getElementById('scheduleForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const startHour = document.getElementById('startHour').value;
    const startMinute = document.getElementById('startMinute').value;
    const endHour = document.getElementById('endHour').value;
    const endMinute = document.getElementById('endMinute').value;

    if (!startHour || !startMinute || !endHour || !endMinute) {
        alert('시작 시간과 종료 시간을 모두 선택해주세요.');
        return;
    }

    const startTime = `${startHour}:${startMinute}`;
    const endTime = `${endHour}:${endMinute}`;

    // 시작 시간이 종료 시간보다 늦은 경우
    if (startTime >= endTime) {
        alert('종료 시간은 시작 시간보다 늦어야 합니다.');
        return;
    }

    const schedule = {
        title: document.getElementById('title').value,
        dayOfWeek: parseInt(document.getElementById('day').value),
        startTime: startTime,
        endTime: endTime,
        color: document.getElementById('color').value
    };

    try {
        const response = await fetch('/api/schedules', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(schedule)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '일정 추가에 실패했습니다.');
        }

        // 성공 시 시간표 새로고침
        document.getElementById('timetableGrid').innerHTML = '';
        initializeTimetable();
        loadSchedules();
        closeModal();
        e.target.reset();
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
}); 