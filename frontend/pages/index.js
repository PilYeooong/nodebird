import React, { useEffect, useCallback, useRef } from "react";

import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { useSelector, useDispatch } from "react-redux";
import { LOAD_MAIN_POSTS_REQUEST } from "../reducers/post";

const Home = () => {
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePost } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const countRef = useRef([]);
  // useEffect(() => { // 서버사이드 렌더링 시에는 getInitialProps를 통한 dispatch
  //   dispatch({
  //     type: LOAD_MAIN_POSTS_REQUEST,
  //   })
  // },[]);

  // 제일 아랫 부분 도달시  scrollY(스크롤 내린 거리) + clientHeight(화면의 높이) = scrollHeight(전체 화면 길이)
  const onScroll = useCallback(() => {
    // console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight);
    if (
      window.scrollY + document.documentElement.clientHeight >
      document.documentElement.scrollHeight - 300
    ) {
      if (hasMorePost) {
        const lastId = mainPosts[mainPosts.length - 1].id;
        if(!countRef.current.includes(lastId)){
          dispatch({
            type: LOAD_MAIN_POSTS_REQUEST,
            lastId,
          });
        countRef.current.push(lastId);
        }
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
    <>
      {me && <PostForm />}
      {mainPosts.map((c) => (
        <PostCard key={c.id} post={c} />
      ))}
    </>
  );
};

Home.getInitialProps = async (context) => {
  context.store.dispatch({
    type: LOAD_MAIN_POSTS_REQUEST,
  });
};

export default Home;
