import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Img = ({
  className,
  src,
  alt,
  altImg,
  crop,
  loading,
  onClick
}: {
  className?: string;
  src: string;
  alt: string;
  altImg?: string;
  crop?: boolean;
  loading?: "lazy" | "eager" | undefined;

  onClick?: () => void;
}) => {
  const [errorCount, setErrorCount] = useState<number>(0);
  const [altImage, setAltImage] = useState<string>(altImg ? altImg : "");
  const failImg = "/img/loadingFailed.png";

  //에러 발생 시 altImg로 한번 시도하고 또 에러가 발생하면 기본 이미지가 나오도록한다. 무한 루프가 방지된다.

  useEffect(() => {
    if (errorCount != 0) {
      // console.log(src);
      // console.log(errorCount);
      //5가 되기 전까지 alt src 시도, 5일때 실패 이미지로 변경
      if (errorCount >= 10) {
        setAltImage(failImg);
      }
    }
  }, [errorCount]);
  return (
    <ImgSC
      onClick={onClick}
      crop={crop ? crop : false}
      loading={loading ? loading : undefined}
      className={className}
      src={src}
      alt={alt}
      onError={(e) => {
        console.log("error occur in image loading");
        e.currentTarget.src = altImage;
        if (errorCount < 10) {
          setErrorCount((c) => (c += 1));
        }
      }}
    />
  );
};

export default Img;

const ImgSC = styled.img<{ crop: boolean }>`
  object-fit: ${(props) => (props.crop ? "cover" : "contain")};

  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
`;
