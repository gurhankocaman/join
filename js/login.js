let users = [];


/**
 * Initializes the login process and loads user data if remember user feature was enabled
 */
async function initLogin() {
    loadUsers();
    rememberUser();
}


/**
 * Loads users from backend
 */
async function loadUsers() {
    users = JSON.parse(await getItem('users')) || [];
}


/**
 * Runs the login process
 */
function login() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let rememberUser = document.getElementById('remember-me-checkbox').checked;  // Check radio button, if the button is checked, true is returned
    let user = users.find(currentUser => currentUser.email == email.value && currentUser.password == password.value);  // Filters array users for email and password match

    if (user) { // Save user and remember me button status in local storage
        let userAsText = JSON.stringify(user);
        localStorage.setItem('currentUser', userAsText);
        let rememberUserAsText = JSON.stringify(rememberUser);
        localStorage.setItem('rememberUser', rememberUserAsText);
        window.location.href = 'summary-user.html';

    } else {
        loginError();
    }

    email.value = '';
    password.value = '';
}


/**
 * Checks if the remember user feature is enabled and sets the email and password accordingly
 */
async function rememberUser() {
    let rememberUserAsText = localStorage.getItem('rememberUser');

    if (rememberUserAsText) {     // Checks if remember user has a value
        remember = JSON.parse(rememberUserAsText);
        let userAsText = localStorage.getItem('currentUser');     // Get current user
        if (userAsText) {
            user = JSON.parse(userAsText);
            username = user['email'];
            password = user['password'];
        }
        if (remember === true) {     // Get login status and return email-address
            document.getElementById('email').value = `${username}`;
            document.getElementById('password').value = `${password}`;
        }
    }
}


/**
 * Displays an error message for an incorrect login attempt
 */
function loginError() {
    let content = document.getElementById('feedback-container');
    content.innerHTML = '';
    content.innerHTML += `
        <div class="danger-text">Wrong email or password. Please try again.</div>
    `;
}


/**
 * Guest login directly redirects to board without login
 */
function guestLogin() {
    localStorage.setItem('currentUser', '');
    window.location.href = 'summary-user.html';
}


/**
 * Registers a new user
 */
function newUser() {
    let name = document.getElementById('signup-name').value;
    let email = document.getElementById('signup-email').value;
    let password = document.getElementById('signup-password').value;
    matchEmail(name, email, password);
}


/**
 * Checks if the email is already in use before registering a new user
 * @param {string} name - The name of the user
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 */
function matchEmail(name, email, password) {
    let found = false;

    for (let i = 0; i < users.length; i++) {
        const newEmail = users[i]['email'];
        if (newEmail === email) {
            found = true;
            break; // Stops function if match is found
        }
    }

    if (found) {
        closeSignUpForm();
        registerError();
    } else {
        registerUser(name, email, password);
    }
}


/**
 * Registers a new user and stores their information
 * @param {string} name - The name of the user
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 */
async function registerUser(name, email, password) {
    users.push({ name: name, email: email, password: password });

    await setItem('users', JSON.stringify(users));
    closeSignUpForm();
    registrationSuccessful();

    name.value = '';
    email.value = '';
    password.value = '';
}


/**
 * Displays an error message for a registration attempt with an already registered email
 */
function registerError() {
    let content = document.getElementById('feedback-container');
    content.innerHTML = '';
    content.innerHTML += `
        <div class="danger-text">This Email is already registered. Please sign in or try another one.</div>
    `;
}


/**
 * Displays a success message for a successful registration
 */
function registrationSuccessful() {
    let content = document.getElementById('feedback-container');
    content.innerHTML = '';
    content.innerHTML += `
        <div>Your registration was successful. You can log in now.</div>
    `;
}


/**
 * Opens the sign-up form
 */
function openSignUpForm() {
    document.getElementById('login-container').classList.add('d-none');
    document.getElementById('login-header-right').classList.add('d-none');
    document.getElementById('signup-container').classList.remove('d-none');

}


/**
 * Closes the sign-up form
 */
function closeSignUpForm() {
    document.getElementById('signup-container').classList.add('d-none');
    document.getElementById('login-container').classList.remove('d-none');
    document.getElementById('login-header-right').classList.remove('d-none');
}


/**
 * Opens the forgot password form
 */
function openForgotPasswordForm() {
    document.getElementById('login-container').classList.add('d-none');
    document.getElementById('login-header-right').classList.add('d-none');
    document.getElementById('forgot-password-container').classList.remove('d-none');
}


/**
 * Closes the forgot password form
 */
function closeForgotPasswordForm() {
    document.getElementById('forgot-password-container').classList.add('d-none');
    document.getElementById('login-container').classList.remove('d-none');
    document.getElementById('login-header-right').classList.remove('d-none');
    document.getElementById('confirmation-msg').classList.add('d-none');
}


/**
 * Resets the password for a user
 */
function resetPassword() {
    let email = document.getElementById('forgot-password');
    console.log('Password reset link should be send to this email: ' + email.value);
    email.value = '';
    document.getElementById('confirmation-msg').classList.remove('d-none');
}