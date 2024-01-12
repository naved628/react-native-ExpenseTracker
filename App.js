import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles } from './constant/styles';
import ManageExpense from './screens/ManageExpense';
import RecentExpense from './screens/RecentExpense';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import AllExpenses from './screens/AllExpenses';
import IconButton from './components/UI/IconButton';
import ExpensesContextProvider from './store/expenses-context';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import { useContext } from 'react';

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function ExpensesOverview(){
  const authCtx = useContext(AuthContext);
  return (
    <BottomTabs.Navigator
      screenOptions={({navigation})=>({
        headerStyle:{ backgroundColor: GlobalStyles.colors.primary500},
        headerTintColor:'white',
        tabBarStyle:{ backgroundColor: GlobalStyles.colors.primary500},
        tabBarActiveTintColor: GlobalStyles.colors.accent500,
        headerLeft:({ tintColor }) => (
          <IconButton 
            icon="add" size={24} 
            color={tintColor} onPress={()=> {navigation.navigate('ManageExpense')}}
          />
        ),
        headerRight:({ tintColor }) => (
          <IconButton 
            icon="exit" size={24} 
            color={tintColor} onPress={authCtx.logout}
          />
        )
      })}
    >
      <BottomTabs.Screen name='Recent Expenses' component={RecentExpense}
        options={{
          title:'Recent Expenses',
          tabBarLabel: 'Recent',
          tabBarIcon: ({color, size})=> (
            <Ionicons name="hourglass" size={size} color={color} />
          )
        }}
        />
      <BottomTabs.Screen name='All Expenses' component={AllExpenses}
        options={{
          title:'All Expenses',
          tabBarLabel: 'All Expenses',
          tabBarIcon: ({color, size})=> (
            <Ionicons name="calendar" size={size} color={color} />
          )
        }}
      />
    </BottomTabs.Navigator>
  )
};

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: GlobalStyles.colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle:{backgroundColor: GlobalStyles.colors.primary500},
      headerTintColor:'white'
    }}>
      <Stack.Screen name="ExpensesOverview" component={ExpensesOverview}
        options={{
          headerShown: false
      }}/>
      <Stack.Screen name="ManageExpense" component={ManageExpense} options={{
        presentation: 'modal'
      }}/>
    </Stack.Navigator>
  );
}

function Navigation() {

  const authCtx = useContext(AuthContext);

  return (
      <ExpensesContextProvider>
        <NavigationContainer>
          {!authCtx.isAuthenticated && <AuthStack />}
          {authCtx.isAuthenticated && <AuthenticatedStack />}
        </NavigationContainer>
      </ExpensesContextProvider>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Navigation />
      </AuthContextProvider>
    </>
  );
};