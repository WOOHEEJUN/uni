document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
});

async function loadUsers() {
    try {
        const response = await fetch('/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('사용자 목록을 불러오는데 실패했습니다.');
        }
        
        const users = await response.json();
        console.log('Users data:', users); // 디버깅을 위한 로그
        displayUsers(users);
    } catch (error) {
        alert(error.message);
    }
}

function displayUsers(users) {
    const tbody = document.querySelector('#userTable tbody');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        // 대학교 정보 확인을 위한 로그
        console.log('User university info:', user.university);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.username}</td>
            <td>${user.nickname}</td>
            <td>${user.universityName || '-'}</td>
            <td>
                ${user.id ? `<div class="certificate-container">
                    <img src="/api/admin/uploads/${user.id}/certificate" 
                        class="certificate-image" 
                        onclick="showImage(this.src)" 
                        onerror="this.parentElement.innerHTML='-'"
                        alt="증명서">
                </div>` : '-'}
            </td>
            <td>${user.status}</td>
            <td>
                <select onchange="updateUserStatus(${user.id}, this.value)">
                    <option value="PENDING" ${user.status === 'PENDING' ? 'selected' : ''}>대기중</option>
                    <option value="APPROVED" ${user.status === 'APPROVED' ? 'selected' : ''}>승인</option>
                    <option value="REJECTED" ${user.status === 'REJECTED' ? 'selected' : ''}>거절</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function updateUserStatus(userId, status) {
    try {
        const response = await fetch(`/api/admin/users/${userId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ status })
        });
        
        if (!response.ok) {
            throw new Error('상태 업데이트에 실패했습니다.');
        }
        
        alert('상태가 업데이트되었습니다.');
        loadUsers();
    } catch (error) {
        alert(error.message);
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'loginjb.html';
}

// 이미지 모달 관련 함수들
function showImage(src) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    modal.style.display = "block";
    modalImg.src = src;
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = "none";
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
} 