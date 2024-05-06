const utils = require("./utils");
const uuid = require("uuid").v4;
/*
class Expense {
    constructor(id, groupId, amount, paidBy, splitType, shares, currency = 'USD', createdAt = new Date()) {
        this.id = id;
        this.groupId = groupId;
        this.amount = amount;
        this.description = description;
        this.paidBy = paidBy;
        this.splitType = splitType; // 'equal', 'shared', or 'fixed'
        this.shares = shares; // Object or array depending on splitType
        this.currency = currency;
        this.createdAt = createdAt;
    }
}
*/

const expenses = {};

function isValidExpense(expense) {
    if (
        !expense ||
        !expense.groupId ||
        !utils.isValidfloat(expense.amount) ||
        !utils.isValidDescription(expense.title)
    ) {
        return false;
    }
    return true;
}

function createExpense(username, expense) {
    const id = uuid();
    const {
        paidBy = username,
        shares = null,
        currency = "USD",
        ...rest
    } = expense;

    const newExpense = {
        id,
        ...rest,
        paidBy,
        shares,
        currency,
        createdAt: new Date(),
    };

    expenses[id] = newExpense;
    return newExpense;
}

function getExpense(id) {
    return expenses[id];
}

function updateExpense(id, updates) {
    if (expenses[id]) {
        expenses[id] = { ...expenses[id], ...updates };
        return expenses[id];
    }
    return null;
}

function deleteExpense(id) {
    if (expenses[id]) {
        delete expenses[id];
        return true;
    }
    return false;
}

module.exports = {
    isValidExpense,
    createExpense,
    getExpense,
    updateExpense,
    deleteExpense,
};
