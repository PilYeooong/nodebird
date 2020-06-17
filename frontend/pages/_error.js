import React from "react";
import PropTypes from "prop-types";
import Error from "next/error";

const MyError = ({ statusCode }) => {
  return (
    <div>
      <h1>{statusCode} 에러 발생</h1>
    </div>
  );
}

MyError.propTypes = {
  statusCode: PropTypes.number,
}

MyError.defaultProps = {
  statusCode: 400,
}

MyError.getInitalProps = async (context) => {
  const statusCode = context.res ? context.res.statusCode : context.err ? context.err.statusCode : null;
  return { statusCode }
}

export default MyError;