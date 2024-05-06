import { useState } from "react";
import "./AddNewGroup.css";

function AddNewGroup({ onAddGroup }) {
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState(false);
    const [description, setDescription] = useState("");
    const [currency, setCurrency] = useState("USD");

    const onChangeName = (e) => {
        setName(e.target.value);
        if (e.target.value.trim() || e.target.value.match(/^[\w]+$/)) {
            setNameError(false);
        }
    };
    const onBlurName = (e) => {
        if (!e.target.value.trim() || !e.target.value.match(/^[\w]+$/)) {
            setNameError(true);
            return;
        } else {
            setNameError(false);
        }
    };

    const onChangeDescription = (e) => {
        setDescription(e.target.value);
    };

    const onClickCurrency = (e) => {
        setCurrency(e.target.textContent);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (name.trim() === "" || !name.match(/^[\w]+$/)) {
            setNameError(true);
            return;
        }
        const newGroup = { name, description, currency };
        onAddGroup(newGroup);
    };

    return (
        <div className="add-new-group">
            <h1 className="add-new-group__title">
                Let&apos;s Create New Group
            </h1>
            <form className="form-new-group" onSubmit={onSubmit}>
                <div className="form-new-group__question">
                    <label>
                        Group Name<span className="asterisk">*</span>
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={onChangeName}
                        onBlur={onBlurName}
                    />
                    {nameError && (
                        <span className="error form-new-group__error">
                            Invalid Name
                        </span>
                    )}
                </div>
                <div className="form-new-group__question">
                    <label>
                        Group Description<span className="asterisk">*</span>
                    </label>
                    <input
                        type="text"
                        value={description}
                        onChange={onChangeDescription}
                    />
                </div>
                <div className="form-new-group__question">
                    <label>Default Currency</label>
                    <div className="form-new-group__currency-btns">
                        <button
                            type="button"
                            className={`form-new-group__currency-btn ${
                                currency === "USD" ? `chosen` : ``
                            }`}
                            onClick={onClickCurrency}
                        >
                            USD
                        </button>
                        <button
                            type="button"
                            className={`form-new-group__currency-btn ${
                                currency === "TWD" ? `chosen` : ``
                            }`}
                            onClick={onClickCurrency}
                        >
                            TWD
                        </button>
                    </div>
                </div>
                <button className="form-new-group__submit" type="submit">
                    Create
                </button>
                <p className="reminder">
                    Please fill all fields that have an asterisk(*).
                </p>
            </form>
        </div>
    );
}

export default AddNewGroup;
