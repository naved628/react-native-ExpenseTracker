import { useContext } from 'react';
import ExpensesOutput from '../components/ExpenseOutput/ExpensesOutput';
import { AuthContext } from '../store/auth-context';
import { ExpensesContext } from '../store/expenses-context';

function AllExpenses(){
    const expensesCtx = useContext(ExpensesContext);
    const authCtx= useContext(AuthContext);
    const token = authCtx.token;
    console.log(token, 'token');

    return <ExpensesOutput 
                expenses={expensesCtx.expenses} 
                expensesPeriod='Total'
                fallbackText='No registered expenses found.'
            />
}

export default AllExpenses;