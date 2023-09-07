/**
 * Loads the header and sidebar.
 * @returns {Promise<void>} A promise that resolves when the operation is complete
 */
async function initLegalNotice() {
    await includeHTML();
    navLinkActive('nav-legal-notice');
}