import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "../../../components";
import Strpper from "../../../components/Staper";
import { BASE_API_URL } from "../../../config";
import CircularProgress from "@mui/material/CircularProgress";

const CompanyLogin = () => {
  const [projectName, setProjectName] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (projectName) {
      setLoading(true);
      var formdata = new FormData();
      formdata.append("title", projectName);

      var requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      await fetch(`${BASE_API_URL}/create-folder`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          localStorage.setItem("project", projectName);
          setLoading(false);
          navigate("/upload-document"); 
        })
        .catch((error) => console.log("error", error));
    } else {
      setLoading(false);
      alert("please enter project name");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row" style={{ padding: 20 }}>
        <Strpper activeStep={0} />
        <div className="col-6 d-flex align-items-center">
          <div className="ss-inr-hero position-relative">
            <div className="page-back-btn">
              <button onClick={() => window.location.replace("/")}>
                <i className="bi bi-chevron-left"></i>
              </button>
            </div>
            <h2>Welcome to OpenISO</h2>
            <h4>Create a new project</h4>

            <div className="frm-hldr">
              <div className="frm-fild d-flex flex-column">
                <label for="">Please Enter Project Name</label>
                <input
                  type="text"
                  placeholder="March-2024"
                  name=""
                  id=""
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>

              {loading ? (
                <button className="cmn-btn">
                  <CircularProgress color="inherit" />
                </button>
              ) : (
                <button className="cmn-btn" onClick={handleLogin}>
                  Save & Next
                </button>
              )}

              <p className="text-center">
                <a href="#!">Don't have a account?</a>
              </p>
            </div>
          </div>
        </div>

        <div className="col-6">
          <div
            id="carouselExampleCaptions"
            className="carousel slide carousel-dark ss-carosel"
            data-bs-ride="carousel"
          >
            <div className="ss-navbtn-hldr">
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>

            <Carousel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogin;
