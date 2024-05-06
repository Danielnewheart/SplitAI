import { useRef, useContext } from "react";
import GroupContext from "./GroupContext";
import ActiveGroupView from "./ActiveGroupView";
import "./groups.css";

function GroupsView({ children }) {
    const dialogRef = useRef();
    const { state, onOpenGroup } = useContext(GroupContext);

    const onClickGroup = (e) => {
        const groupId = e.target.value;
        onOpenGroup(groupId);
    };

    function content() {
        if (state.groups.loading) {
            return <p>Loading</p>;
        } else if (state.groups.list.length === 0) {
            return <>{children}</>;
        } else if (state.groups.activeGroup) {
            return <ActiveGroupView state={state} />;
        }
        return (
            <>
                <div className="groups-view">
                    <div className="groups-view__header">
                        <h1 className="view-title groups-view-title">Groups</h1>
                        <button onClick={() => dialogRef.current.showModal()}>
                            Add New Group
                        </button>
                    </div>
                    <div className="groups">
                        {state.groups.list.map((group) => (
                            <button
                                className="group"
                                key={group.id}
                                type="button"
                                value={group.id}
                                onClick={onClickGroup}
                            >
                                <h2 className="group__name">{group.name}</h2>
                                <p className="group__owner">
                                    {group.description} | {group.createdBy}
                                </p>
                                <span className="group__icon material-symbols-outlined">
                                    chevron_right
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
                <dialog className="modal" ref={dialogRef}>
                    {children}
                    <button
                        aria-label="Close"
                        className="close-modal"
                        onClick={() => dialogRef.current.close()}
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </dialog>
            </>
        );
    }

    return content();
}

export default GroupsView;
