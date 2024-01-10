import { useState } from 'react';
import DaumPostcodeEmbed from 'react-daum-postcode';

const AddressSearchModal = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${searchQuery}`,
        {
          headers: {
            Authorization: 'KakaoAK 3ff92f47ab1d80f81211ab37aa891e08',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setSearchResults(data.documents);
      console.log(data)
    } catch (error) {
      console.error('Error searching for address:', error);
    }
  };

const Postcode = () => {
  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    console.log(fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
  };

  return <DaumPostcodeEmbed onComplete={handleComplete} {...props} />;
};

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>검색</button>

      <ul>
        {searchResults.map((result) => (
          <li key={result.address_name}>{result.adress_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default AddressSearchModal;