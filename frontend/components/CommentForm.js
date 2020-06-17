import React, { useEffect, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button } from "antd";
import { ADD_COMMENT_REQUEST } from "../reducers/post";

const CommentForm = ({ post }) => {
  const dispatch = useDispatch();
  const { me } = useSelector(state => state.user);

  const [commentText, setCommentText] = useState("");
  const { commentAdded, isAddingComment } = useSelector((state) => state.post);

  const onSubmitComment = useCallback(
    (e) => {
      e.preventDefault();
      if (!me) {
        alert("로그인이 필요합니다.");
        return;
      }
      dispatch({
        type: ADD_COMMENT_REQUEST,
        data: {
          postId: post.id,
          content: commentText,
        },
      });
    },
    [me && me.id, commentText]
  );

  useEffect(() => {
    setCommentText("");
  }, [commentAdded === true]);

  const onChangeCommentText = useCallback((e) => {
    setCommentText(e.target.value);
  }, []);
  return (
    <Form onSubmit={onSubmitComment}>
      <Form.Item>
        <Input.TextArea
          rows={4}
          value={commentText}
          onChange={onChangeCommentText}
        />
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        onClick={onSubmitComment}
        loading={isAddingComment}
      >
        삐약
      </Button>
    </Form>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
}

export default CommentForm;
