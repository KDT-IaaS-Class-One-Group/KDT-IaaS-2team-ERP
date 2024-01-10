"use client"
import { useEffect, useRef } from 'react';

const KakaoAddressSearch: React.FC<{ onAddressChange: (address: string) => void }> = ({ onAddressChange }) => {
  const scriptRef = useRef<HTMLScriptElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=44a871fd415fcedb85c711d64b6448ab&libraries=services&autoload=false';
    script.async = true;
    script.defer = true;
    script.referrerPolicy = 'no-referrer-when-downgrade';

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('kakao-map');
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);

        const ps = new window.kakao.maps.services.Places();

        const input = document.getElementById('address-input') as HTMLInputElement;
        const searchButton = document.getElementById('search-button');

        searchButton?.addEventListener('click', () => {
          // 주소 검색 API 호출
          fetch(`https://dapi.kakao.com/v2/local/search/address.json?query=${input.value}`, {
            method: 'GET',
            headers: {
              'Authorization': '3ff92f47ab1d80f81211ab37aa891e08',
            },
          })
            .then(response => response.json())
            .then(data => {
              // 검색 결과 확인 (콘솔에 출력)
              console.log(data);

              // 필요한 로직 추가: 예를 들어 첫 번째 결과를 주소로 업데이트
              const address = data.documents[0]?.address_name;
              onAddressChange(address);
            })
            .catch(error => console.error('Error during address search:', error));
        });
      });
    };

    // scriptRef.current = script;
    document.body.appendChild(script);

    return () => {
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current);
      }
    };
  }, [onAddressChange]);

  return (
    <div>
      <input id="address-input" type="text" placeholder="Type the address" />
      <button id="search-button">Search</button>
      <div id="kakao-map" style={{ width: '100%', height: '300px' }} />
    </div>
  );
};

export default KakaoAddressSearch;