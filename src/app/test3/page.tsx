"use client"
import { useState, useEffect } from "react";
import { Input, Button } from "@chakra-ui/react";
import styled from "styled-components";
import { useRouter } from 'next/navigation';
import { useSearchParams } from "next/navigation"
import Search from "@/components/test/modal";

const App = () => {
  const router = useRouter();

  const searchParams = useSearchParams()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState<boolean>(false);
  const [detailAddress, setDetailAddress] = useState<string>("");
  
  const postcode = searchParams.get('postcode')
  const address = searchParams.get('address')

  const handleSearch = () => {
    router.push("/search");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
  };

  useEffect(() => {
    if (postcode && address && detailAddress) {
      setIsFormComplete(true);
    } else {
      setIsFormComplete(false);
    }
  }, [postcode, address, detailAddress]);

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <AdressWrapper>
          <PostCodeAndButton>
            <Input
              m="3px"
              size="md"
              type="text"
              placeholder="우편번호"
              value={postcode || ""}
              readOnly
            />
            <Input
              m="3px"
              size="md"
              type="button"
              onClick={handleSearch}
              value="주소 검색"
            />
            <button onClick={() => setIsModalOpen(true)}>주소 검색</button>
              <Search open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                모달 내용
              </Search>
          </PostCodeAndButton>
          <Input
            m="3px"
            size="md"
            type="text"
            placeholder="주소"
            value={address || ""}
            readOnly
          />
          <Input
            m="3px"
            size="md"
            type="text"
            placeholder="상세주소"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
          />
        </AdressWrapper>
        <ButtonWrapper>

        </ButtonWrapper>
      </form>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const AdressWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostCodeAndButton = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

export default App;