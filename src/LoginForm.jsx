import { useState } from "react";
import { ACTIONS } from "./constants";
import "./LoginForm.css";

function LoginForm({ onLogin, sessionError, dispatch }) {
    const [username, setUsername] = useState("");

    function onChange(e) {
        setUsername(e.target.value);
    }

    function onSubmit(e) {
        e.preventDefault();
        if (username?.trim() && username.match(/^[\w]+$/)) {
            onLogin(username);
            return;
        }
        dispatch({
            type: ACTIONS.REPORT_SESSION_ERROR,
            error: "Invalid username",
        });
    }

    return (
        <div className="login">
            <h1 className="login-title">SplitAI</h1>
            <form onSubmit={onSubmit} className="login-form">
                <label className="username-label" htmlFor="username">
                    username
                </label>
                <input
                    onChange={onChange}
                    value={username}
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Username"
                />
                <button className="login-button" type="submit">
                    Login
                </button>
                {sessionError && (
                    <div className="error login-error">{sessionError}</div>
                )}
            </form>
        </div>
    );
}

export default LoginForm;
