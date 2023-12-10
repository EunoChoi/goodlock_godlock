import styled from "styled-components";

const ProfileCircle = styled.img<{ src: string; diameter: number }>`
  width: ${(props) => props.diameter + "px"};
  height: ${(props) => props.diameter + "px"};
  border-radius: ${(props) => props.diameter + "px"};
  background-color: white;

  border: 2px solid rgba(0, 0, 0, 0.1);
  object-fit: cover;
`;

export default ProfileCircle;
