import React, { useCallback } from "react";
import { Card, Avatar, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { LOG_OUT_REQUEST } from "../reducers/user";
import Link from "next/link";
const UserProfile = () => {
  const { me } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const onLogout = useCallback(() => {
    dispatch({
      type: LOG_OUT_REQUEST,
    });
  }, []);
  return (
    <Card
      actions={[
        <Link href="/profile" prefetch key="twit">
          <a>
            <div>
              짹짹
              <br />
              {me && me.Posts.length}
            </div>
          </a>
        </Link>,
        <Link href="/profile" prefetch key="following">
          <a>
            <div>
              팔로잉
              <br />
              {me && me.Followings.length}
            </div>
          </a>
        </Link>,
        <Link href="/profile" prefetch key="follower">
          <a>
            <div>
              팔로워
              <br />
              {me && me.Followers.length}
            </div>
          </a>
        </Link>,
      ]}
    >
      <Card.Meta
        avatar={<Avatar>{me && me.nickname && me.nickname[0]}</Avatar>}
        title={me && me.nickname && me.nickname}
      />
      <Button onClick={onLogout}>로그아웃</Button>
    </Card>
  );
};

export default UserProfile;
