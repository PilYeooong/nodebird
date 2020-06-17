import React, { useCallback, useState, useEffect, useRef } from "react";
import { Form, Input, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { ADD_POST_REQUEST, UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE } from "../reducers/post";
import { backUrl } from "../config/config";

const PostForm = () => {
  const { imagePaths, isAddingPost, postAdded } = useSelector(
    (state) => state.post
  );
  const imageInput = useRef();
  const [text, setText] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    setText("");
  }, [postAdded === true]);
  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (!text || !text.trim()) {
        return alert("게시글을 작성하세요! ");
      }
      const formData = new FormData();
      imagePaths.forEach((i) => {
        formData.append('image', i);
      });
      formData.append('content', text);
      dispatch({
        type: ADD_POST_REQUEST,
        data: formData
      });
    },
    [text, imagePaths]
  );

  const onChageText = useCallback((e) => {
    setText(e.target.value);
  }, []);

  const onChangeImages = useCallback((e) => {
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append('image', f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData
    })
  }, [])

  const onClickImageUpload = useCallback(() => {
    // 이 function이 실행될때 imageInput이 클릭되도록
    imageInput.current.click();
  }, [imageInput.current]);
  const onRemoveImage = useCallback((index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      index
    })
  }, []);
  return (
    <Form
      style={{ margin: "10px 0 20px" }}
      encType="multipart/form-data"
      onSubmit={onSubmitForm}
    >
      <Input.TextArea
        maxLength={140}
        placeholder="어떤 신기한 일이 있었나요?"
        value={text}
        onChange={onChageText}
      />
      <div>
        <input
          type="file"
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
        />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button
          type="primary"
          style={{ float: "right" }}
          htmlType="submit"
          loading={isAddingPost}
          onClick={onSubmitForm}
        >
          짹짹
        </Button>
      </div>
      <div>
        {imagePaths.map((v,i) => (
          <div key={v} style={{ display: "inline-block" }}>
            <img
              src={`${backUrl}/${v}`}
              style={{ width: "200px" }}
              alt={v}
            />
            <div>
              <Button onClick={onRemoveImage(i)}>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
