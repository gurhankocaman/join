// global arrays
let users = [];
let tasks = [];

const STORAGE_TOKEN = 'A8GJT5S6UBP8EPYL0725HTO6OYCZCCP07A7XDAEY';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

// save value into backend
async function setItem(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload)})
  .then(res => res.json());
}

// load value from backend
async function getItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url).then(res => res.json()).then(res => res.data.value);
}