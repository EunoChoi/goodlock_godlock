import styled from "styled-components";

const ProfileCircle = styled.img<{ src: string; diameter: number }>`
  width: ${(props) => props.diameter + "px"};
  height: ${(props) => props.diameter + "px"};
  border-radius: ${(props) => props.diameter + "px"};
  background-color: white;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.2);
  object-fit: cover;
`;

export default ProfileCircle;
