import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Img = ({
  className,
  id,
  src,
  alt,
  altImg,
  crop,
  loading,
  width,
  height,
  onClick
}: {
  className?: string;
  id?: string;
  src: string;
  alt: string;
  altImg?: string;
  crop?: boolean;
  width?: string;
  height?: string;
  loading?: "lazy" | "eager" | undefined;

  onClick?: () => void;
}) => {
  const [errorCount, setErrorCount] = useState<number>(0);
  const failImg = "/img/loadingFailed.png";

  //에러 발생 시 altImg로 한번 시도하고 또 에러가 발생하면 기본 이미지가 나오도록한다. 무한 루프가 방지된다.

  return (
    <ImgSC
      onClick={onClick}
      crop={crop ? crop : false}
      loading={loading ? loading : undefined}
      className={className}
      id={id}
      src={src}
      alt={alt}
      width={width}
      height={height}
      onError={(e) => {
        console.log("error occur in image loading");
        e.currentTarget.src = altImg ? altImg : "";
        if (errorCount < 10) {
          setErrorCount((c) => (c += 1));
        }
        if (errorCount >= 10) {
          e.currentTarget.src = failImg;
        }
      }}
    />
  );
};

export default Img;

const ImgSC = styled.img<{ crop: boolean }>`
  object-fit: ${(props) => (props.crop ? "cover" : "contain")};

  image-orientation: none;

  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
`;
