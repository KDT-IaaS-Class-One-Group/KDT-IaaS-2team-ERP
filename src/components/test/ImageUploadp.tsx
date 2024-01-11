import React, { useState } from "react";

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
}

const ImageUploadp: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    try {
      if (!image) {
        console.error("이미지가 선택되지 않았습니다.");
        return;
      }

      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch("/api/uploadImagep", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("이미지 업로드 성공:", data.imageUrl);
        onImageUpload(data.imageUrl); // 이미지 URL을 상위 컴포넌트로 전달
      } else {
        console.error("이미지 업로드 실패:", response.status);
      }
    } catch (error) {
      console.error("이미지 업로드 중 오류 발생:", error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload}>이미지 업로드</button>
    </div>
  );
};

export default ImageUploadp;