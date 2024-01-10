'use client'
import { useState } from 'react';
import AddressSearchModal from '@/components/test/kakaojosu';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <h1>Next.js 주소 검색 모달</h1>
      <button onClick={() => setIsModalOpen(true)}>주소 검색</button>

      {isModalOpen && <AddressSearchModal />}

      {/* 나머지 내용 */}
    </div>
  );
};

export default Home;
