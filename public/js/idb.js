let db
const request = indexedDB.open('Big-Money', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_money', { autoIncrement: true });

  };

request.onsuccess = function(event) {
db = event.target.result;

if (navigator.onLine) {
    uploadMoney();
}
};

request.onerror = function(event) {
console.log(event.target.errorCode);
};

function saveRecord(record) {
const transaction = db.transaction(['new_money'], 'readwrite');

const moneyObjectStore = transaction.objectStore('new_money');

moneyObjectStore.add(record);
}
function uploadMoney() {
// open a transaction on your pending db
const transaction = db.transaction(['new_money'], 'readwrite');

// access your pending object store
const moneyObjectStore = transaction.objectStore('new_money');

// get all records from store and set to a variable
const getAll = moneyObjectStore.getAll();

getAll.onsuccess = function() {
    // if there was data in indexedDb's store, let's send it to the api server
    if (getAll.result.length > 0) {
    fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(serverResponse => {
        if (serverResponse.message) {
            throw new Error(serverResponse);
        }

        const transaction = db.transaction(['new_money'], 'readwrite');
        const moneyObjectStore = transaction.objectStore('new_money');
        // clear all items in your store
        moneyObjectStore.clear();
        })
        .catch(err => {
        // set reference to redirect back here
        console.log(err);
        });
    }
};
}

// listen for app coming back online
window.addEventListener('online', uploadMoney);
  