async function initLogin() {
    loadUsers();
    rememberUser();
}

async function loadUsers() {
    users = JSON.parse(await getItem('users'));
}

// Login 
function login() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    // check radio button, when checked returns true
    let rememberUser = document.getElementById('remember-me-checkbox').checked;

    // filters array users for email and password match
    let user = users.find(currentUser => currentUser.email == email.value && currentUser.password == password.value);

    if (user) {
        // save user in local storage
        let userAsText = JSON.stringify(user);
        localStorage.setItem('currentUser', userAsText);

        // save remember me button status in local storage
        let rememberUserAsText = JSON.stringify(rememberUser);
        localStorage.setItem('rememberUser', rememberUserAsText);

        //redirect to next page
        window.location.href = 'summary-user.html';

    } else {
        loginError();
    }

    email.value = '';
    password.value = '';
}

// function that checks if remember button was activated while logging in
async function rememberUser() {
    let rememberUserAsText = localStorage.getItem('rememberUser');

    // checks if remember user has a value
    if (rememberUserAsText) {
        remember = JSON.parse(rememberUserAsText);

        // get current user
        let userAsText = localStorage.getItem('currentUser');
        if (userAsText) {
            user = JSON.parse(userAsText);
            username = user['email'];
            password = user['password'];
        }

        // get login status and return email-address
        if (remember === true) {
            document.getElementById('email').value = `${username}`;
            document.getElementById('password').value = `${password}`;
        }
    }
}

// shows message if email or password is wrong
function loginError() {
    let content = document.getElementById('feedback-container');
    content.innerHTML = '';
    content.innerHTML += `
        <div class="danger-text">Wrong email or password. Please try again.</div>
    `;
}

function guestLogin() {
    localStorage.setItem('currentUser', '');
    window.location.href = 'summary-user.html';
}

// Register User
function newUser() {
    let name = document.getElementById('signup-name').value;
    let email = document.getElementById('signup-email').value;
    let password = document.getElementById('signup-password').value;
    matchEmail(name, email, password);
}

// Checks if Email is already in use
function matchEmail(name, email, password) {
    let found = false;

    for (let i = 0; i < users.length; i++) {
        const newEmail = users[i]['email'];
        if (newEmail === email) {
            found = true;
            break; // stops function if match is found
        }
    }

    if (found) {
        closeSignUpForm();
        registerError();
    } else {
        registerUser(name, email, password);
    }
}

async function registerUser(name, email, password) {
    users.push({ name: name, email: email, password: password });

    await setItem('users', JSON.stringify(users));
    closeSignUpForm();
    registrationSuccessful();

    name.value = '';
    email.value = '';
    password.value = '';
}

function registerError() {
    let content = document.getElementById('feedback-container');
    content.innerHTML = '';
    content.innerHTML += `
        <div class="danger-text">This Email is already registered. Please sign in or try another one.</div>
    `;
}



// shows message if registration was succesfull
function registrationSuccessful() {
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
    document.getElementById('confirmation-msg').classList.add('d-none');
}

function resetPassword() {
    let email = document.getElementById('forgot-password');
    console.log('Password reset link should be send to this email: ' + email.value);
    email.value = '';
    document.getElementById('confirmation-msg').classList.remove('d-none');
}


// optional: delete users from backend filtered by email
async function deleteUser(email) {
    let storedUsers = await getItem('users');
    let users = JSON.parse(storedUsers);
    let filteredUsers = users.filter((user) => user.email !== email);
    await setItem('users', JSON.stringify(filteredUsers));
}