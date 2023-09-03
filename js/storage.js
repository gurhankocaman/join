const STORAGE_TOKEN = 'O7AJXACVZ5CAI1NBKYLNHDS1WBLN0V24RQ1QN2S7';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

// Save value into backend
async function setItem(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload)})
  .then(res => res.json());
}

// Load value from backend
async function getItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url).then(res => res.json()).then(res => res.data.value);
}

async function downloadFromServer() {
  const getContacts = JSON.parse(await getItem('contacts'));
  return getContacts;
}

  