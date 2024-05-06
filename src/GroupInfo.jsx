import { useContext, useState, useEffect } from "react";
import GroupContext from "./GroupContext";

import Popup from "./Popup";

function GroupInfo({ group, setOpenGroupInfo }) {
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");

    const { state, clearGroupError, onLeaveGroup, onDeleteGroup, onAddMember } =
        useContext(GroupContext);
    const [member, setMember] = useState("");
    const [addMemberLoading, setAddMemberLoading] = useState(false);

    const onClickLeaveGroup = () => {
        onLeaveGroup(group.id);
    };

    const onClickDeleteGroup = () => {
        onDeleteGroup(group.id);
    };

    const onClickAddMember = () => {
        setAddMemberLoading(true);
        setMember("");
        onAddMember(member, group.id)
            .then(() => {
                setAddMemberLoading(false);
                setPopupMessage(
                    `Successfully added ${member} into Group ${group.name}`
                );
                setShowPopup(true);
            })
            .catch((err) => {
                setAddMemberLoading(false);
                setPopupMessage(err?.error || "Failed to add member");
                setShowPopup(true);
            });
    };

    useEffect(() => {
        if (state.groups.error) {
            const message = state.groups.error;
            setPopupMessage(message);
            setShowPopup(true);
            clearGroupError();
        }
    }, [state.groups.error]);

    return (
        <div className="group-info">
            <div className="group-view">
                <div className="group-view__header">
                    <h1 className="view-title group-view-title">
                        Groups / {group.name} / Group Setting
                    </h1>
                    <div className="group-view__buttons">
                        <button onClick={onClickLeaveGroup}>Leave Group</button>
                        <button onClick={onClickDeleteGroup}>
                            Delete Group
                        </button>
                        <div className="group-info__control">
                            <button onClick={() => setOpenGroupInfo(false)}>
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="add-member">
                <input
                    type="text"
                    name="username"
                    aria-label="Member Username"
                    placeholder="Member Username"
                    value={member}
                    onChange={(e) => setMember(e.target.value)}
                />
                <button
                    type="button"
                    onClick={onClickAddMember}
                    disabled={addMemberLoading}
                >
                    {addMemberLoading ? "Adding..." : "Add Member"}
                </button>
            </div>
            {showPopup && <Popup setPopup={setShowPopup}>{popupMessage}</Popup>}
            <div className="group-members">
                <h2>Group Members</h2>
                {group.members.map((member) => (
                    <div key={member}>{member}</div>
                ))}
            </div>
        </div>
    );
}

export default GroupInfo;
