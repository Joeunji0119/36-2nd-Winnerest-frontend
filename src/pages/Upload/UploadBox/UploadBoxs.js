import React, { useState, useRef, useEffect } from 'react';
import * as S from './UploadBoxsStyle';
import TagList from './TagList/TagList';
import Button from '../../../components/Button/Button';
import Modal from '../../../components/Modal/Modal';
import { textResize, toggleModal } from '../../../util';
import {
  uploadImage,
  getUser,
  getBoards,
  createBoard,
} from '../../../uploadConfig';

const UploadBoxs = () => {
  //Modal
  const [isDelete, setIsDelete] = useState(false);
  const [isBoard, setIsBoard] = useState(false);
  const [isTag, setIsTag] = useState(false);
  const [isModal, setIsModal] = useState(false);

  //PostContent
  const [boardTitle, setBoardTitle] = useState('');
  const [fileImage, setFileImage] = useState('');
  const [createBoardName, setcreateBoardName] = useState('');
  const [tags, setTags] = useState([]);

  const [pinContent, setPinContent] = useState({
    title: '',
    content: '',
  });

  //getUser
  const [userInfo, setUserInfo] = useState('');
  const [getBoard, setGetBoard] = useState('');
  const [boardId, setBoardId] = useState('');

  //errCatch
  const [errMessage, setErrMessage] = useState('');
  const [catchErr, setCatchErr] = useState(false);

  useEffect(() => {
    getUser(setUserInfo);
  }, []);

  useEffect(() => {
    getBoards(setGetBoard);
  }, []);

  const setPinInput = e => {
    const { name, value } = e.target;
    setPinContent({ ...pinContent, [name]: value });
  };

  const saveFileImage = e => {
    setFileImage(URL.createObjectURL(e.target.files[0]));
  };

  const updateImage = async (
    tags,
    setCatchErr,
    pinContent,
    setIsModal,
    setErrMessage,
    boardId,
    fileImage
  ) => {
    const file = document.getElementById('imageFile').files[0];
    return await uploadImage(
      file,
      tags,
      setCatchErr,
      pinContent,
      setIsModal,
      setErrMessage,
      boardId,
      fileImage
    );
  };

  /* modal */

  const deleteRef = useRef();
  const boardRef = useRef();

  const onClickOutside = e => {
    if (isDelete && !deleteRef.current.contains(e.target)) {
      toggleModal(setIsDelete, isDelete);
    } else if (isBoard && !boardRef.current.contains(e.target)) {
      toggleModal(setIsBoard, isBoard);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
  });

  const selectBoardTitle = title => {
    setBoardTitle(title);
    setIsBoard(isBoard => !isBoard);
  };

  const setBoardName = e => {
    setcreateBoardName(e.target.value);
  };

  const BoardSetting = (
    <>
      <S.CreateBoardTitle>보드 만들기</S.CreateBoardTitle>
      <S.BoardCreateName
        placeholder="보드 이름을 적어주세요"
        onChange={setBoardName}
      />
    </>
  );

  return (
    <S.UploadBoxDiv>
      <S.UploadBox>
        <S.UploadBoxContainer>
          <S.UploadHead>
            <S.BackgroundImg onClick={() => toggleModal(setIsDelete, isDelete)}>
              <S.ImgTag src="/image/more.png" alt="seeMore" />
            </S.BackgroundImg>
            {isDelete && (
              <S.ModalModel ref={el => (deleteRef.current = el)}>
                <S.DeleteModalContent>삭제</S.DeleteModalContent>
              </S.ModalModel>
            )}

            {isBoard && (
              <S.BoardBox ref={el => (boardRef.current = el)}>
                <S.BoardText>모든보드</S.BoardText>

                {getBoard.map((titles, idx) => (
                  <S.UserBox
                    onClick={() => {
                      selectBoardTitle(titles.title);
                      setBoardId(titles.id);
                    }}
                    key={idx}
                  >
                    <S.ImgTag
                      src={
                        titles.imgUrl === null
                          ? '/image/image.png'
                          : titles.imgUrl
                      }
                      alt="sample"
                    />
                    <S.BoardText>{titles.title}</S.BoardText>
                  </S.UserBox>
                ))}

                <S.BoardLine />
                <S.UserBox onClick={() => setIsModal(true)}>
                  <S.ImgTag src="/image/plus.png" alt="plus" />
                  <S.BoardText>보드만들기</S.BoardText>
                </S.UserBox>
              </S.BoardBox>
            )}

            {isModal && (
              <Modal
                childeren={catchErr ? errMessage : BoardSetting}
                onClose={() => toggleModal(setIsModal, isModal)}
                propsFunction={() => createBoard(createBoardName, setGetBoard)}
              />
            )}

            <S.BoardBtn>
              <S.BoardNameBox onClick={() => toggleModal(setIsBoard, isBoard)}>
                <S.BoardName>{boardTitle}</S.BoardName>
                <S.ImgTag src="/image/down-arrow.png" alt="down-arrow" />
              </S.BoardNameBox>
              {!isBoard && (
                <S.SaveBtn
                  onClick={async () =>
                    await updateImage(
                      tags,
                      setCatchErr,
                      pinContent,
                      setIsModal,
                      setErrMessage,
                      boardId,
                      fileImage
                    )
                  }
                >
                  저장
                </S.SaveBtn>
              )}
            </S.BoardBtn>
          </S.UploadHead>

          <S.UploadBody>
            <S.UploadArea>
              <S.UploadPicture>
                {fileImage && (
                  <>
                    <S.PicturePreview src={fileImage} alt="preview" />
                    <Button
                      position="absolute"
                      width="60px"
                      height="30px"
                      left="0"
                      onClick={() => setFileImage('')}
                    >
                      삭제
                    </Button>
                  </>
                )}
                <S.Border isFileImage={fileImage.length > 1}>
                  <S.ImgTag src="/image/up-arrow.png" alt="up-arrow" />
                  <S.SpanText>드래그하거나 클릭하여 업로드</S.SpanText>
                  <S.InputPicture
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={saveFileImage}
                  />
                </S.Border>
              </S.UploadPicture>
            </S.UploadArea>

            <S.UploadContent>
              <S.UploadUserBox>
                <S.UploadUserProfile
                  src={
                    userInfo.profileUrl === null
                      ? '/image/user.png'
                      : userInfo.profileUrl
                  }
                />
                <S.UploadUserName>{userInfo.nickname}</S.UploadUserName>

                <Button
                  size="medium"
                  color="middleGrey"
                  hoverColor="hoverGrey"
                  width="100px"
                  onClick={() => toggleModal(setIsTag, isTag)}
                >
                  태그선택
                </Button>
              </S.UploadUserBox>

              {isTag && <TagList setTags={setTags} />}
              <S.InputArea>
                <S.UploadInput
                  name="title"
                  placeholder="제목 추가"
                  onKeyUp={e => textResize(e, '55px')}
                  onKeyDown={e => textResize(e, '55px')}
                  onChange={setPinInput}
                  maxLength={100}
                />
                <S.Line />
              </S.InputArea>
              <S.InputArea>
                <S.UploadInputContent
                  name="content"
                  placeholder="사람들에게 회원님의 핀에 대해 설명해 보세요"
                  onKeyUp={e => textResize(e, '40px')}
                  onKeyDown={e => textResize(e, '40px')}
                  onChange={setPinInput}
                  maxLength={200}
                />
                <S.Line />
              </S.InputArea>
            </S.UploadContent>
          </S.UploadBody>
        </S.UploadBoxContainer>
      </S.UploadBox>
    </S.UploadBoxDiv>
  );
};

export default UploadBoxs;
