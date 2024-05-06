import { useState, useEffect } from "react";
import "./ImputView.css";

function ImputView({ state, onAddExpense, children, clearExpenseError }) {
    const [selectedGroup, setSelectedGroup] = useState("");

    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState(false);
    const [amount, setAmount] = useState("");
    const [amountError, setAmountError] = useState(false);
    const [description, setDescription] = useState("");
    const [splitType, setSplitType] = useState("equal");
    const [currency, setCurrency] = useState("USD");

    const onChangeTitle = (e) => {
        setTitle(e.target.value);
        if (
            e.target.value.trim() ||
            e.target.value.match(/^[a-zA-Z0-9\s,.!?;:'"(){}[\]-]{1,100}$/)
        ) {
            setTitleError(false);
        }
    };
    const onBlurTitle = (e) => {
        if (
            !e.target.value.trim() ||
            !e.target.value.match(/^[a-zA-Z0-9\s,.!?;:'"(){}[\]-]{1,100}$/)
        ) {
            setTitleError(true);
            return;
        } else {
            setTitleError(false);
        }
    };

    const onChangeAmount = (e) => {
        setAmount(e.target.value);
        if (
            e.target.value.trim() ||
            e.target.value.match(/^\d+(\.\d{1,2})?$/)
        ) {
            setAmountError(false);
        }
    };
    const onBlurAmount = (e) => {
        if (
            !e.target.value.trim() ||
            !e.target.value.match(/^\d+(\.\d{1,2})?$/)
        ) {
            setAmountError(true);
            return;
        } else {
            setAmountError(false);
        }
    };

    // Split Type is not implemented yet
    const onClickSplitType = (e) => {
        if (e.target.value === splitType) {
            return;
        }
        setSplitType(e.target.value);
    };

    const onClickCurrency = (currencyType) => {
        setCurrency(currencyType);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const isTitleValid =
            title.trim() &&
            title.match(/^[a-zA-Z0-9\s,.!?;:'"(){}[\]-]{1,1000}$/);
        const isAmountValid =
            amount.trim() && amount.match(/^\d+(\.\d{1,2})?$/);

        setAmountError(!isAmountValid);
        setTitleError(!isTitleValid);

        if (!isTitleValid || !isAmountValid) {
            return;
        }

        const newExpense = {
            amount,
            title: title,
            description: description,
            groupId: selectedGroup,
            splitType,
            currency,
        };
        onAddExpense(newExpense);

        // Reset the form
        setAmount("");
        setTitle("");
        setDescription("");
    };

    // Make selectedGroup have a default value due to the bug of React select element
    useEffect(() => {
        if (state.groups.list.length !== 0) {
            console.log(state.groups.activeGroup, state.groups.list[0].id);
            setSelectedGroup(
                state.groups.activeGroup || state.groups.list[0].id
            );
        }
    }, [state.groups.activeGroup, state.groups.list]);

    useEffect(() => {
        const selectedGroupObject = state.groups.list.find(
            (group) => group.id === selectedGroup
        );
        if (selectedGroupObject && selectedGroupObject.currency) {
            setCurrency(selectedGroupObject.currency);
        }
    }, [selectedGroup]);

    if (state.groups.loading) {
        return <p>Loading</p>;
    }
    if (state.groups.list.length === 0) {
        return <>{children}</>;
    }

    return (
        <div className="input-view">
            <form className="input-form" onSubmit={onSubmit}>
                <div className="input-form__question">
                    <label htmlFor="selected-group">Group</label>
                    <select
                        id="selected-group"
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                    >
                        {state.groups.list.map((group) => {
                            return (
                                <option key={group.id} value={group.id}>
                                    {group.name}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className="input-form__question">
                    <label htmlFor="title">
                        Title<span className="asterisk">*</span>
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onBlur={onBlurTitle}
                        onChange={onChangeTitle}
                        placeholder="I bought..."
                    />
                    {titleError && (
                        <p className="input-form__error">
                            Invalid title. You have to fill it in and should
                            only type common charactors.
                        </p>
                    )}
                </div>
                <div className="input-form__question">
                    <label htmlFor="amount">
                        Amount<span className="asterisk">*</span>
                    </label>
                    <div className="amount-currency">
                        <input
                            id="amount"
                            type="text"
                            value={amount}
                            onBlur={onBlurAmount}
                            onChange={onChangeAmount}
                            placeholder="0.00"
                        />
                        <div
                            className="input-form__currency-btns"
                            aria-label="Currency"
                        >
                            {["USD", "TWD"].map((currencyType) => {
                                return (
                                    <button
                                        key={currencyType}
                                        type="button"
                                        className={`input-form__currency-btn ${
                                            currencyType === currency
                                                ? `chosen`
                                                : ``
                                        }`}
                                        onClick={() =>
                                            onClickCurrency(currencyType)
                                        }
                                    >
                                        {currencyType}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {amountError && (
                        <p className="input-form__error">
                            Invalid amount. You must type number.
                        </p>
                    )}
                </div>
                <div className="input-form__question">
                    <label htmlFor="description">Note</label>
                    <textarea
                        id="description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Additional information"
                    />
                </div>
                {/* Split Type is not implemented yet
                <div className="input-form__question">
                    <label>Split type: </label>
                    <div className="split-type-set">
                        {["equal", "shared", "fixed"].map((type) => {
                            return (
                                <button
                                    key={type}
                                    value={type}
                                    type="button"
                                    className={
                                        splitType === type ? "chosen" : ""
                                    }
                                    onClick={onClickSplitType}
                                >
                                    {type}
                                </button>
                            );
                        })}
                    </div>
                </div> 
                */}
                <button className="submit-button" type="submit">
                    Submit
                </button>
                <p className="reminder">
                    Please fill all fields that have an asterisk(*).
                </p>
            </form>
            {state.expenses.error && (
                <div className="expense-error">
                    <p>{state.expenses.error}</p>
                    <button onClick={clearExpenseError}>X</button>
                </div>
            )}
        </div>
    );
}

export default ImputView;
