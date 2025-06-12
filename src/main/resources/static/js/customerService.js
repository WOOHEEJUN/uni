function goHome() {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

    if (!token) {
        location.href = "noTokenUserIndex.html";
        return;
    }

    fetch("/api/user/me", {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
    })
    .then(user => {
        if (user.role === "ADMIN") {
            location.href = "admin.html";
        } else if (user.status === "APPROVED") {
            location.href = "userIndex.html";
        } else {
            location.href = "noTokenUserIndex.html";
        }
    })
    .catch(() => {
        location.href = "noTokenUserIndex.html";
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("logoLink").addEventListener("click", goHome);
}); 