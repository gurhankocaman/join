function initSummary() {
    init(); // Sidebar and Header
    currentUser();
    greetUser();
    getTime();

};


function greetUser() {
    let username = document.getElementById('user-name');
    username.innerHTML = '';
    username.innerHTML += currentUser();
    let message = document.getElementById('user-greetings');
    message.innerHTML = '';
    message.innerHTML += getTime();
   
    
}


function currentUser() {
    let params = new URLSearchParams(window.location.search);
    let username = params.get('username');
    return username;
}


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