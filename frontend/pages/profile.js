import React, { useCallback } from "react";
import NicknameEditForm from "../components/NicknameEditForm";
import { useDispatch, useSelector } from "react-redux";
import {
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  REMOVE_FOLLOWER_REQUEST,
  UNFOLLOW_USER_REQUEST,
} from "../reducers/user";
import { LOAD_USER_POSTS_REQUEST } from "../reducers/post";
import PostCard from "../components/PostCard";
import FollowList from "../components/FollowList";

const Profile = () => {
  const dispatch = useDispatch();
  const {
    followingList,
    followerList,
    hasMoreFollower,
    hasMoreFollowing,
  } = useSelector((state) => state.user);
  const { mainPosts } = useSelector((state) => state.post);

  const onUnFollow = useCallback(
    (userId) => () => {
      dispatch({
        type: UNFOLLOW_USER_REQUEST,
        data: userId,
      });
    },
    []
  );

  const onRemoveFollower = useCallback(
    (userId) => () => {
      dispatch({
        type: REMOVE_FOLLOWER_REQUEST,
        data: userId,
      });
    },
    []
  );

  const loadMoreFollowings = useCallback(() => {
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
      offset: followingList.length,
    });
  }, [followingList.length]);

  const loadMoreFollowers = useCallback(() => {
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
      offset: followerList.length,
    });
  }, [followerList.length]);

  return (
    <>
      <NicknameEditForm />
      <FollowList
        header="팔로잉 목록"
        data={followingList}
        hasMore={hasMoreFollowing}
        onClickMore={loadMoreFollowings}
        onClickStop={onUnFollow}
      />
      <FollowList
        header="팔로워 목록"
        data={followerList}
        hasMore={hasMoreFollower}
        onClickMore={loadMoreFollowers}
        onClickStop={onRemoveFollower}
      />
      <div>
        {mainPosts.map((c) => (
          <PostCard key={c} post={c} />
        ))}
      </div>
    </>
  );
};

Profile.getInitialProps = async (context) => {
  const state = context.store.getState();

  context.store.dispatch({
    type: LOAD_FOLLOWERS_REQUEST,
    data: state.user.me && state.user.me.id,
  });
  context.store.dispatch({
    type: LOAD_FOLLOWINGS_REQUEST,
    data: state.user.me && state.user.me.id,
  });
  context.store.dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: state.user.me && state.user.me.id,
  });
};

export default Profile;
