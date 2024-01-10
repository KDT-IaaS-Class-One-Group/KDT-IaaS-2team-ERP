'use client'
import React, { useState, useEffect } from 'react';


const Search = () => {
  const [searchAddress, setSearchAddress] = useState<string>("");
  const [addressResult, setAddressResult] = useState<any[]>();

  const handleSearchAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setSearchAddress(value);
  };


  const SearchMap = (item: string) => {
    const ps = new window.kakao.maps.services.Places();

    const placesSearchCB = function (data: any[], status: any) {
      if (status === window.kakao?.maps.services.Status.OK) {
        setAddressResult(data);
      }
    };
    ps.keywordSearch(`${item}`, placesSearchCB);
  };

  return(
    <div>
      <input
        placeholder="주소 검색"
        onChange={handleSearchAddress}
        autoFocus
        ></input>
    </div>
  )
}