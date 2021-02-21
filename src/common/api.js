import firebase from "firebase/app";
import "firebase/database";

function decode(incoded) {
    const decoded = decodeURIComponent(incoded);
    return decoded;
}
function incode(decoded) {
    const incoded = encodeURIComponent(decoded);
    return incoded;
}

export function updateStopwatchTimelog(key, timelog) {
    const db = firebase.database();
    const user = firebase.auth().currentUser;

    if (user) {
        db.ref(`stopwatches/${user.uid}/keys/${incode(key)}`).set(1);
        db.ref(`stopwatches/${user.uid}/timelog/${incode(key)}`).set(timelog);
    }
}

export function deleteStopwatchWithKey(key) {
    const db = firebase.database();
    const user = firebase.auth().currentUser;
    if (user) {
        db.ref(`stopwatches/${user.uid}/keys/${incode(key)}`).remove();
        db.ref(`stopwatches/${user.uid}/timelog/${incode(key)}`).remove();
    }
}

export async function setStopwatchDataToLocalStorage() {
    const db = firebase.database();
    const user = firebase.auth().currentUser;
    if (user) {
        try {
            const snapshot = await db
                .ref(`stopwatches/${user.uid}/`)
                .once("value");

            const data = snapshot.val();
            if (data == null) return;
            const { keys, timelog } = data;

            if (Object.keys(keys).length) {
                const newKeys = {};
                Object.keys(keys).forEach((key) => {
                    newKeys[decode(key)] = 1;
                });
                localStorage.setItem("key", JSON.stringify(newKeys));
            }
            for (const key in timelog) {
                const decodedKey = decode(key);
                localStorage.setItem(decodedKey, JSON.stringify(timelog[key]));
            }
        } catch (e) {
            console.log(e);
        }
    }
}
