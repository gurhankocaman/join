function showLogoutMobile(){
    document.getElementById('popUpMobile').classList.remove('d-none');
}

function closePopupMobile(){
    document.getElementById('popUpMobile').classList.add('d-none');
}

function notCloseMobile(event) {
    event.stopPropagation();
}