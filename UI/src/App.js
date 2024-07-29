import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import {
  Banner,
  CompanyLogin,
  UserLogin,
  UploadDocument,
  Output,
  Process,
  AzureInvoiceResults,
} from "./containers";
import { NavBar } from "./components";
import bg1 from "./assets/images/hm_hero-img.png";
import bg2 from "./assets/images/home_bg.png";
import Progress from "./containers/ssk-upload-document/Progress";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer/index";
import Generate from "./pages/Generate";
import CreateTemplate from "./pages/CreateTemplate";
import Model from "./pages/Model";

function App() {
  const location = useLocation();

  return (
    <>
      <div
        style={{
          backgroundImage:
            location.pathname === "/" ? `url(${bg1}), url(${bg2})` : ""
        }}
        className="home-bg"
      >
        <div className="container-fluid mainDiv">
          <NavBar />
          <Routes>
            <Route path="/" element={<Banner />} />
            <Route path="/scenario-name" element={<CompanyLogin />} />
            <Route path="/user-login" element={<UserLogin />} />
            <Route path="/upload-document" element={<UploadDocument />} />
            <Route path="/results" element={<Output />} />
            <Route
              path="/azure-invoice-results"
              element={<AzureInvoiceResults />}
            />
            <Route path="/processing" element={<Progress />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/generate/:templateName" element={<Generate />} />
            <Route path="/create-template" element={<CreateTemplate />} />
            <Route path="/model" element={<Model />} />

            <Route path="*" element={<strong>Page Not Found!!!</strong>} />
          </Routes>
        </div>
        {location.pathname !== "/"  && <Footer />}
      </div >
    </>
  );
}

export default App;
