import { createContext, useReducer } from "react";

export const ExpensesContext = createContext({
    expenses: [],
    addExpense: ({description, date, amount}) => {},
    setExpenses:(expenses)=> {},
    updateExpense: (id, {description, date, amount}) => {},
    deleteExpense: (id) => {},
});

function expensesReducer(state, action){
    switch(action.type){
        case 'ADD': 
            return [action.payload,  ...state];
        case 'SET':
            const inverted= action.payload.reverse();
            return inverted; 
        case 'UPDATE':
            const updatableExpenseIndex = state.findIndex(
                (expense) => expense.id === action.payload.id
            );
            const updatableExpense = state[updatableExpenseIndex];
            const updatedItem = {...updatableExpense, ...action.payload.data};
            const updatedExpenses = [...state];
            updatedExpenses[updatableExpenseIndex]= updatedItem;
            return updatedExpenses;

        case 'DELETE':
            return state.filter((expenses)=> expenses.id !== action.payload);

        default: return state;    
    }
}

function ExpensesContextProvider({children}){
    const [expensesState, dispatch] = useReducer(expensesReducer, []);

    function addExpense(expensesData){
        dispatch({type: 'ADD', payload: expensesData});
    }

    function setExpenses(expenses){
        dispatch({type: 'SET', payload:expenses})
    }

    function updateExpense(id, expensesData){
        dispatch({type: 'UPDATE', payload: {id: id, data: expensesData}});
    }

    function deleteExpense(id){
        dispatch({type: 'DELETE', payload: id});
    }

    const value= {
        expenses: expensesState,
        setExpenses: setExpenses,
        addExpense: addExpense,
        updateExpense: updateExpense,
        deleteExpense: deleteExpense
    }

    return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>
}

export default ExpensesContextProvider;