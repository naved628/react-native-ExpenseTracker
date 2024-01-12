import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constant/styles";

function LoadingOverlay({message}){
    return (
        <View style={styles.container}>
            <Text style={styles.message}>{message}</Text>
            <ActivityIndicator size="large" color='white'/>
        </View>
    )
}

export default LoadingOverlay;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        padding:24,
        backgroundColor:GlobalStyles.colors.primary700
    },
    message: {
        fontSize: 16,
        marginBottom: 12,
    },
})