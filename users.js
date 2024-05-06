/* 
class User {
    constructor(username, email = '', groups = []) {
        this.username = username;
        this.email = email;
        this.groups = groups; // Array of Group IDs the user belongs to
    }
}
*/

const users = {};

function createUser(username, email = "", groups = []) {
    users[username] = { username, email, groups };
    return users[username];
}

function getUserData(username) {
    return users[username];
}

function addGroup(username, groupId) {
    users[username].groups.push(groupId);
}

function removeGroup(username, groupId) {
    const user = users[username];
    user.groups = user.groups.filter((group) => group !== groupId);
}

module.exports = {
    getUserData,
    createUser,
    addGroup,
    removeGroup,
};
