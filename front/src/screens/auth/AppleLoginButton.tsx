import React from 'react';
import { Platform } from 'react-native';
import appleAuth, { AppleButton } from '@invertase/react-native-apple-authentication';
import { useAppDispatch } from '../../redux/config/reduxHook';
import { appleLogin } from '../../redux/actions/userAction';


const AppleLoginButton: React.FC = () => {
  const dispatch = useAppDispatch();

  const signInWithApple = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
      
      if (credentialState === appleAuth.State.AUTHORIZED) {
        // user is authenticated
            const { identityToken, email, user } = appleAuthRequestResponse;
            await dispatch(appleLogin(identityToken));
      }

    } catch (error) {
      console.error('Apple sign-in error:', error);
    }
  };

  // iOS에서만 버튼을 렌더링
  if (Platform.OS !== 'ios') return null;

  return (
    <AppleButton
      buttonStyle={AppleButton.Style.BLACK}
      buttonType={AppleButton.Type.SIGN_IN}
      style={{ width: '80%', height: 45, marginBottom: 15 }}
      onPress={signInWithApple}
    />
  );
};

export default AppleLoginButton;