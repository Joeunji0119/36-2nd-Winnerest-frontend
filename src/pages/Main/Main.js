import { React, useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import PinForMain from './PinForMain';

const Main = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const [items, setItems] = useState([]);

  const observerRef = useRef(null);
  const page = useRef(0);

  const getItems = async () => {
    page.current += 1;

    const { data } = await axios(
      `${process.env.REACT_APP_BASEURL}/pins?pageSize=10&page=${page.current}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    setItems(prevState => [...data.data, ...prevState]);
  };

  useEffect(() => {
    if (!token) {
      alert('로그인이 필요한 서비스입니다!');
      navigate('/auth/signIn');
    }
    if (token) {
      const options = {
        root: null,
        rootMargin: '0px 10px 10px 10px',
        threshold: 1,
      };

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            console.log(entry.isIntersecting, 'data 가져오는 중');
            getItems();
          }
        });
      }, options);
      observer.observe(observerRef.current);
      console.log('옵저버 연결');
      return () => {
        console.log('옵저버 해제');
        observer.disconnect();
      };
    }
  }, [items]);
  console.log('get완료');

  return (
    <div style={{ background: 'beige' }}>
      <MainLayout>
        <MainStyle>
          {items.map((item, id) => {
            return <PinForMain key={id} {...item} />;
          })}
        </MainStyle>
        <div style={{ height: '20px', background: 'red' }} ref={observerRef} />
      </MainLayout>
    </div>
  );
};
const MainLayout = styled.div`
  width: 100%;
  height: auto;
  margin-top: 100px;
`;

const MainStyle = styled.div`
  margin: 0 auto;
  max-width: 2000px;
  column-count: 5;
  column-gap: 1em;
`;

export default Main;
