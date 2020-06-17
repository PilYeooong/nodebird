import React, { useCallback, useEffect } from 'react'
import PropTypes from "prop-types";
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_HASHTAG_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../components/PostCard';

const Hashtag = ({ tag }) => {
  const dispatch = useDispatch();
  const { mainPosts, hasMorePost } = useSelector(state => state.post);
  // useEffect(() => {
  //   dispatch({
  //     type: LOAD_HASHTAG_POSTS_REQUEST,
  //     data: tag,
  //   })
  // }, [])
  const onScroll = useCallback(() => {
    // console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight);
    const lastId = mainPosts[mainPosts.length] && mainPosts[mainPosts.length - 1].id;
    if (
      window.scrollY + document.documentElement.clientHeight >
      document.documentElement.scrollHeight - 300
    ) {
      if (hasMorePost) {
        dispatch({
          type: LOAD_HASHTAG_POSTS_REQUEST,
          lastId,
          data: tag,
        });
      }
    }
  }, [mainPosts.length, hasMorePost]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [mainPosts.length]);

  return (
    <div>
      {mainPosts.map(c => (
        <PostCard key={c.id} post={c} />
      ))}
    </div>
  )
}

Hashtag.propTypes = {
  tag: PropTypes.string.isRequired,
}

Hashtag.getInitialProps = async (context) => {
  const tag = context.query.tag;
  context.store.dispatch({
    type: LOAD_HASHTAG_POSTS_REQUEST,
    data: tag
  })
  return { tag };
}

export default Hashtag
