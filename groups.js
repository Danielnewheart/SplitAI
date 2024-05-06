const uuid = require("uuid").v4;
const utils = require("./utils");
/* 
class Group {
    constructor(id, name, createdBy, members = [], expenses = [], language = 'en', currency = 'USD') {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdDate = new Date();
        this.createdBy = createdBy;
        this.members = members; // Array of User IDs
        this.expenses = expenses; // Array of Expense IDs
        this.language
        this.currency
    }
}
*/

const groups = {};

function isValidGroup(group) {
    if (
        !group ||
        !utils.isValid(group.name) ||
        group.description === undefined ||
        group.currency === undefined
    ) {
        return false;
    }
    return true;
}

function createGroup(group, username) {
    const id = uuid();
    const { language = "en", currency = "USD", ...rest } = group;

    const newGroup = {
        id,
        ...rest,
        createdDate: new Date(),
        createdBy: username,
        members: [username],
        expenses: [],
        language,
        currency,
    };
    groups[id] = newGroup;
    return id;
}

function getGroup(id) {
    return groups[id];
}

function updateGroup(id, updates) {
    if (groups[id]) {
        groups[id] = { ...groups[id], ...updates };
        return groups[id];
    }
    return null;
}

function deleteGroup(id, username) {
    const group = groups[id];
    if (!group || group.createdBy !== username) {
        return false;
    }
    delete groups[id];
    return true;
}

function getExpenses(groupId) {
    return groups[groupId].expenses;
}

function addExpenseId(groupId, expenseId) {
    if (groups[groupId]) {
        groups[groupId].expenses.push(expenseId);
        return true;
    }
    return false;
}

function removeMember(id, username) {
    const index = groups[id].members.indexOf(username);
    if (index === -1) {
        return false;
    }
    groups[id].members.splice(index, 1);
    return true;
}

function addMember(id, username) {
    groups[id].members.push(username);
}

module.exports = {
    isValidGroup,
    createGroup,
    getGroup,
    updateGroup,
    deleteGroup,
    getExpenses,
    addExpenseId,
    removeMember,
    addMember,
};
