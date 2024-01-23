'use client'
import { ReactNode, useEffect } from 'react';
import ReactDOM from "react-dom";
import DaumPostcode from 'react-daum-postcode';
import { useRouter } from 'next/navigation';
import getAddress from '@/components/test/getadress';
import styles from "@/styles/Modal.module.scss";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  onSelectAddress: (data: any) => void;
  onSelectZonecode: (zonecode: any) => void;
}

const Search = ({ open, onClose, onSelectAddress, onSelectZonecode, children }: ModalProps) => {
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
    const address = getAddress(data)
    onSelectAddress(address);
    onSelectZonecode(data.zonecode);
    // router.push(`/singup/?postcode=${data.zonecode}&address=${encodeURIComponent(address)}`);
  };

 
  if (!open) return null;

  return ReactDOM.createPortal(
    <>
      <div className={styles.overlayStyle} />
      <div className={styles.modalStyle}>
  
      <DaumPostcode onComplete={handleComplete} />
  
    
        <button onClick={onClose}>닫기</button>
  
      </div>
    </>,
    document.getElementById("global-modal") as HTMLElement
  );
};
   
export default Search;