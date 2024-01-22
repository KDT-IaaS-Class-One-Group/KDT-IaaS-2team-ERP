'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt, { JwtPayload } from 'jsonwebtoken';
import styles from '@/styles/myinfo.module.scss'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Search from "@/components/test/modal";
interface UserInfo {
  userId: string;
  name: string;
  birthdate: string;
  phoneNumber: string;
  email: string;
  postcode: string;
  address: string;
  detailaddress: string;
  gender: string;
}

export default function MyPageinfo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleSearch = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getaddress = (data : any) => {
    console.log(data)
    const  address1 = data;
    // 필요한 주소 정보를 조합하여 주소 문자열 반환
    return address1
  };

  const handleSelectaddress = (data: any) => {
    const address = getaddress(data);
   
    setIsModalOpen(false);

    setUserInfo((prevInfo) =>
    prevInfo
    ? { ...prevInfo, address: address }
      : { userId: '', name: '', birthdate: '', phoneNumber: '' , email: '', postcode: '', address: address, detailaddress: '', gender: '' }
  )
}
    


  const handleSelectZonecode = (data: any) => {
    const postcodeData = getaddress(data);
    setUserInfo((prevInfo) =>
    prevInfo
    ? { ...prevInfo, postcode: postcodeData }
      : { userId: '', name: '', birthdate: '', phoneNumber: '' , email: '', postcode: postcodeData, address: '', detailaddress: '', gender: '' }
  )
  };
  

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    if (!storedToken) {
      router.push('/login');
    } else {
      // 토큰에서 사용자 정보를 읽어와서 화면에 표시
      loadUserFromToken(storedToken);
    }
  }, [router]);

  const loadUserFromToken = (token: string) => {
    try {
      const decodedToken = jwt.decode(token) as JwtPayload;

      if (decodedToken) {
        const { userId, name, birthdate, phoneNumber, email, postcode , address, detailaddress, gender } = decodedToken;

        const birthdateDate = new Date(birthdate);

      // 로컬 시간으로 변환된 문자열 얻기
        const birthdateLocalString = birthdateDate.toLocaleDateString();

        const userInformation: UserInfo = {
          userId,
          name,
          birthdate: birthdateLocalString,
          phoneNumber,
          email,
          postcode,
          address,
          detailaddress,
          gender,
        };

        setUserInfo(userInformation);
      } else {
        console.error('토큰이 유효하지 않습니다.');
        // userInfo가 null인 경우 초기화
        setUserInfo(null);
      }
    } catch (error) {
      console.error('토큰 해석 오류:', error);
      // userInfo가 null인 경우 초기화
      setUserInfo(null);
    }
  };

  const handleEditModeToggle = () => {
    setIsEditMode((prevMode) => !prevMode);
  };

  const handleSaveChanges = async () => {
    // 서버에 수정된 정보 전송 및 데이터베이스 업데이트 로직 추가
    
    if (!userInfo) {
      console.error('사용자 정보가 없습니다.');
      return;
    }

    const currentToken = token || '';
    try {
      const response = await fetch('/api/updateUser',{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`
        },

        body: JSON.stringify({
          name: userInfo.name,
          birthdate: userInfo.birthdate,
          phoneNumber: userInfo.phoneNumber,
          email: userInfo.email,
          postcode: userInfo.postcode,           
          address: userInfo.address,
          detailadress: userInfo.detailaddress,        
          gender: userInfo.gender,           
        }),
      });

      if (response.ok) {
        // 수정 모드 종료 및 변경된 사용자 정보 다시 불러오기
        setIsEditMode(false);

        const { token: newToken } = await response.json();

        // 새로운 토큰을 사용하여 로컬 상태 업데이트
        setToken(newToken);
  
        // 서버로부터 새로운 토큰을 발급받기
        const newTokenResponse = await fetch('/api/refreshToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newToken}`
          },
        });
  
        if (newTokenResponse.ok) {
          const { token: newToken } = await newTokenResponse.json();
          localStorage.setItem('token', newToken);
          // 새로운 토큰을 사용하여 사용자 정보를 다시 불러오기
          loadUserFromToken(newToken);

        } else {
          console.error('토큰 갱신 실패:', newTokenResponse.statusText);
        }
      } else {
        console.error('사용자 정보 업데이트 실패:', response.statusText);
      }
    } catch (error) {
      console.error('서버 에러:', error);
    }
  };

  const handleWithdrawal = async () => {
    try {
      const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      });

      if (response.ok) {
        localStorage.removeItem('token');
        setToken(null);
        router.push('/login');
      } else {
        console.error('회원 탈퇴 실패:', response.statusText);
      }
    } catch (error) {
      console.error('서버 에러:', error);
    }
  };
  const handleInputChange = (name: string, value: string) => {
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };
  
  const handlePostcodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    handleInputChange('postcode', value);
  };
  
  // 예를 들어, address 변경 시
  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    handleInputChange('address', value);
  };

  return (
      <div className={styles.myinfo}>
        {/* 사용자 정보를 표시하는 부분 */}
        {userInfo && (
          <div>
            {/* 수정 모드일 때는 입력 폼을 표시 */}
            {isEditMode ? (
              <div className={styles.myinfomodify}>
                 <table className={styles.userinfo}>
                  <tbody>
                    <tr>
                      <td className={styles.item}>사용자 ID</td>
                      <td className={styles.info}>{userInfo.userId}</td>
                    </tr>
                    <tr>
                      <td className={styles.item}>이름</td>
                      <td className={styles.info}>
                        <label>
                          <input
                            type='text'
                            value={userInfo.name}
                            onChange={(e) =>
                              setUserInfo((prevInfo) =>
                                prevInfo
                                  ? { ...prevInfo, name: e.target.value }
                                  : { userId: '', name: e.target.value, birthdate: '', phoneNumber: '', email: '', postcode: '', address: '', detailaddress: '', gender: '' }
                              )
                            }
                          />
                        </label>
                      </td>
                    </tr>
                    <tr>
                    <td className={styles.item}>생년월일</td>
                      <td className={styles.info}>
                        <DatePicker
                          selected={new Date(userInfo.birthdate)}
                          onChange={(date) => {
                            if (date !== null) {
                              setUserInfo((prevInfo) =>
                                prevInfo
                                  ? { ...prevInfo, birthdate: date.toISOString() }
                                  : { userId: '', name: '', birthdate: date.toISOString(), phoneNumber: '', email: '', postcode: '', address: '', detailaddress: '', gender: '' }
                              );
                            }
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.item}>전화번호</td>
                      <td className={styles.info}>
                        <label>
                          <input
                            type='text'
                            value={userInfo.phoneNumber}
                            onChange={(e) =>
                              setUserInfo((prevInfo) =>
                                prevInfo
                                ? { ...prevInfo, phoneNumber: e.target.value }
                                  : { userId: '', name: '', birthdate: '', phoneNumber: e.target.value , email: '', postcode: '', address: '', detailaddress: '', gender: '' }
                              )
                            }
                          />
                        </label>
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.item}>이메일</td>
                      <td className={styles.info}>
                        <label>
                          <input
                            type='text'
                            value={userInfo.email}
                            onChange={(e) =>
                              setUserInfo((prevInfo) =>
                                prevInfo
                                ? { ...prevInfo,  email: e.target.value  }
                                  : { userId: '', name: '', birthdate: '', phoneNumber: '', email: e.target.value  , postcode: '', address: '', detailaddress: '', gender: '' }
                              )
                            }
                          />
                        </label>
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.item}>우편번호</td>
                      <td className={styles.info}>
                        <label>
                          <input
                            type='text'
                            value={userInfo.postcode}
                            onChange={(e) =>
                              setUserInfo((prevInfo) =>
                                prevInfo
                                ? { ...prevInfo, postcode: e.target.value  }
                                  : { userId: '', name: '', birthdate: '', phoneNumber: '', email: '', postcode: e.target.value, address: '', detailaddress: '', gender: '' }
                              )
                            }
                            readOnly
                          />
                        </label>
                        <button onClick={() => setIsModalOpen(true)}>주소 검색</button>
                        <Search
                          open={isModalOpen}
                          onClose={handleCloseModal}
                          onSelectAddress={handleSelectaddress}
                          onSelectZonecode={handleSelectZonecode}
                        >
                          모달 내용
                        </Search>
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.item}>주소</td>
                      <td className={styles.info}>
                        <label>
                          <input
                            type='text'
                            value={userInfo.address}
                            onChange={(e) =>
                              setUserInfo((prevInfo) =>
                                prevInfo
                                ? { ...prevInfo, address: e.target.value  }
                                  : { userId: '', name: '', birthdate: '', phoneNumber: '', email: '', postcode: '', address: e.target.value , detailaddress: '', gender: '' }
                              )
                            }
                            readOnly
                          />
                        </label>
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.item}>상세주소</td>
                      <td className={styles.info}>
                        <label>
                          <input
                            type='text'
                            value={userInfo.detailaddress}
                            onChange={(e) =>
                              setUserInfo((prevInfo) =>
                                prevInfo
                                ? { ...prevInfo, detailaddress: e.target.value  }
                                  : { userId: '', name: '', birthdate: '', phoneNumber: '', email: '', postcode: '', address:'' , detailaddress:  e.target.value , gender: '' }
                              )
                            }
                          />
                        </label>
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.item}>성별</td>
                      <td className={styles.info}>
                        <select
                          name="gender"
                          value={userInfo.gender}
                          onChange={(e) =>
                            setUserInfo((prevInfo) =>
                              prevInfo
                                ? { ...prevInfo, gender: e.target.value }
                                : { userId: '', name: '', birthdate: '', phoneNumber: '', email: '', postcode: '', address: '', detailaddress: '', gender: e.target.value }
                            )
                          }
                        >
                          <option value="">선택하세요</option>
                          <option value="남성">남성</option>
                          <option value="여성">여성</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button onClick={handleSaveChanges}>저장</button>
              </div>
            ) : (
              <div>
                <table className={styles.userinfo}>
                  <tr>
                      <td className={styles.item}>사용자 ID</td>
                      <td className={styles.info}>{userInfo.userId}</td>
                  </tr>
                  <tr>
                      <td className={styles.item}>이름</td>
                      <td className={styles.info}>{userInfo.name}</td>
                  </tr>
                  <tr>
                      <td className={styles.item}>생년월일</td>
                      <td className={styles.info}>{userInfo.birthdate}</td>
                  </tr>
                  <tr>
                      <td className={styles.item}>전화번호</td>
                      <td className={styles.info}>{userInfo.phoneNumber}</td>
                  </tr>
                  <tr>
                      <td className={styles.item}>이메일</td>
                      <td className={styles.info}>{userInfo.email}</td>
                  </tr>
                  <tr>
                      <td className={styles.item}>우편번호</td>
                      <td className={styles.info}>{userInfo.postcode}</td>
                  </tr>
                  <tr>
                      <td className={styles.item}>주소</td>
                      <td className={styles.info}>{userInfo.address}</td>
                  </tr>
                  <tr>
                      <td className={styles.item}>상세주소</td>
                      <td className={styles.info}>{userInfo.detailaddress}</td>
                  </tr>
                  <tr>
                      <td className={styles.item}>성별</td>
                      <td className={styles.info}>{userInfo.gender}</td>
                  </tr>
              </table>

              <button onClick={handleEditModeToggle}>수정</button>
              <button onClick={handleWithdrawal}>회원 탈퇴</button>
              </div>
            )}
          </div>
        )}
      </div>
  );
}