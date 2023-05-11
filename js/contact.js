function addNewContact() {
document.getElementById("newContactPopUp").innerHTML += `
<div id="AddContactPopUp" class="addContactPopUp">
    <div class="autoLayout">
        <img src="/img/Group11.png" class="closeOverlayWhite" onclick="closeAddContact()">
        <img src="/img/Capa 2joinAddContact.png" class="addLogo">
        <span class="overlayTextAdd">Add contact</span>
        <span class="overlayText2Add">Tasks are better with a team!</span>
        <span class="overlayborderAdd"></span>
        <div class="logoOverlay">
            <img src="/img/Vectorlogooverla.png" id="logoImg">
        </div> 
    </div>
      <form onsubmit="saveContact();return false">
        <div class="containerOverRightSide">
          <img src="/img/Group 11closeOverlay.png" class="closeOverlay" onclick="closeAddContact()">
          <div class="inputContainer">
            <input id="nameAdd" required="" type="text" class="overlayInputNameAdd" placeholder="Name">
            <input id="emailAdd" required="" type="email" class="overlayInputMailAdd" placeholder="Email">
            <input id="telAdd" required="" type="number" class="overlayInputPhoneAdd" placeholder="Phone" pattern="^d{10}$"> 
          </div>
          <div class="buttons">
            <button id="cancelButton" class="cancel buttonGlobal2" onclick="closeAddContact()">Cancel 
                <img src="/img/Group 11closeOverlay.png" alt="">
            </button>
            <button type="submit" class="buttonGlobal1 create-contact">Create Contact
              <img src="/img/VectorCreate icon overlay.png"> 
            </button>
          </div>
        </div>
      </form>
    </div>`
}