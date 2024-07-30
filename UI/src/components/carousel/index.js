import React from "react";
import caroselOne from "../../assets/images/carosel-1.png";
import caroselTwo from "../../assets/images/carosel-2.png";

const Carousel = () => {
  return (
    <>
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src={caroselOne} className="d-block w-100" alt="..." />
          <div className="carousel-caption d-none d-md-block">
            <p>
              At OpenISO, we believe in the power of seamless data
              synchronization
            </p>
          </div>
        </div>
        <div className="carousel-item">
          <img src={caroselTwo} className="d-block w-100" alt="..." />
          <div className="carousel-caption d-none d-md-block">
            <p>
            Seamlessly Convert Addresses to ISO 3166 Format Using Our Advanced Tool
            </p>
          </div>
        </div>
        {/* <div className="carousel-item">
          <img src={caroselOne} className="d-block w-100" alt="..." />
          <div className="carousel-caption d-none d-md-block">
            <p>
              Our mission is to provide cutting-edge synchronization solutions that streamline the way
              people manage and access their data across devices and platforms.
            </p>
          </div>
        </div> */}
      </div>

      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
      </div>
    </>
  );
};

export default Carousel;
