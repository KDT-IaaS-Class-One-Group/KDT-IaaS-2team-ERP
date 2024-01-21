import React from 'react';
import { GoogleLoginButton, FacebookLoginButton  } from 'react-social-login-buttons';

class SocialLogin extends React.Component {
  state = {
    loggedInUser: null,
  };

  handleSocialLogin = (user: any) => {
    console.log(user);
    this.setState({ loggedInUser: user });
    // 여기에서 실제 로그인 성공 시 처리 로직을 추가하세요.
  };

  handleSocialLoginFailure = (err: any) => {
    console.error(err);
    // 여기에서 소셜 로그인 실패 시 처리 로직을 작성하세요.
  };

  render() {
    return (
      <div>
        <GoogleLoginButton
          onClick={() => console.log('Google button clicked')}
          onSuccess={this.handleSocialLogin}
          onFailure={this.handleSocialLoginFailure}
        />
        {/* <FacebookLoginButton
          onClick={() => console.log('Facebook button clicked')}
          onSuccess={this.handleSocialLogin}
          onFailure={this.handleSocialLoginFailure}
        /> */}

        {this.state.loggedInUser && (
          <div>
            <p>로그인 성공!</p>
            <p>사용자 이름: {this.state.loggedInUser.name}</p>
          </div>
        )}
      </div>
    );
  }
}

export default SocialLogin;