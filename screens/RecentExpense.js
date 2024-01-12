import { useContext, useEffect, useState } from "react";
import AuthContent from "../components/Auth/AuthContent";
import ExpensesOutput from "../components/ExpenseOutput/ExpensesOutput";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { AuthContext } from "../store/auth-context";
import { ExpensesContext } from "../store/expenses-context";
import { getDateMinusDays } from "../util/date";
import { fetchExpenses } from "../util/http";

function RecentExpense(){
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState();

    const expensesCtx = useContext(ExpensesContext);
    const authCtx= useContext(AuthContext);
    const token = authCtx.token;
    console.log(token, 'token data');

    useEffect(()=>{
        async function getExpenses(){
            setIsFetching(true);
            try {
                const expenses = await fetchExpenses();
                expensesCtx.setExpenses(expenses);
            } catch (error) {
                setError('Could not fetch expenses!')
            }
            setIsFetching(false);
        }

        getExpenses();
    },[token])
 
    if(error && !isFetching){
       return <ErrorOverlay  message={error} />
    }

    if(isFetching){
        return <LoadingOverlay />
    }

    const recentExpenses = expensesCtx.expenses.filter((expense)=>{
        const today = new Date();
        const date7DaysAgo = getDateMinusDays(today, 7);

        return (expense.date >= date7DaysAgo) && (expense.date <= today);
    })

    return <ExpensesOutput 
                expenses={recentExpenses} 
                expensesPeriod='Last 7 days'  
                fallbackText='No expenses registered for the last 7 days.'
            />
}

export default RecentExpense;