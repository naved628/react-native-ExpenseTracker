import { useContext, useLayoutEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import Button from '../components/UI/Button';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import IconButton from '../components/UI/IconButton';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { GlobalStyles } from '../constant/styles';
import { ExpensesContext } from '../store/expenses-context';
import { deleteExpense, storeExpense, updateExpense } from '../util/http';

function ManageExpense({route, navigation}){
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState();

    const expensesCtx = useContext(ExpensesContext);

    const editedExpenseId = route.params?.expenseId;
    const isEditing = !!editedExpenseId;

    const selectedExpense = expensesCtx.expenses.find(
        (expense) => expense.id === editedExpenseId 
    );

    useLayoutEffect(()=>{
        navigation.setOptions({
            title: isEditing ? 'Edit Expense' : 'Add Expense'
        },[navigation, isEditing])
    });

    async function deleteExpenseHandler(){
        setIsSubmitting(true);
        try {
            await deleteExpense(editedExpenseId);
            expensesCtx.deleteExpense(editedExpenseId);
            navigation.goBack();
        } catch (error) {
            setError('Could not delete expenses - please try again later !!!')
            setIsSubmitting(false);
        }
        
    }

    function cancelHandler(){
        navigation.goBack();
    }

   async function confirmHandler(expenseData){
        setIsSubmitting(true);
        try{
            if(isEditing){
                expensesCtx.updateExpense(editedExpenseId,expenseData);
                await updateExpense(editedExpenseId, expenseData);
            } else{
                console.log(expenseData);
                const id = await storeExpense(expenseData);
                expensesCtx.addExpense({...expenseData, id: id })
            }
            navigation.goBack();
        } catch (error) {
            console.log(error);
            setError('Could not save expenses - please try again later !!!')
            setIsSubmitting(false);
        }
    }


    if(error && !isSubmitting){
       return <ErrorOverlay  message={error} />
    }

    if(isSubmitting){
        return <LoadingOverlay />
    }

    return (
            <View style={styles.container}>
                <ExpenseForm 
                    onCancel={cancelHandler} 
                    onSubmit={confirmHandler}
                    submitButtonLabel={isEditing ? "Update" : "Add"} 
                    defaultValues={selectedExpense}
                />
                
                {isEditing && (
                    <View style={styles.deleteContainer}>
                        <IconButton icon='trash'
                            color={GlobalStyles.colors.error500}
                            size={36}
                            onPress={deleteExpenseHandler}
                        />
                    </View>
                )}
            </View>
            )
}

export default ManageExpense;

const styles= StyleSheet.create({
    container:{
        flex: 1,
        padding: 24,
        backgroundColor: GlobalStyles.colors.primary700
    },
    buttonContainer:{
        display:"flex",
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    button :{
        minWidth:120,
        marginHorizontal:8
    },
    deleteContainer:{
        marginTop:16,
        paddingTop:8,
        borderTopWidth:2,
        borderTopColor:GlobalStyles.colors.primary200,
        alignItems:'center'
    }
})