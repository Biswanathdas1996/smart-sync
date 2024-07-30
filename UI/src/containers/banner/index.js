import React, { useState } from 'react';
import { BANNED_HEADER, BANNED_MESSAGE } from "../../utils/constants";
import { Box, Stack, Modal } from '@mui/material';
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import demoVideo from "../../assets/images/DemoVideo.mp4"
const Banner = () => {
  const [openDemoVideo, setOpenDemoVideo] = useState(false);
  const openDemoDetail = Boolean(openDemoVideo);

  const handleDetailView = () => {
    setOpenDemoVideo(true);
  };
  const handleDetailsBack = () => {
    setOpenDemoVideo(false);
  };
  return (
    <div className="mainDiv">
      <section className="hm-hero-desc">
        <h1>{BANNED_HEADER}</h1>
        <p>{BANNED_MESSAGE}</p>
        <div className="hero-btnhldr">
          <button
            className="cmn-btn"
            onClick={() => window.location.replace("/#/scenario-name")}
          >
            Try Now <i className="bi bi-chevron-right"></i>
          </button>
          <button className="cmn-btn" >Watch a demo</button>
        </div>
      </section>
      <Modal open={openDemoDetail} anchorEl={openDemoVideo} anchorOrigin={{ vertical: "top", horizontal: "center" }} transformOrigin={{ vertical: "top", horizontal: "center" }}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", p: 3, width: "60%", height: "80%", outline: "none" }}>
          <Stack direction="row" justifyContent="space-between">
            <video autoPlay="true" playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} controls >
              <source src={demoVideo} type="video/mp4" />
            </video>
            <CancelOutlinedIcon style={{ fontSize: "25px", color: "white" }} onClick={handleDetailsBack} />
          </Stack>
        </Box>
      </Modal>
    </div >
  );
};

export default Banner;
