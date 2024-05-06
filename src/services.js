function handleResponse(response) {
    if (response.ok) {
        return response.json();
    }
    return response
        .json()
        .catch((error) => Promise.reject({ error }))
        .then((err) => Promise.reject(err));
}

export function fetchSession() {
    return fetch("/api/session")
        .catch(() => Promise.reject({ error: "networkError" }))
        .then((response) => handleResponse(response));
    // possible response: {401: 'auth-missing'}
}

export function fetchLogin(username) {
    const options = {
        method: "POST",
        headers: new Headers({
            "content-type": "application/json",
        }),
        body: JSON.stringify({ username }),
    };
    return fetch("/api/session", options)
        .catch(() => Promise.reject({ error: "networkError" }))
        .then((response) => handleResponse(response));
    // possible response: {400: 'invalid-username', 403: 'auth-insufficient'}
}

export function fetchLogout() {
    return fetch("/api/session", {
        method: "DELETE",
    })
        .catch(() => Promise.reject({ error: "networkError" }))
        .then((response) => handleResponse(response));
}

export function fetchGroups() {
    // it checks for session then use user data to get groups
    return fetch("/api/groups")
        .catch(() => Promise.reject({ error: "networkError" }))
        .then((response) => handleResponse(response));
    // possible response: {401: 'auth-missing'}
}

export function fetchAddGroup(group) {
    return fetch("/api/groups", {
        method: "POST",
        headers: new Headers({
            "content-type": "application/json",
        }),
        body: JSON.stringify({ group }),
    })
        .catch(() => Promise.reject({ error: "networkError" }))
        .then((response) => handleResponse(response));
    // possible response: {400: 'invalid-group', 401: 'auth-missing'}
}

export function fetchLeaveGroup(groupId) {
    return fetch(`/api/groups/${groupId}`, {
        method: "PATCH",
        headers: new Headers({
            "content-type": "application/json",
        }),
    })
        .catch(() => Promise.reject({ error: "networkError" }))
        .then((response) => handleResponse(response));
    // possible response: {400: 'invalid-group', 401: 'auth-missing', 403: 'auth-insufficient'}
}

export function fetchDeleteGroup(groupId) {
    return fetch(`/api/groups/${groupId}`, {
        method: "DELETE",
        headers: new Headers({
            "content-type": "application/json",
        }),
    })
        .catch(() => Promise.reject({ error: "networkError" }))
        .then((response) => handleResponse(response));
    // possible response: {400: 'invalid-group', 401: 'auth-missing', 403: 'auth-insufficient'
}

// According to group Id, return all expenses of that group
export function fetchExpensesFromGroup(groupId) {
    return fetch(`/api/groups/${groupId}/expenses`)
        .catch(() => Promise.reject({ error: "networkError" }))
        .then((response) => handleResponse(response));
    // possible response: {400: 'invalid-group', 401: 'auth-missing'}
}

export function fetchAddExpense(expense) {
    return fetch("/api/expenses", {
        method: "POST",
        headers: new Headers({
            "content-type": "application/json",
        }),
        body: JSON.stringify({ expense }),
    })
        .catch(() => Promise.reject({ error: "networkError" }))
        .then((response) => handleResponse(response));
    // possible response: {400: 'invalid-expense', 400: 'invalid-group-id', 401: 'auth-missing'}
}

export function fetchAddMember(member, groupId) {
    return fetch(`/api/groups/${groupId}/member`, {
        method: "POST",
        headers: new Headers({
            "content-type": "application/json",
        }),
        body: JSON.stringify({ member }),
    })
        .catch(() => Promise.reject({ error: "networkError" }))
        .then((response) => handleResponse(response));
    /* possible response: {
        400: 'invalid-username', 
        401: 'auth-missing', 
        403: 'auth-insufficient', 
        404: 'user-not-found', 
        409: 'member-exists'} 
    */
}
