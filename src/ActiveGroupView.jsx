import { useContext, useState } from "react";
import GroupContext from "./GroupContext";

import ActiveExpenseView from "./ActiveExpenseView";
import GroupInfo from "./GroupInfo";

function ActiveGroupView() {
    const { state, onCloseGroup, onOpenExpense } = useContext(GroupContext);

    const [openGroupInfo, setOpenGroupInfo] = useState(false);

    const group = state.groups.list.find(
        (g) => g.id === state.groups.activeGroup
    );

    // Double check if the expenses are belong to the active group
    const expenses = state.expenses.list.filter(
        (e) => e.groupId === state.groups.activeGroup
    );

    function toDefaultCurrency(amount, currency) {
        if (group.currency === "TWD") {
            if (currency === "TWD") {
                return amount;
            } else {
                return amount * 31;
            }
        }
        if (group.currency === "USD") {
            if (currency === "TWD") {
                return amount / 31;
            } else {
                return amount;
            }
        }
    }
    // Calculate the total amount of expenses
    let totalAmount = 0;
    expenses.forEach((expense) => {
        totalAmount += Number(
            toDefaultCurrency(expense.amount, expense.currency)
        );
    });
    const owedAmount = (totalAmount / group.members.length).toFixed(2);

    const onClickCloseGroup = () => {
        onCloseGroup();
    };

    const onClickExpense = (e) => {
        const expenseId = e.currentTarget.value;
        onOpenExpense(expenseId);
        console.log("open expense", expenseId);
    };

    // Add member view
    if (openGroupInfo) {
        return <GroupInfo group={group} setOpenGroupInfo={setOpenGroupInfo} />;
    }

    function renderExpenses() {
        if (expenses.length === 0) {
            return <p>No expenses</p>;
        }
        return (
            <>
                <div className="group-expenses">
                    {expenses.map((expense) => (
                        <button
                            className="group-expense"
                            key={expense.id}
                            value={expense.id}
                            type="button"
                            onClick={onClickExpense}
                        >
                            <div className="group-expense__item">
                                <div className="expense-group__date">
                                    {expense.createdAt.toDateString()}
                                </div>
                                <div className="expense-group__title">
                                    {expense.title}
                                </div>
                            </div>
                            <div>
                                ${expense.amount} {expense.currency}
                            </div>
                        </button>
                    ))}
                </div>
                <div className="owe">
                    You need to pay ${owedAmount} {group.currency}
                </div>
            </>
        );
    }

    // Active group view
    return (
        <>
            {state.expenses.activeExpense ? (
                <ActiveExpenseView />
            ) : (
                <div className="group-view">
                    <div className="group-view__header">
                        <h1 className="view-title group-view-title">
                            Groups / {group.name}
                        </h1>
                        <div className="group-view__buttons">
                            <button onClick={() => setOpenGroupInfo(true)}>
                                Group Setting
                            </button>
                            <button
                                className="group-view__back"
                                onClick={onClickCloseGroup}
                            >
                                Back
                            </button>
                        </div>
                    </div>

                    {state.expenses.error && (
                        <p className="error">{state.expenses.error}</p>
                    )}

                    {renderExpenses()}
                </div>
            )}
        </>
    );
}

export default ActiveGroupView;
