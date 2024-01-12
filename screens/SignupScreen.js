import { useContext, useState } from 'react';
import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { AuthContext } from '../store/auth-context';
import { createUser } from '../util/auth';

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating]= useState(false);
  
  const authCtx = useContext(AuthContext);

  async function signupHandler({email, password}){
    setIsAuthenticating(true);
    try{
      const token = await createUser(email, password);
      authCtx.authenticate(token);
    } catch{
      Alert.alert(
        'Authentication failed!',
        'Could not create user, Please check your inputs or try again later!'
      );
      setIsAuthenticating(false);
    }
  }

  if(isAuthenticating){
    return <LoadingOverlay message="Creating User..." />
  }
  return <AuthContent onAuthenticate={signupHandler}/>;
}

export default SignupScreen;