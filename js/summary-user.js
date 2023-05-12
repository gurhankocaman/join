let currentUser = [];

function initSummary() {
    init(); // Sidebar and Header
    greetUser();
    getTime();
    
};

function greetUser() {
    let content = document.getElementById('user-greetings');
    content.innerHTML = '';
    content.innerHTML += getTime();
    console.log(currentUser);
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