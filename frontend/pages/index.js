import React from "react";

import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";

const dummy = {
  isLoggedIn: true,
  imagePaths: [],
  mainPosts: [{
    User: {
      id: 1,
      nickname: "필영",
    },
    content: "첫번째 게시글",
    img: 'https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1570&q=80',
  }],
};

const Home = () => {
  return (
    <>
      {dummy.isLoggedIn && <PostForm />}
      {dummy.mainPosts.map((c) => <PostCard key={c} post={c} />
      )}
    </>
  );
};

export default Home;
