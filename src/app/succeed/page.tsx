'use client'
import { useRouter } from 'next/navigation';
import styled from "styled-components";
import { Button, Text } from "@chakra-ui/react";
import { ChakraProvider } from "@chakra-ui/react";
const Succeed = () => {
  const router = useRouter()
  return (
    <ChakraProvider>
      <Container>
        <Div>
          <TextDiv>
            <Text mb="60px" fontSize="2xl">
              성공적으로 저장되었습니다🥳
            </Text>
          </TextDiv>
          <div>
            <Button
              onClick={() => router.push("/")}
              mr="30px"
              colorScheme="messenger"
            >
              홈으로 돌아가기
            </Button>
          </div>
        </Div>
      </Container>
    </ChakraProvider>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
`;

const TextDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Div = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export default Succeed;