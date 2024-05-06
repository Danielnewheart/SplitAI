const uuid = require('uuid').v4;

// data structure: { sid: username }
const sessions = {};

function getSessionUser(sid) {
    return sessions[sid];
}

function addSession(username) {
    const sid = uuid();
    sessions[sid] = username;
    return sid;
}

function deleteSession(sid) {
    delete sessions[sid];
}

module.exports = {
    getSessionUser,
    addSession,
    deleteSession,
}
