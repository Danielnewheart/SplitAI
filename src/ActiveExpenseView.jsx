import { useContext } from "react";
import GroupContext from "./GroupContext";

function ActiveExpenseView() {
    const { state, onCloseExpense } = useContext(GroupContext);
    const expense = state.expenses.list.find(
        (e) => e.id === state.expenses.activeExpense
    );
    return (
        <div className="active-expense-view">
            <div className="group-expense active-expense">
                <div className="group-expense__item active-expense">
                    <div className="expense-group__date">
                        {expense.createdAt.toDateString()}
                    </div>
                    <h1 className="expense-group__title active-expense">
                        {expense.title}
                    </h1>
                </div>
                <div>Paid By: {expense.paidBy}</div>
                <div>Note: {expense.description}</div>
                <div>
                    ${expense.amount} {expense.currency}
                </div>
            </div>
            <button onClick={() => onCloseExpense()}>Back</button>
        </div>
    );
}

export default ActiveExpenseView;
