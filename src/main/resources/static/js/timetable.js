// 시간표 초기화
// 반응형 시간표 JS

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

    document.getElementById('scheduleForm').onsubmit = handleScheduleFormSubmit;

    // ✅ 창 크기 변경 시 시간표 다시 그림
    window.addEventListener('resize', () => {
        initializeTimetable();
        loadSchedules();
    });
});

function setupTimeInputs() {
    const startHour = document.getElementById('startHour');
    const startMinute = document.getElementById('startMinute');
    const endHour = document.getElementById('endHour');
    const endMinute = document.getElementById('endMinute');

    function updateStartTime() {
        if (startHour.value && startMinute.value) {
            const startTime = `${startHour.value}:${startMinute.value}`;
            if (endHour.value && endMinute.value) {
                const endTime = `${endHour.value}:${endMinute.value}`;
                if (endTime <= startTime) {
                    endHour.value = startHour.value;
                    endMinute.value = startMinute.value;
                }
            }
        }
    }

    function updateEndTime() {
        if (endHour.value && endMinute.value) {
            const endTime = `${endHour.value}:${endMinute.value}`;
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

function initializeTimetable() {
    const grid = document.getElementById('timetableGrid');
    grid.innerHTML = ''; // ✅ 기존 내용 초기화

    const days = ['', '월', '화', '수', '목', '금'];
    const hours = Array.from({ length: 14 }, (_, i) => i + 9);

    days.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = day;
        grid.appendChild(dayHeader);
    });

    hours.forEach(hour => {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.textContent = `${hour}:00`;
        timeSlot.dataset.hour = hour;
        grid.appendChild(timeSlot);

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
        // 기존 일정을 모두 지우고 다시 그림
        document.getElementById('timetableGrid').querySelectorAll('.schedule-item').forEach(item => item.remove());
        schedules.forEach(schedule => {
            addScheduleToGrid(schedule);
        });
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
}

// 일정을 그리드에 추가 (또는 업데이트)
function addScheduleToGrid(schedule) {
    // 기존에 동일한 ID를 가진 일정이 있는지 확인하고 제거
    const existingItem = document.querySelector(`.schedule-item[data-id="${schedule.id}"]`);
    if (existingItem) {
        existingItem.remove();
    }

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
    scheduleItem.dataset.id = schedule.id; // 스케줄 ID 저장

    // 스케줄 제목과 액션 버튼을 포함하는 컨테이너
    const titleSpan = document.createElement('span');
    titleSpan.className = 'schedule-title';
    titleSpan.textContent = schedule.title;

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'schedule-actions';

    // 수정 버튼
    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn';
    editBtn.textContent = '수정';
    editBtn.onclick = (e) => {
        e.stopPropagation();
        openEditModal(schedule);
    };

    // 삭제 버튼
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn';
    deleteBtn.textContent = '삭제';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        if (confirm('이 일정을 삭제하시겠습니까?')) {
            deleteSchedule(schedule.id);
        }
    };

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);
    scheduleItem.appendChild(titleSpan);
    scheduleItem.appendChild(actionsDiv);

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
        topPosition += firstTimeSlot.offsetTop; // 상대 위치에 오프셋 더함
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

// 일정 삭제 함수
async function deleteSchedule(scheduleId) {
    try {
        const response = await fetch(`/api/schedules/${scheduleId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('일정 삭제에 실패했습니다.');
        }

        // 성공 시 시간표 새로고침
        // document.getElementById('timetableGrid').innerHTML = '';
        // initializeTimetable();
        loadSchedules(); // loadSchedules 함수 내에서 기존 일정 삭제 후 새로 그림
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
}

// 모달 상태 관리를 위한 변수
let currentScheduleId = null; // 현재 수정 중인 일정의 ID

// 수정 모달 열기
function openEditModal(schedule) {
    const modal = document.getElementById('scheduleModal');
    const form = document.getElementById('scheduleForm');
    const modalTitle = modal.querySelector('h2');

    modalTitle.textContent = '일정 수정'; // 모달 제목 변경
    currentScheduleId = schedule.id; // 수정 모드로 설정하고 ID 저장

    // 폼 필드 채우기
    document.getElementById('title').value = schedule.title;
    document.getElementById('day').value = schedule.dayOfWeek;

    const [startHour, startMinute] = schedule.startTime.split(':');
    document.getElementById('startHour').value = startHour;
    document.getElementById('startMinute').value = startMinute;

    const [endHour, endMinute] = schedule.endTime.split(':');
    document.getElementById('endHour').value = endHour;
    document.getElementById('endMinute').value = endMinute;

    document.getElementById('color').value = schedule.color;

    modal.style.display = 'block';
}

// 모달 닫을 때 폼 초기화 및 상태 초기화
function closeModal() {
    const modal = document.getElementById('scheduleModal');
    const form = document.getElementById('scheduleForm');
    const modalTitle = modal.querySelector('h2');

    form.reset();
    modalTitle.textContent = '일정 추가'; // 모달 제목 원래대로 복구
    currentScheduleId = null; // 상태 초기화

    modal.style.display = 'none';
}

// 모달 열기 (추가 모드)
function openModal() {
    const modal = document.getElementById('scheduleModal');
    const modalTitle = modal.querySelector('h2');

    modalTitle.textContent = '일정 추가'; // 모달 제목 설정
    currentScheduleId = null; // 추가 모드로 설정

    document.getElementById('scheduleModal').style.display = 'block';
}

// 일정 추가/수정 폼 제출 처리
async function handleScheduleFormSubmit(e) {
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

    const scheduleData = {
        title: document.getElementById('title').value,
        dayOfWeek: parseInt(document.getElementById('day').value),
        startTime: startTime,
        endTime: endTime,
        color: document.getElementById('color').value
    };

    let apiUrl = '/api/schedules';
    let httpMethod = 'POST';

    // 수정 모드인 경우 URL과 메소드 변경
    if (currentScheduleId !== null) {
        apiUrl = `/api/schedules/${currentScheduleId}`;
        httpMethod = 'PUT';
        scheduleData.id = currentScheduleId; // 수정 시 ID 포함
    }

    console.log('Sending schedule data:', scheduleData); // TODO: 디버깅 로그 추가

    try {
        const response = await fetch(apiUrl, {
            method: httpMethod,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(scheduleData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `${currentScheduleId ? '일정 수정' : '일정 추가'}에 실패했습니다.`);
        }

        // 성공 시 시간표 새로고침
        // document.getElementById('timetableGrid').innerHTML = '';
        // initializeTimetable();
        loadSchedules(); // loadSchedules 함수 내에서 기존 일정 삭제 후 새로 그림
        closeModal();
        e.target.reset();
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
} 