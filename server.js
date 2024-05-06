const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 3000;

const sessions = require("./sessions");
const users = require("./users");
const groups = require("./groups");
const expenses = require("./expenses");
const utils = require("./utils");

app.use(cookieParser());
app.use(express.static("./dist"));
app.use(express.json());

app.get("/api/session", (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : "";
    if (!sid || !utils.isValid(username)) {
        res.status(401).json({ error: "auth-missing" });
        return;
    }

    res.json(users.getUserData(username));
});

app.post("/api/session", (req, res) => {
    const username = req.body.username;
    if (!utils.isValid(username)) {
        res.status(400).json({ error: "invalid-username" });
        return;
    }

    if (username === "dog") {
        res.status(403).json({ error: "auth-insufficient" });
        return;
    }

    const sid = sessions.addSession(username);
    res.cookie("sid", sid);
    let userData = users.getUserData(username);
    if (!userData) {
        userData = users.createUser(username);
    }
    res.json(userData);
});

app.delete("/api/session", (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : "";

    if (sid) {
        res.clearCookie("sid");
    }

    if (username) {
        sessions.deleteSession(sid);
    }

    res.json({ username });
});

app.get("/api/groups", (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : "";
    if (!sid || !utils.isValid(username)) {
        res.status(401).json({ error: "auth-missing" });
        return;
    }
    // Retrieve groups that the user belongs to
    const userGroups = [];
    const groupIds = users.getUserData(username).groups;
    groupIds.forEach((groupId) => {
        if (groups.getGroup(groupId)) {
            userGroups.push(groups.getGroup(groupId));
        }
    });
    res.json(userGroups);
});

app.post("/api/groups", (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : "";
    if (!sid || !utils.isValid(username)) {
        res.status(401).json({ error: "auth-missing" });
        return;
    }
    const { group } = req.body;

    // Check if the group object have valid name, description, and currency
    if (!groups.isValidGroup(group)) {
        res.status(400).json({ error: "invalid-group" });
        return;
    }
    const createdGroupId = groups.createGroup(group, username);
    users.addGroup(username, createdGroupId);
    res.json(createdGroupId); // return Group ID instead of the group object
});

// Leave the group
app.patch("/api/groups/:id", (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : "";
    if (!sid || !utils.isValid(username)) {
        res.status(401).json({ error: "auth-missing" });
        return;
    }

    const groupId = req.params.id;
    if (!groupId) {
        res.status(400).json({ error: "invalid-group-id" });
        return;
    }

    // If the user is the creator of the group, change the group creator to the first member
    const group = groups.getGroup(groupId);
    if (group.createdBy === username) {
        const newCreator = group.members[1];
        groups.updateGroup(groupId, { createdBy: newCreator });
    }

    // Check if the group is valid, and the user is a member of the group
    // If yes, remove the user from the group
    const isLeaveSuccessful = groups.removeMember(groupId, username);
    if (!isLeaveSuccessful) {
        res.status(403).json({ error: "auth-insufficient" });
        return;
    }

    // Remove the group from the user's groups
    users.removeGroup(username, groupId);

    res.json(groupId);
});

app.delete("/api/groups/:id", (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : "";
    if (!sid || !utils.isValid(username)) {
        res.status(401).json({ error: "auth-missing" });
        return;
    }

    const groupId = req.params.id;
    if (!groupId) {
        res.status(400).json({ error: "invalid-group-id" });
        return;
    }

    const group = groups.getGroup(groupId);

    // Check if the group is valid, and the user is the creator of the group
    // If yes, delete the group
    const isDeleteSuccessful = groups.deleteGroup(groupId, username);
    if (!isDeleteSuccessful) {
        res.status(403).json({ error: "auth-insufficient" });
        return;
    }

    // Remove the groupId from the all related users data
    group.members.forEach((member) => {
        users.removeGroup(member, groupId);
    });

    // Remove all the expenses related to the group
    group.expenses.forEach((expenseId) => {
        expenses.deleteExpense(expenseId);
    });

    res.json(groupId);
});

app.get("/api/groups/:id/expenses", (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : "";
    if (!sid || !utils.isValid(username)) {
        res.status(401).json({ error: "auth-missing" });
        return;
    }

    // Check if the group is valid
    const groupId = req.params.id;
    if (!groups.getGroup(groupId)) {
        res.status(404).json({ error: "group-not-found" });
        return;
    }

    const userExpenses = [];
    const expenseIds = groups.getExpenses(groupId);
    expenseIds.forEach((expenseId) => {
        if (expenses.getExpense(expenseId)) {
            userExpenses.push(expenses.getExpense(expenseId));
        }
    });
    res.json(userExpenses);
});

app.post("/api/expenses", (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : "";
    if (!sid || !utils.isValid(username)) {
        res.status(401).json({ error: "auth-missing" });
        return;
    }

    const { expense } = req.body;
    if (!expenses.isValidExpense(expense)) {
        res.status(400).json({ error: "invalid-expense" });
        return;
    }

    const createdExpense = expenses.createExpense(username, expense);
    const createdExpenseId = createdExpense.id;
    const isAddSuccessful = groups.addExpenseId(
        expense.groupId,
        createdExpenseId
    );

    if (!isAddSuccessful) {
        res.status(400).json({ error: "invalid-group-id" });
        return;
    }
    res.json(createdExpenseId);
});

app.post("/api/groups/:id/member", (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : "";
    if (!sid || !utils.isValid(username)) {
        res.status(401).json({ error: "auth-missing" });
        return;
    }

    // Check if the username is the same as the group owner
    const groupId = req.params.id;
    const group = groups.getGroup(groupId);
    if (!group || group.createdBy !== username) {
        res.status(403).json({ error: "auth-insufficient" });
        return;
    }

    // Check if the member username is valid
    const { member } = req.body;
    if (!utils.isValid(member)) {
        res.status(400).json({ error: "invalid-username" });
        return;
    }

    // Check if the member is a valid user
    if (!users.getUserData(member)) {
        res.status(404).json({ error: "user-not-found" });
        return;
    }

    // Check if the member is already in the group
    if (group.members.includes(member)) {
        res.status(409).json({ error: "member-exists" });
        return;
    }

    // Add the member to the group
    groups.addMember(groupId, member);
    // Add the group to the member's groups
    users.addGroup(member, groupId);

    res.json(groupId);
});

app.get("*", (req, res) => {
    res.sendFile(__dirname + "/dist/index.html");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
