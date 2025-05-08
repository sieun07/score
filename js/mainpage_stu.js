document.addEventListener("DOMContentLoaded", function () {
    const rows = document.querySelectorAll(".log tbody tr");
    rows.forEach((row, index) => {
        if (index >= 9) {
            row.style.display = "none"; // 8번째 이후 데이터 숨김
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const rows = document.querySelectorAll(".community tbody tr");
    rows.forEach((row, index) => {
        if (index >= 11) {
            row.style.display = "none"; // 8번째 이후 데이터 숨김
        }
    });
});