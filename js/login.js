let users = [{
    'name': 'Testuser',
    'email': 'test@test.de',
    'password': 'test123'
}];

// Login 
function login() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    // filters Array users for email and password match
    let user = users.find(currentUser => currentUser.email == email.value && currentUser.password == password.value);

    if (user) {
        window.location.href = ('summary-user.html');
    } else {
        errorMessage();
    }

    email.value = '';
    password.value = '';
}

// shows message if email or password is wrong
function errorMessage() {
    let content = document.getElementById('feedback-container');
    content.innerHTML = '';
    content.innerHTML += `
        <div>Wrong email or password. Please try again.</div>
    `;
}

// Register User
function newUser() {
    let name = document.getElementById('signup-name');
    let email = document.getElementById('signup-email');
    let password = document.getElementById('signup-password');
    users.push({name: name.value, email: email.value, password: password.value});
    closeSignUpForm();
    successMessage();
}

// shows message if registration was succesfull
function successMessage() {
    let content = document.getElementById('feedback-container');
    content.innerHTML = '';
    content.innerHTML += `
        <div>Your registration was successful. You can log in now.</div>
    `;
}


function openSignUpForm() {
    document.getElementById('login-container').classList.add('d-none');
    document.getElementById('login-header-right').classList.add('d-none');
    document.getElementById('signup-container').classList.remove('d-none');
}


function closeSignUpForm() {
    document.getElementById('signup-container').classList.add('d-none');
    document.getElementById('login-container').classList.remove('d-none');
    document.getElementById('login-header-right').classList.remove('d-none');
}

// Reset Password
function openForgotPasswordForm() {
    document.getElementById('login-container').classList.add('d-none');
    document.getElementById('login-header-right').classList.add('d-none');
    document.getElementById('forgot-password-container').classList.remove('d-none');
}


function closeForgotPasswordForm() {
    document.getElementById('forgot-password-container').classList.add('d-none');
    document.getElementById('login-container').classList.remove('d-none');
    document.getElementById('login-header-right').classList.remove('d-none');
}


function resetPassword() {
    alert('Under construction');
}