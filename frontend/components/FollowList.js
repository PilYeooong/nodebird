import React, { useCallback, memo } from "react";
import PropTypes from "prop-types";
import { List, Button, Card } from "antd";
import { StopOutlined } from "@ant-design/icons";

const FollowList = memo(({ header, data, hasMore, onClickMore, onClickStop }) => {
  return (
    <List
      style={{ marginBottom: "20px" }}
      grid={{ gutter: 4, xs: 2, md: 3 }}
      size="small"
      header={<div>{header}</div>}
      loadMore={
        hasMore && (
          <Button style={{ width: "100%" }} onClick={onClickMore}>
            더보기
          </Button>
        )
      }
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={{ marginTop: "20px" }}>
          <Card
            actions={[
              <StopOutlined key="stop" onClick={onClickStop(item.id)} />,
            ]}
          >
            <Card.Meta description={item.nickname} />
          </Card>
        </List.Item>
      )}
    />
  );
});

FollowList.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  hasMore: PropTypes.bool.isRequired,
  onClickMore: PropTypes.bool.isRequired,
  onClickStop: PropTypes.func.isRequired,
};

export default FollowList;
