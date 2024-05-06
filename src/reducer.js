import { LOGIN_STATUS, CLIENT, ACTIONS, MESSAGES } from "./constants";

export const initialState = {
    username: "",
    email: "",
    loginStatus: LOGIN_STATUS.PENDING,
    page: "",
    sessionError: "",
    groups: {
        list: [], // store all groups data belonging to the user
        loading: false,
        error: "",
        activeGroup: null,
    },
    expenses: {
        list: [], // store one group's expenses data
        loading: false,
        error: "",
        activeExpense: null,
    },
};

export default function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.LOG_IN:
            return {
                ...state,
                sessionError: "",
                loginStatus: LOGIN_STATUS.LOGGED_IN,
                username: action.user.username,
                email: action.user.email,
            };

        case ACTIONS.LOG_OUT:
            return {
                ...state,
                sessionError: "",
                loginStatus: LOGIN_STATUS.NOT_LOGGED_IN,
                username: "",
                email: "",
            };

        case ACTIONS.REPORT_SESSION_ERROR:
            return {
                ...state,
                sessionError:
                    MESSAGES[action.error] || action.error || MESSAGES.default,
            };

        case ACTIONS.GO_TO_PAGE:
            return {
                ...state,
                page: action.page,
            };

        case ACTIONS.START_LOADING_GROUPS:
            return {
                ...state,
                groups: {
                    ...state.groups,
                    loading: true,
                },
            };

        case ACTIONS.STOP_LOADING_GROUPS:
            return {
                ...state,
                groups: {
                    ...state.groups,
                    loading: false,
                },
            };

        case ACTIONS.REPORT_GROUP_ERROR:
            return {
                ...state,
                groups: {
                    ...state.groups,
                    error:
                        MESSAGES[action.error] ||
                        action.error ||
                        MESSAGES.default,
                },
            };

        case ACTIONS.REPLACE_GROUPS:
            return {
                ...state,
                groups: {
                    ...state.groups,
                    list: action.groups,
                },
            };

        case ACTIONS.START_LOADING_EXPENSES:
            return {
                ...state,
                expenses: {
                    ...state.expenses,
                    loading: true,
                },
            };

        case ACTIONS.STOP_LOADING_EXPENSES:
            return {
                ...state,
                expenses: {
                    ...state.expenses,
                    loading: false,
                },
            };

        case ACTIONS.REPLACE_EXPENSES:
            return {
                ...state,
                expenses: {
                    ...state.expenses,
                    list: action.expenses,
                },
            };

        case ACTIONS.REPORT_EXPENSE_ERROR:
            return {
                ...state,
                expenses: {
                    ...state.expenses,
                    error:
                        MESSAGES[action.error] ||
                        action.error ||
                        MESSAGES.default,
                },
            };

        case ACTIONS.SET_ACTIVE_GROUP:
            return {
                ...state,
                groups: {
                    ...state.groups,
                    activeGroup: action.groupId,
                },
            };

        case ACTIONS.SET_ACTIVE_EXPENSE:
            return {
                ...state,
                expenses: {
                    ...state.expenses,
                    activeExpense: action.expenseId,
                },
            };

        case ACTIONS.RESET_SESSION_ERROR:
            return {
                ...state,
                sessionError: "",
            };

        case ACTIONS.RESET_GROUP_ERROR:
            return {
                ...state,
                groups: {
                    ...state.groups,
                    error: "",
                },
            };

        case ACTIONS.RESET_EXPENSE_ERROR:
            return {
                ...state,
                expenses: {
                    ...state.expenses,
                    error: "",
                },
            };

        default:
            throw new Error({ error: CLIENT.UNKNOWN_ACTION, detail: action });
    }
}
