import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const PinForMain = ({ url, pinId, id }) => {
  const [visibleModal, setVisibleModal] = useState(false);

  const getPin = () => {
    setVisibleModal(!visibleModal);
  };
  return (
    <Link to={`/pins/${pinId}`}>
      <PinItem id={id}>
        <PinImg src={url} />
        <DownloadStartBtn onClick={getPin}>저장</DownloadStartBtn>
        {visibleModal && <DownloadStartBtn> 저장됨 </DownloadStartBtn>}
      </PinItem>
    </Link>
  );
};

const PinItem = styled.article`
  display: inline-flex;
  width: 100%;
  margin-bottom: 1rem;
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
`;

const PinImg = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  &:hover {
    filter: brightness(0.5);
  }
`;

const DownloadStartBtn = styled.div`
  width: 90px;
  height: 70px;
  right: 35px;
  top: 30px;
  padding: 23px 0 20px 0;
  text-align: center;
  position: absolute;
  display: none;
  border-radius: 40px;
  font-size: 23px;
  font-weight: 450;
  background-color: ${({ theme }) => theme.style.basicRed};
  color: #e9e9e9;

  cursor: pointer;
  &:hover {
    filter: brightness(0.5);
  }
  ${PinItem}:hover & {
    display: block;
  }
`;

export default PinForMain;
