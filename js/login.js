function NoMultiChk(chk) {
    var obj = document.getElementsByName("who-check");
    for (var i = 0; i < obj.length; i++) {
        if (obj[i] != chk) {
            obj[i].checked = false;
        }
    }
}

function OnSave() {
    var cob_check = document.querySelectorAll('input[name="who-check"]:checked').length;
    if (cob_check == 0) {
        alert('체크박스를 하나 이상 선택해주세요')
        return false;
    }
}

