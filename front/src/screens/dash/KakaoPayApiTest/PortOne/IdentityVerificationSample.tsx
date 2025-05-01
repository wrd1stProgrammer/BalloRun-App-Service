import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { IdentityVerification } from '@portone/react-native-sdk';

interface IdentityVerificationButtonProps {
  onComplete?: (result: any) => void;
  onError?: (error: any) => void;
  buttonTitle?: string;
}

const IdentityVerificationButton: React.FC<IdentityVerificationButtonProps> = ({
  onComplete,
  onError,
  buttonTitle = '본인인증 시작',
}) => {
  const [showVerification, setShowVerification] = useState(false);

  const handleStartVerification = () => {
    setShowVerification(true);
  };

  const handleVerificationComplete = (result: any) => {
    setShowVerification(false);
    console.log('본인인증 완료', result);
    onComplete?.(result); // 부모 컴포넌트에 결과 전달
  };

  const handleVerificationError = (error: any) => {
    setShowVerification(false);
    console.log('본인인증 실패', error);
    onError?.(error); // 부모 컴포넌트에 에러 전달
  };

  return (
    <View>
      {!showVerification && (
        <Button title={buttonTitle} onPress={handleStartVerification} />
      )}
      {showVerification && (
        <IdentityVerification
          request={{
            storeId: 'store-68c88836-7529-4771-9a3a-ee81b2552a83',
            identityVerificationId: `identity-verification-${Math.random().toString(36).substring(7)}`,
            channelKey: 'channel-key-98a6d285-9698-4b3d-a8ec-f54baf5834bb',
          }}
          onComplete={handleVerificationComplete}
          onError={handleVerificationError}
        />
      )}
    </View>
  );
};

export default IdentityVerificationButton;
