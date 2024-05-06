export const LOGIN_STATUS = {
    LOGGED_IN: "loggedIn",
    PENDING: "pending",
    NOT_LOGGED_IN: "notLoggedIn",
};

export const ADD_MEMBER_STATUS = {
    PENDING: "pending",
    LOADING: "loading",
    SUCCESS: "success",
    ERROR: "error",
};

export const SERVER = {
    AUTH_MISSING: "auth-missing",
    AUTH_INSUFFICIENT: "auth-insufficient",
    INVALID_USERNAME: "invalid-username",
    INVALID_GROUP: "invalid-group",
    INVALID_EXPENSE: "invalid-expense",
    USER_NOT_FOUND: "user-not-found",
    MEMBER_EXISTS: "member-exists",
    GROUP_NOT_FOUND: "group-not-found",
};

export const CLIENT = {
    NO_SESSION: "noSession",
    NETWORK_ERROR: "networkError",
};

export const ACTIONS = {
    LOG_IN: "logIn",
    LOG_OUT: "logOut",
    RESET_SESSION_ERROR: "resetSessionError",
    REPORT_SESSION_ERROR: "reportSessionError",
    GO_TO_PAGE: "goToPage",
    START_LOADING_GROUPS: "startLoadingGroups",
    STOP_LOADING_GROUPS: "stopLoadingGroups",
    RESET_GROUP_ERROR: "resetGroupError",
    REPORT_GROUP_ERROR: "reportGroupError",
    REPLACE_GROUPS: "replaceGroups",
    START_LOADING_EXPENSES: "startLoadingExpenses",
    STOP_LOADING_EXPENSES: "stopLoadingExpenses",
    RESET_EXPENSE_ERROR: "resetExpenseError",
    REPORT_EXPENSE_ERROR: "reportExpenseError",
    REPLACE_EXPENSES: "replaceExpenses",
    SET_ACTIVE_GROUP: "setActiveGroup",
    SET_ACTIVE_EXPENSE: "setActiveExpense",
};

export const POLLING_INTERVAL = 5000;

// TODO: Add pages constants

export const MESSAGES = {
    [SERVER.AUTH_MISSING]: "Authentication missing, please log in again",
    [SERVER.AUTH_INSUFFICIENT]:
        "Insufficient permissions, please contact an administrator",
    [SERVER.INVALID_USERNAME]: "Invalid username, please try again",
    [SERVER.INVALID_GROUP]: "Invalid group",
    [SERVER.INVALID_EXPENSE]: "Invalid expense",
    [CLIENT.NETWORK_ERROR]:
        "Trouble connecting to the network.  Please try again",
    [SERVER.USER_NOT_FOUND]: "User not found",
    [SERVER.MEMBER_EXISTS]: "Member already exists in the group",
    [SERVER.GROUP_NOT_FOUND]: "Group not found",
    default: "Something went wrong.  Please try again",
};
