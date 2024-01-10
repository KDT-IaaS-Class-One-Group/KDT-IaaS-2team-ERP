'use client'
import react, { ReactNode, useEffect } from 'react';
import ReactDOM from "react-dom";
import DaumPostcode from 'react-daum-postcode';
import { useRouter } from 'next/navigation';
import { getAddress } from '@/components/test/getadress';
import styled from 'styled-components';
import { Text } from '@chakra-ui/react';
import styles from "@/styles/Modal.module.scss";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Search = ({ open, onClose, children }: ModalProps) => {
  const router = useRouter();

  useEffect(() => {
    // Handling the back button to go back to the previous page
    const handleBackButton = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      router.back();
    };

    window.addEventListener('beforeunload', handleBackButton);

    return () => {
      window.removeEventListener('beforeunload', handleBackButton);
    };
  }, [router]);

  const handleComplete = (data: any) => {
    const address = getAddress(data);

    router.push(`/singup/?postcode=${data.zonecode}&address=${encodeURIComponent(address)}`);
    onClose()
  };

  if (!open) return null;

  return ReactDOM.createPortal(
    <>
      <div className={styles.overlayStyle} />
      <div className={styles.modalStyle}>
      <Container>
      <Text fontSize="3xl">주소 찾기</Text>
      <DaumPostcode onComplete={handleComplete} />
    </Container>
    
        <button onClick={onClose}>모달 닫기</button>
        {children}
      </div>
    </>,
    document.getElementById("global-modal") as HTMLElement
  );
};
   
const Container = styled.div`
  height: 100vh;
  text-align: center;
`;

export default Search;