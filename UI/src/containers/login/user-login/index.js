import React from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "../../../components";

const UserLogin = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/upload-document");
  };

  return (
    <div class="container-fluid">
      <div class="row">
        <div class="col-6 d-flex align-items-center">
          <div class="ss-inr-hero position-relative">
            <div class="page-back-btn">
              <button>
                <i class="bi bi-chevron-left"></i>
              </button>
            </div>
            <h2>Welcome Back!!</h2>
            <h4>SSK Enterprises Pvt.Ltd</h4>
            <p>Please fill the below information to login</p>

            <div class="frm-hldr">
              <div class="frm-fild d-flex flex-column">
                <label for="">Email ID</label>
                <input type="text" placeholder="xyz@abc.com" name="" id="" />
              </div>
              <div class="frm-fild d-flex flex-column">
                <label for="">Password</label>
                <input type="password" placeholder="password" name="" id="" />
              </div>
              <div class="d-flex justify-content-between mb-3">
                <div>
                  <input type="checkbox" name="rme" id="" />
                  <label for="rme" class="ms-2">
                    Remember me
                  </label>
                </div>
                <div>
                  <a href="#!">Forgot Password?</a>
                </div>
              </div>
              <button class="cmn-btn" onClick={handleLogin}>
                Login
              </button>
              <p class="text-center">
                <a href="#!">Don't have a account?</a>
              </p>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div
            id="carouselExampleCaptions"
            class="carousel slide carousel-dark ss-carosel"
            data-bs-ride="carousel"
          >
            <div class="ss-navbtn-hldr">
              <button
                class="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide="prev"
              >
                <span
                  class="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button
                class="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide="next"
              >
                <span
                  class="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>

            <Carousel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
