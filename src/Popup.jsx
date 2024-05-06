import { useEffect } from "react";
function Popup({ setPopup, children }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            setPopup(false);

            return () => clearTimeout(timer);
        }, 2500);
    }, [setPopup]);

    return <div className="popup">{children}</div>;
}

export default Popup;
