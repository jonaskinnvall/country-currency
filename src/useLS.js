function checkLS(key) {
    if (
        typeof window.localStorage.getItem(key) === 'undefined' ||
        window.localStorage.getItem(key) === null
    ) {
        return false;
    } else {
        return true;
    }
}

export function setLS(key, item) {
    if (!checkLS(key)) {
        window.localStorage.setItem(key, JSON.stringify(item));
    }
}

export function getLS(key, setHook) {
    if (checkLS(key)) {
        setHook(JSON.parse(window.localStorage.getItem(key)));
    } else {
        throw 'Not in LS!';
    }
}
