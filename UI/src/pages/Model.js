import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import '../App.css';
import Mask_Group from "../assets/images/Mask_Group.png";
import Google_Gemini from "../assets/images/Google_Gemini.png"
import Strpper from "../components/Staper";

const Model = () => {

  return (
    <div className="container-fluid">
      <div className="ss-inr-hero position-relative mb-4">
        <div className="page-back-btn">
          <button onClick={() => window.location.replace("/#/scenario-name")}>
            <i className="bi bi-chevron-left"></i>
          </button>
        </div>
        <h2>
          <span>Project:</span> {localStorage.getItem("project")}
        </h2>
      </div>
      <Strpper activeStep={1} />
      {/* <div className="row" style={{ padding: 20 }}>
        <div className="col-12 d-flex align-items-center">
          <div className="ss-inr-hero position-relative">
            <div className="page-back-btn">
              <button onClick={() => window.location.replace("/#/scenario-name")}>
                <i className="bi bi-chevron-left"></i>
              </button>
            </div>
            <h2>Please choose your Model</h2>
          </div>
        </div>
      </div> */}
      <div className="row" style={{ padding: 25 }}>
        <div className="col-xl-2 col-lg-1 col-md-1 col-sm-0 d-flex" />
        <div className="col-xl-4 col-lg-5 col-md-5 col-sm-12 d-flex align-items-center justify-content-center">
          <div className="d-flex flex-column">
            <Stack direction="column" spacing={1.3} style={{ alignItems: 'center' }}>
              <Box height={200} width={200} display="flex" alignItems="center" p={3}
                sx={{ border: '0px solid #00000045', boxShadow: 3, borderRadius: "18px", background: 'white' }} onClick={() => window.location.replace("/#/scenario-name")}>
                <img src={Mask_Group} height={150} width={150} style={{ objectFit: "contain" }} />
              </Box>
              <Typography style={{ font: "normal normal normal 14px/20px Montserrat", alignContent: 'center' }}>Notice</Typography>
            </Stack>
          </div>
        </div>

        <div className="col-xl-4 col-lg-5 col-md-5 col-sm-12 d-flex align-items-center justify-content-center">
          <div className="d-flex flex-column">
            <Stack direction="column" spacing={1.3} style={{ alignItems: 'center' }}>
              <Box height={200} width={200} display="flex" alignItems="center" p={3}
                sx={{ border: '0px solid #00000045', boxShadow: 3, borderRadius: "18px", background: 'white' }} onClick={() => window.location.replace("/#/upload-document")}>
                <img src={Google_Gemini} height={150} width={150} style={{ objectFit: "contain" }} />
              </Box>
              <Typography style={{ font: "normal normal normal 14px/20px Montserrat", alignContent: 'center', color: '#000000' }}>Order</Typography>
            </Stack>
          </div>
        </div>
        <div className="col-xl-2 col-lg-1 col-md-1 col-sm-0 d-flex" />
      </div>
    </div>
  );
};

export default Model;
