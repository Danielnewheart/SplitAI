import "./NavigationBar.css";

function NavigationBar({ currentPage, onNavigate }) {
    const onClick = (e) => {
        e.preventDefault();

        onNavigate(e.target.pathname);
        window.history.pushState(null, "", e.target.pathname);
    };

    const paths = { "/groups": "Group", "/": "Home", "/setting": "Setting" };
    return (
        <div className="nav-bar">
            {Object.keys(paths).map((path) => (
                <a
                    key={path}
                    className={`nav-item ${
                        currentPage === path ? "active" : ""
                    }`}
                    href={path}
                    onClick={onClick}
                >
                    {paths[path]}
                </a>
            ))}
        </div>
    );
}

export default NavigationBar;
