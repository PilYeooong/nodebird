import React, { useState } from "react";
import PropTypes from "prop-types";
import Slick from "react-slick";

import { Overlay, Header, H1, SlickWrapper, ImageWrapper, CloseBtn, Indicator } from "./ImagesZoomStyle";

const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  return (
    <Overlay>
      <Header>
        <H1>상세 이미지</H1>
        <CloseBtn onClick={onClose} />
      </Header>
      <SlickWrapper>
        <Slick
          initialSlide={0}
          afterChange={(slide) => setCurrentSlide(slide)}
          infinite={false}
          arrows
          slidesToShow={1}
          slidesToScroll={1}
        >
          {images.map((v) => {
            return (
              <ImageWrapper key={v}>
                <img
                  src={`${v.src}`}
                />
              </ImageWrapper>
            );
          })}
        </Slick>
        <div>
          <Indicator>
            <div>
              {currentSlide + 1} / {images.length}
            </div>
          </Indicator>
        </div>
      </SlickWrapper>
    </Overlay>
  );
};
ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
