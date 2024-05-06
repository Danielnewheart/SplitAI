import { useEffect, useReducer, useRef, useCallback } from "react";
import "./App.css";

import reducer, { initialState } from "./reducer";

import {
    fetchSession,
    fetchLogin,
    fetchLogout,
    fetchGroups,
    fetchExpensesFromGroup,
} from "./services";

import {
    LOGIN_STATUS,
    CLIENT,
    SERVER,
    ACTIONS,
    POLLING_INTERVAL,
} from "./constants";

import LoginForm from "./LoginForm";
import MainContent from "./MainContent";

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);

    function loadGroups() {
        dispatch({ type: ACTIONS.START_LOADING_GROUPS });
        return fetchGroups()
            .catch((err) => {
                if (err?.error === SERVER.AUTH_MISSING) {
                    return Promise.reject({ error: CLIENT.NO_SESSION });
                }
                return Promise.reject(err);
            })
            .then((groups) => {
                console.log(state.groups.activeGroup);
                dispatch({ type: ACTIONS.REPLACE_GROUPS, groups: groups });
                dispatch({ type: ACTIONS.STOP_LOADING_GROUPS });
                console.log("loaded groups");
            })
            .catch((err) => {
                if (err?.error === CLIENT.NO_SESSION) {
                    dispatch({ type: ACTIONS.LOG_OUT });
                    return;
                }
                dispatch({
                    type: ACTIONS.REPORT_SESSION_ERROR,
                    error: err?.error,
                });
            });
    }

    function checkSession() {
        fetchSession()
            .then((user) => {
                dispatch({ type: ACTIONS.LOG_IN, user: user });
                return loadGroups();
            })
            .catch((err) => {
                if (err?.error === SERVER.AUTH_MISSING) {
                    return Promise.reject({ error: CLIENT.NO_SESSION });
                }
                return Promise.reject(err);
            })
            .catch((err) => {
                if (err?.error === CLIENT.NO_SESSION) {
                    dispatch({ type: ACTIONS.LOG_OUT });
                    return;
                }
                dispatch({
                    type: ACTIONS.REPORT_SESSION_ERROR,
                    error: err?.error,
                });
            });
    }

    const onLogin = (username) => {
        return fetchLogin(username)
            .then((user) => {
                dispatch({ type: ACTIONS.LOG_IN, user: user });
                // TODO: change page to a contant
                dispatch({ type: ACTIONS.GO_TO_PAGE, page: "/" });
                dispatch({ type: ACTIONS.SET_ACTIVE_GROUP, groupId: null });
                dispatch({ type: ACTIONS.SET_ACTIVE_EXPENSE, expenseId: null });
                return loadGroups();
            }) // Maybe we should reset error statas here
            .catch((err) => {
                console.log("catch!", err?.error);
                dispatch({
                    type: ACTIONS.REPORT_SESSION_ERROR,
                    error: err?.error,
                });
            });
    };

    const onLogout = (e) => {
        e.preventDefault();

        dispatch({ type: ACTIONS.LOG_OUT });
        dispatch({ type: ACTIONS.GO_TO_PAGE, page: "/" });
        window.history.pushState(null, "", "/");
        fetchLogout() // We don't really care about server results
            .catch((err) => {
                dispatch({
                    type: ACTIONS.REPORT_SESSION_ERROR,
                    error: err?.error,
                });
            });
    };

    useEffect(() => {
        checkSession();
    }, []);

    // Try using useRef() to optimize Polling function
    const pollingRef = useRef(null);

    const startPolling = useCallback(() => {
        console.log("polling");
        fetchGroups()
            .catch((err) => {
                if (err?.error === SERVER.AUTH_MISSING) {
                    return Promise.reject({ error: CLIENT.NO_SESSION });
                }
                return Promise.reject(err);
            })
            .then((groups) => {
                dispatch({ type: ACTIONS.REPLACE_GROUPS, groups: groups });

                // Prevent active group from being deleted by group owner
                if (
                    state.groups.activeGroup &&
                    !groups.find(
                        (group) => group.id === state.groups.activeGroup
                    )
                ) {
                    console.log("active group not in groups");
                    dispatch({ type: ACTIONS.SET_ACTIVE_GROUP, groupId: null });
                }
            })
            .catch((err) => {
                if (err?.error === CLIENT.NO_SESSION) {
                    dispatch({ type: ACTIONS.LOG_OUT });
                    return;
                }
                dispatch({
                    type: ACTIONS.REPORT_SESSION_ERROR,
                    error: err?.error,
                });
            });

        // check if there is a active group
        const groupId = state.groups.activeGroup;
        if (groupId) {
            fetchExpensesFromGroup(groupId)
                .then((expenses) => {
                    const expensesWithDateObject = expenses.map((expense) => ({
                        ...expense,
                        createdAt: new Date(expense.createdAt),
                    }));
                    dispatch({
                        type: ACTIONS.REPLACE_EXPENSES,
                        expenses: expensesWithDateObject,
                    });
                    console.log("replace expenses");
                    // dispatch({ type: ACTIONS.STOP_LOADING_EXPENSES });
                })
                .catch((err) => {
                    if (err?.error === SERVER.AUTH_MISSING) {
                        return Promise.reject({ error: CLIENT.NO_SESSION });
                    }
                    return Promise.reject(err);
                })
                .catch((err) => {
                    if (err?.error === CLIENT.NO_SESSION) {
                        dispatch({ type: ACTIONS.LOG_OUT });
                        return;
                    }
                    dispatch({
                        type: ACTIONS.REPORT_SESSION_ERROR,
                        error: err?.error,
                    });
                });
        }
        pollingRef.current = setTimeout(startPolling, POLLING_INTERVAL);
    }, [state.groups.activeGroup]);

    useEffect(() => {
        if (state.loginStatus == LOGIN_STATUS.LOGGED_IN) {
            pollingRef.current = setTimeout(startPolling, POLLING_INTERVAL);
        }
        return () => {
            clearTimeout(pollingRef.current);
            console.log("clear polling");
        };
    }, [state.loginStatus, startPolling]);

    return (
        <div className="app">
            {state.loginStatus === LOGIN_STATUS.PENDING && (
                <div>Loading...</div>
            )}
            {state.loginStatus === LOGIN_STATUS.NOT_LOGGED_IN && (
                <LoginForm
                    onLogin={onLogin}
                    sessionError={state.sessionError}
                    dispatch={dispatch}
                />
            )}
            {state.loginStatus === LOGIN_STATUS.LOGGED_IN && (
                <MainContent
                    state={state}
                    dispatch={dispatch}
                    onLogout={onLogout}
                    loadGroups={loadGroups}
                />
            )}
        </div>
    );
}

export default App;
