document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector(".searchInput"); // 검색창
    const table = document.querySelector(".pointLog_table");
    const tableRows = Array.from(document.querySelectorAll(".pointLog_table tbody tr")); // 테이블의 모든 행 가져오기
    const tableBody = table.querySelector("tbody");
    const headers = document.querySelectorAll(".pointLog_table thead th.sortable");
    const filterIcon = document.querySelector(".filterIcon"); // 필터 아이콘
    const filterPopup = document.querySelector(".filterPopup"); // 필터 팝업
    const resetFiltersButton = filterPopup.querySelector(".resetFilters");

    document.querySelectorAll('.main-row').forEach(row => {
        row.addEventListener('click', () => {
            const dropdown = row.nextElementSibling;

            // 드롭다운이 아닌 경우 무시
            if (!dropdown || !dropdown.classList.contains('dropdown-row')) return;

            const isOpen = dropdown.style.display === 'table-row';

            // 모든 드롭다운 닫기
            document.querySelectorAll('.dropdown-row').forEach(r => r.style.display = 'none');

            // 현재 클릭한 row만 토글
            if (!isOpen) {
                dropdown.style.display = 'table-row';
            }
        });
    });



    // 행 클릭 이벤트 추가
    tableRows.forEach(row => {
        row.addEventListener("click", function (event) {
            event.stopPropagation(); // 클릭 이벤트가 상위 요소로 전파되지 않도록 방지

            // 이미 선택된 행을 다시 클릭하면 선택 해제
            if (row.classList.contains("selected-row")) {
                row.classList.remove("selected-row");
            } else {
                // 다른 행의 선택 해제
                tableRows.forEach(r => r.classList.remove("selected-row"));
                // 현재 행에 선택 클래스 추가
                row.classList.add("selected-row");
            }
        });
    });

    // 테이블 외부 클릭 시 선택 해제
    document.addEventListener("click", function (event) {
        if (!table.contains(event.target)) {
            tableRows.forEach(row => row.classList.remove("selected-row"));
        }
    });

    // 필터 아이콘 클릭 이벤트
    filterIcon.addEventListener("click", function () {
        filterPopup.classList.toggle("hidden"); // 팝업 메뉴 표시/숨김
    });

    // 체크박스 선택 이벤트
    filterPopup.addEventListener("change", function () {
        const selectedGrades = Array.from(filterPopup.querySelectorAll("input[name='grade']:checked"))
            .map(checkbox => checkbox.value); // 선택된 학년 값 가져오기

        const selectedPoints = Array.from(filterPopup.querySelectorAll("input[name='point']:checked"))
            .map(checkbox => checkbox.value); // 선택된 상벌점 구분 가져오기

        const selectedPointRanges = Array.from(filterPopup.querySelectorAll("input[name='pointRange']:checked"))
            .map(checkbox => checkbox.value); // 선택된 상벌점 범위 가져오기

        tableRows.forEach(row => {
            const studentNumber = row.querySelector("td:nth-child(1)").textContent.trim(); // 학번 가져오기
            const totalPoints = parseInt(row.querySelector("td:nth-child(5)").textContent.trim(), 10); // 총 상벌점
            const grade = studentNumber.charAt(0) + "학년"; // 학번의 첫 번째 숫자로 학년 판별

            let isVisible = true;

            // 학년 필터 적용
            if (selectedGrades.length > 0 && !selectedGrades.includes(grade)) {
                isVisible = false;
            }

            // 상벌점 구분 필터 적용
            if (selectedPoints.length > 0) {
                if (selectedPoints.includes("상점") && totalPoints < 0) {
                    isVisible = false;
                }
                if (selectedPoints.includes("벌점") && totalPoints > 0) {
                    isVisible = false;
                }
            }

            // 상벌점 범위 필터 적용
            if (selectedPointRanges.length > 0) {
                const inRange = selectedPointRanges.some(range => {
                    // 정규식을 사용하여 범위를 분리
                    const match = range.match(/(-?\d+)-(-?\d+)/); // 음수와 양수를 모두 처리
                    if (!match) return false; // 범위가 잘못된 경우 false 반환

                    const min = parseInt(match[1], 10); // 최소값
                    const max = parseInt(match[2], 10); // 최대값

                    return totalPoints >= min && totalPoints <= max; // 범위 내에 있는지 확인
                });
                if (!inRange) {
                    isVisible = false;
                }
            }

            // 행 표시/숨김
            row.style.display = isVisible ? "" : "none";
        });
    });

    // 초기화 버튼 클릭 이벤트
    resetFiltersButton.addEventListener("click", function () {
        // 모든 체크박스 해제
        const checkboxes = filterPopup.querySelectorAll("input[type='checkbox']");
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // 테이블의 모든 행 표시
        tableRows.forEach(row => {
            row.style.display = ""; // 모든 행 표시
        });
    });

    // 팝업 외부 클릭 시 팝업 닫기
    document.addEventListener("click", function (event) {
        if (!filterPopup.contains(event.target) && !filterIcon.contains(event.target)) {
            filterPopup.classList.add("hidden");
        }
    });

    // 검색창에 입력 이벤트 추가
    searchInput.addEventListener("input", function () {
        const filter = searchInput.value.toLowerCase(); // 입력값을 소문자로 변환

        tableRows.forEach(row => {
            const cells = row.querySelectorAll("td:nth-child(1), td:nth-child(2), td:nth-child(3), td:nth-child(6)"); // 각 행의 셀 가져오기
            const rowText = Array.from(cells)
                .map(cell => cell.textContent.toLowerCase()) // 셀의 텍스트를 소문자로 변환
                .join(" "); // 셀의 텍스트를 합침

            // 입력값이 행의 텍스트에 포함되면 표시, 아니면 숨김
            if (rowText.includes(filter)) {
                row.style.display = ""; // 행 표시
            } else {
                row.style.display = "none"; // 행 숨기기
            }
        });
    });
    // 정렬 기능 추가
    headers.forEach(header => {
        header.addEventListener("click", function () {
            const columnIndex = header.getAttribute("data-column") - 1; // 열 인덱스 가져오기
            const isAscending = header.classList.contains("asc"); // 현재 정렬 상태 확인
            const direction = isAscending ? -1 : 1; // 정렬 방향 설정

            // 모든 헤더에서 정렬 클래스 제거
            headers.forEach(h => h.classList.remove("asc", "desc"));

            // 현재 헤더에 정렬 클래스 추가
            header.classList.add(isAscending ? "desc" : "asc");

            // 행 정렬
            const sortedRows = tableRows.sort((a, b) => {
                const aText = a.querySelectorAll("td")[columnIndex].textContent.trim();
                const bText = b.querySelectorAll("td")[columnIndex].textContent.trim();

                // 숫자 정렬 (총 상벌점)
                if (columnIndex === 4) { // 총 상벌점 열 (5번째 열, 0부터 시작하므로 4)
                    const aValue = parseFloat(aText.replace("+", "")); // "+" 제거 후 숫자로 변환
                    const bValue = parseFloat(bText.replace("+", ""));
                    return (aValue - bValue) * direction;
                }

                // 날짜 정렬 (마지막 활동)
                if (columnIndex === 3) { // 마지막 활동 열 (4번째 열)
                    return (new Date(aText) - new Date(bText)) * direction;
                }

                // 일반 텍스트 정렬
                return aText > bText ? direction : aText < bText ? -direction : 0;
            });

            // 정렬된 행을 테이블에 추가
            tableBody.innerHTML = "";
            sortedRows.forEach(row => tableBody.appendChild(row));
        });
    });
});

