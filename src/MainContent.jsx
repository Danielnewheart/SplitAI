import { useEffect } from "react";
import GroupContext from "./GroupContext";

import { CLIENT, SERVER, ACTIONS } from "./constants";

import GroupsView from "./GroupsView";
import ImputView from "./ImputView";
import SettingView from "./SettingView";
import NavigationBar from "./NavigationBar";
import AddNewGroup from "./AddNewGroup";

import {
    fetchAddGroup,
    fetchExpensesFromGroup,
    fetchAddExpense,
    fetchLeaveGroup,
    fetchDeleteGroup,
    fetchAddMember,
} from "./services";

function MainContent({ state, dispatch, onLogout, loadGroups }) {
    useEffect(() => {
        const onPageChange = () => {
            dispatch({
                type: ACTIONS.GO_TO_PAGE,
                page: window.location.pathname,
            });
        };

        onPageChange();
        window.addEventListener("popstate", onPageChange);

        return () => {
            window.removeEventListener("popstate", onPageChange);
        };
    }, [dispatch]);

    function onNavigate(page) {
        dispatch({ type: ACTIONS.GO_TO_PAGE, page: page });
        // Reset all errors when navigating
        dispatch({ type: ACTIONS.RESET_EXPENSE_ERROR });
        dispatch({ type: ACTIONS.RESET_GROUP_ERROR });
        dispatch({ type: ACTIONS.RESET_SESSION_ERROR });
    }

    function onAddGroup(group) {
        fetchAddGroup(group)
            .then(() => {
                dispatch({ type: ACTIONS.START_LOADING_GROUPS });
                return loadGroups();
            })
            .catch((err) => {
                dispatch({
                    type: ACTIONS.REPORT_GROUP_ERROR,
                    error: err?.error,
                });
            });
    }

    function onAddExpense(expense) {
        fetchAddExpense(expense)
            .then(() => {
                const groupId = state.groups.activeGroup;
                if (!groupId) {
                    return;
                }
                return fetchExpensesFromGroup(groupId).then((expenses) => {
                    const expensesWithDateObject = expenses.map((expense) => ({
                        ...expense,
                        createdAt: new Date(expense.createdAt),
                    }));
                    dispatch({
                        type: ACTIONS.REPLACE_EXPENSES,
                        expenses: expensesWithDateObject,
                    });
                    dispatch({ type: ACTIONS.RESET_EXPENSE_ERROR });
                });
            })
            .catch((err) => {
                dispatch({
                    type: ACTIONS.REPORT_EXPENSE_ERROR,
                    error: err?.error,
                });
            });
    }

    function onOpenGroup(groupId) {
        // dispatch({ type: ACTIONS.START_LOADING_EXPENSES });
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
                dispatch({ type: ACTIONS.SET_ACTIVE_GROUP, groupId: groupId });
                console.log("set active group", expensesWithDateObject);
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
                    type: ACTIONS.REPORT_EXPENSE_ERROR,
                    error: err?.error,
                });
            });
    }

    function onCloseGroup() {
        dispatch({ type: ACTIONS.SET_ACTIVE_GROUP, groupId: null });
    }

    function onLeaveGroup(groupId) {
        fetchLeaveGroup(groupId)
            .then(() => {
                loadGroups();
                onCloseGroup();
                onCloseExpense();
            })
            .catch((err) => {
                dispatch({
                    type: ACTIONS.REPORT_GROUP_ERROR,
                    error: err?.error,
                });
            });
    }

    function onDeleteGroup(groupId) {
        return fetchDeleteGroup(groupId)
            .then(() => {
                loadGroups();
                onCloseGroup();
                onCloseExpense();
            })
            .catch((err) => {
                dispatch({
                    type: ACTIONS.REPORT_GROUP_ERROR,
                    error: err?.error,
                });
            });
    }

    function onOpenExpense(expenseId) {
        dispatch({ type: ACTIONS.SET_ACTIVE_EXPENSE, expenseId: expenseId });
    }

    function onCloseExpense() {
        dispatch({ type: ACTIONS.SET_ACTIVE_EXPENSE, expenseId: null });
    }

    function onAddMember(member, groupId) {
        return (
            fetchAddMember(member, groupId)
                // .then(() => loadGroups())
                .catch((err) => {
                    if (err?.error === SERVER.AUTH_MISSING) {
                        console.log("addMember auth-miss");
                        return Promise.reject({ error: CLIENT.NO_SESSION });
                    }
                    return Promise.reject(err);
                })
                .catch((err) => {
                    if (err?.error === CLIENT.NO_SESSION) {
                        console.log("addMember no session");
                        dispatch({ type: ACTIONS.LOG_OUT });
                        return;
                    }
                    return Promise.reject(err);
                })
        );
    }

    function clearGroupError() {
        dispatch({ type: ACTIONS.RESET_GROUP_ERROR });
    }

    function clearExpenseError() {
        dispatch({ type: ACTIONS.RESET_EXPENSE_ERROR });
    }

    const groupContextValue = {
        state,
        onOpenGroup,
        onCloseGroup,
        onOpenExpense,
        onCloseExpense,
        onLeaveGroup,
        onDeleteGroup,
        onAddMember,
        clearGroupError,
        clearExpenseError,
    };

    const clearSessionError = () => {
        dispatch({ type: ACTIONS.RESET_SESSION_ERROR });
    };

    return (
        <>
            {state.page === "/" && (
                <ImputView
                    state={state}
                    onAddExpense={onAddExpense}
                    clearExpenseError={clearExpenseError}
                >
                    <AddNewGroup onAddGroup={onAddGroup} />
                </ImputView>
            )}
            {state.page === "/groups" && (
                <GroupContext.Provider value={groupContextValue}>
                    <GroupsView>
                        <AddNewGroup onAddGroup={onAddGroup} />
                    </GroupsView>
                </GroupContext.Provider>
            )}
            {state.page === "/setting" && <SettingView onLogout={onLogout} />}
            <NavigationBar currentPage={state.page} onNavigate={onNavigate} />
            {state.sessionError && (
                <div className="session-error">
                    <p>{state.sessionError}</p>
                    <button onClick={clearSessionError}>X</button>
                </div>
            )}
        </>
    );
}

export default MainContent;
