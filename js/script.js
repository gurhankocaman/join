/**
 * Loads the content of Header & Sidebar HTML files specified in elements with [w3-include-html] attribute,
 * and replaces the content of those elements with the loaded HTML content.
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


/**
 * Shows or hides the logout menu by adding or removing the 'd-none' CSS class.
 */
function toggleLogoutMenu() {
    let menu = document.getElementById('logout-menu');
    if (menu.classList.contains('d-none')) {
        menu.classList.remove('d-none');
    } else {
        menu.classList.add('d-none');
    }
}


/**
 * Logs the user out, clears local storage data, and redirects them to the homepage.
 */
function logout() {
    localStorage.setItem('currentUser', '');
    localStorage.setItem('rememberUser', '');
    window.location.href = 'index.html';
}