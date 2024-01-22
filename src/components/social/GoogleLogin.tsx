import React from 'react';
import { GoogleLogin as GoogleSignIn } from 'react-google-login';

const GoogleLogin: React.FC = () => {
  const responseGoogle = (response: any) => {
    console.log(response);
    // 여기에서 구글 로그인 후의 로직을 처리합니다.
  };

  return (
    <GoogleSignIn
      clientId="YOUR_CLIENT_ID"
      buttonText="Google 로그인"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={'single_host_origin'}
    />
  );
};

export default GoogleLogin;