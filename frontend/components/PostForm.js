import React, { useCallback, useState, useEffect } from 'react'
import { Form, Input, Button, } from "antd";
import { useSelector, useDispatch } from 'react-redux';
import { ADD_POST_REQUEST } from '../reducers/post';



const PostForm = () => {
  const { imagePaths, isAddingPost, postAdded } = useSelector(state => state.post);
  const [text, setText] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    setText('');
  }, [postAdded === true])
  const onSubmitForm = useCallback((e) => {
    e.preventDefault()
    dispatch({
      type: ADD_POST_REQUEST,
      data: {
        text
      }
    })
  }, [])

  const onChageText = (e) => {
    setText(e.target.value);
  } 

  return (
    <Form style={{ margin: "10px 0 20px" }} encType="multipart/form-data" onSubmit={onSubmitForm}>
          <Input.TextArea
            maxLength={140}
            placeholder="어떤 신기한 일이 있었나요?"
            value={text}
            onChange={onChageText}
          />
          <div>
            <input type="file" multiple hidden />
            <Button>이미지 업로드</Button>
            <Button type="primary" style={{ float: "right" }} htmlType="submit" loading={isAddingPost} onClick={onSubmitForm}>
              짹짹
            </Button>
          </div>
          <div>
            {imagePaths.map((v, i) => (
                <div key={v} style={{ display: "inline-block" }}>
                  <img
                    src={`http://localhost:3065/${v}`}
                    style={{ width: "200px" }}
                    alt={v}
                  />
                  <div>
                    <Button>제거</Button>
                  </div>
                </div>
            ))}
          </div>
        </Form>
  )
}

export default PostForm
