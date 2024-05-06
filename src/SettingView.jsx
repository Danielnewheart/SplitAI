function SettingView({ onLogout }) {
    return (
        <div className="setting-view">
            <h1>SETTING</h1>
            <span>Version: v0.1.0</span>
            <a className="logout" href="/" onClick={onLogout}>
                Logout
            </a>
        </div>
    );
}

export default SettingView;
