function initSummary() {
    init(); // Sidebar and Header
    getUsername();
    getTime();
    greetUser();
};


function greetUser() {
    document.getElementById('user-greetings').innerHTML = '';
    document.getElementById('user-name').innerHTML = '';

    if (getUsername()) {
        document.getElementById('user-greetings').innerHTML += `<div>${getTime()}</div>`;
        document.getElementById('user-name').innerHTML += `<div>${getUsername()}</div>`;
    } else {
        document.getElementById('user-greetings').innerHTML += `<div>${getTime().slice(0, -1)}</div>`;
    }
}

// load current user from local storage
function getUsername() {
    let userAsText = localStorage.getItem('currentUser');

    if (userAsText) {
        user = JSON.parse(userAsText);
        username = user['name'];
        return username;
    }

}

// get current time for greetings message
function getTime() {
    const time = new Date();
    let userGreetings;

    let hour = time.getHours();
    if (hour >= 5 && hour <= 12) {
        userGreetings = 'Good morning,';
    }
    if (hour >= 14 && hour <= 18) {
        userGreetings = 'Good afternoon,';
    }
    if (hour >= 18 && hour <= 23) {
        userGreetings = 'Good evening,';
    }

    return userGreetings;
}