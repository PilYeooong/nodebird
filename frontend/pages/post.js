import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { LOAD_POST_REQUEST } from "../reducers/post";
import Helmet from "react-helmet";

const Post = ({ id }) => {
  const { singlePost } = useSelector((state) => state.post);
  return (
    <>
      <Helmet
        title={`${singlePost.User.nickname}님의 글`}
        description={singlePost.content}
        meta={[
          {
            name: "description",
            content: singlePost.content,
          },
          { property: 'og:title', content: `${singlePost.User.nickname}님의 게시글`},
          {
            property: 'og:description', content: singlePost.content,
          },
          {
            property: 'og:image', content: singlePost.Images[0] && `${singlePost.Images[0].src}`,
          },
          {
            property: 'og:url', content: `http://ec2-15-165-123-14.ap-northeast-2.compute.amazonaws.com/post/${id}`
          }
        ]}
      />
      <div>{singlePost.content}</div>
      <div>{singlePost.User.nickname}</div>
      <div>
        {singlePost.Images[0] && (
          <img src={`${singlePost.Images[0].src}`} />
        )}
      </div>
    </>
  );
};

Post.getInitialProps = async (context) => {
  context.store.dispatch({
    type: LOAD_POST_REQUEST,
    data: context.query.id,
  });
};

Post.propTypes = {
  id: PropTypes.number.isRequired,
};
export default Post;
