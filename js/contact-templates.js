/**
 * Shows list of all contacts in alphabetical order.
 * @param {*} contact 
 * @param {*} i 
 * @returns 
 */
function generateContactList(contact, i) {
    return `
    <div id="highlight-${i}" onclick="showContactDetails(${i}); hightlightContact(${i})" class="contact-list-box" title="show contact details">
        <div id="contactColor" class="contact-letters small-letters" style="background-color: ${contact.color}">
                ${contact.firstName.charAt(0).toUpperCase()}${contact.lastName.charAt(0).toUpperCase()}
            </div>
            <div class="contact-details">
                <div class="contact-name">${contact.lastName}, ${contact.firstName}</div>
                <div class="contact-email">${contact.email}</div>
            </div>
        </div>
    `;
}


/**
 * Shows headline of first letters sorted alphabetically.
 * @param {*} firstLetter 
 * @returns 
 */
function showContactFirstLettersHTML(firstLetter) {
    return `
            <h2 class="contact-index">${firstLetter.toUpperCase()}</h2>
            <div class="contact-underline"></div>
        `;
}


/**
 * Shows selected contact with all details. 
 * @param {*} selectedContact 
 * @param {*} i 
 * @param {*} userShort 
 * @returns 
 */
function showContactDetailsHTML(selectedContact, i, userShort) {
    return `
        <div onclick="closeContactOverlay()" class="close-btn close-btn-overlay">
            <img class="close-icon" title="back" src="./assets/img/arrow_left.svg" alt="#">
        </div>
        <div class="contact-selection">
            <div id="selectedContactColor" class="contact-letters big-letters" style="background-color: ${selectedContact.color}">${selectedContact.firstName.charAt(0)}${selectedContact.lastName.charAt(0)}</div>
            <div>
                <div class="contact-information-name">${selectedContact.lastName}, ${selectedContact.firstName}</div>
            </div>
        </div>
        <div class="contact-information-title">
            <p>Contact Information</p>
            <div title="edit contact info" onclick="editContact(${i})" class="contact-edit"><img class="contact-edit-icon" src="./assets/img/edit_icon.svg">Edit Contact</div>
        </div>
        <h4>Email</h4>
        <div class="contact-email">${selectedContact.email}</div>
        <h4>Phone</h4>
        <div class="contact-name">${selectedContact.phone}</div>
        <div class="contact-edit-tools">
            <div title="delete contact"><img onclick="deleteSelectedContact(${i})" class="contact-trash-icon" src="./assets/img/empty-trash-32.png"></div>
            <div class="icon-bottom-right" title="edit contact info" onclick="editContact(${i})"><img class="edit-pencil-icon" src="./assets/img/edit_pencil.svg"></div>
        </div>
    `;
}


/**
 * Shows contact form to edit contacts.
 * @param {*} selectedContact 
 * @returns 
 */
function openEditContactFormHTML(selectedContact) {
    return `
        <div id="contactForm" class="contact-form-overlay">
            <div class="contact-form-left">
                <img class="contact-form-logo" src="./assets/img/Logo-Join.png" alt="#">
                <span class="contact-form-heading">Edit Contact</span>
                <img class="contact-form-underline" src="./assets/img/underline.svg" alt="">
            </div>
            <div class="contact-form-right">
            <div id="selectedContactColor" class="contact-letters big-letters margin-letters" style="background-color: ${selectedContact.color}">${selectedContact.firstName.charAt(0)}${selectedContact.lastName.charAt(0)}</div>
            <div class="contact-input-container margin-top">
                <div onclick="closeFormById('contactForm')" class="icon-top-right" title="close form">
                    <img class="contact-cancel-icon" src="./assets/img/contact-cancel-icon.svg" alt="#">
                    <img class="contact-cancel-icon-mobile hide-content" src="./assets/img/x_ixon.png" alt="">
                </div>
                <form onsubmit="updateContact(); return false;">
                    <div class="form-group">
                        <input class="contact-input-field input-name-img" type="text" placeholder="First Name" id="firstName" name="firstName" value="${selectedContact.firstName}" required>
                    </div>
                    <div class="form-group">
                        <input class="contact-input-field input-name-img" type="text" placeholder="Last Name" id="lastName" name="lastName" value="${selectedContact.lastName}" required>
                    </div>
                    <div class="form-group">
                        <input class="contact-input-field input-email-img" type="email" placeholder="Email" id="email" name="email" value="${selectedContact.email}" required>
                    </div>
                    <div class="form-group">
                        <input class="contact-input-field input-phone-img" type="tel" placeholder="Phone" id="phone" name="phone" value="${selectedContact.phone}" pattern="[+0-9\s]+" required>
                    </div>
                    <div class="form-group">
                        <input class="p-none"type="color" id="color" name="color" value="${selectedContact.color}" required>
                    </div>
                    <div class="form-group btn-centered">
                        <button type="submit" class="contact-add-btn">
                            <p>Save</p>
                            <img class="contact-create-icon" src="./assets/img/contact-create-icon.svg" alt="#">
                        </button>
                    </div>
                </form>
            </div>
            </div>
        </div>
    `;
}