import React, { useEffect, useState } from "react";
import uploadImage from "../../assets/images/img-upload.png";
import googleDriveImage from "../../assets/images/img-gdrive.png";
import dropBoxImgage from "../../assets/images/img-dropbox.png";
import csvImgage from "../../assets/images/img-csv.png";
import xlsImgage from "../../assets/images/img-xls.png";
import Strpper from "../../components/Staper";
import "./style.css";
import { BASE_API_URL } from "../../config";
import Table from "./Table";
import Progress from "./Progress";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import CreateTemplate from "../../pages/CreateTemplate";

const UploadDocument = () => {
  const [step, setStep] = useState(2);
  const [fileData, setFileData] = useState([]);
  const [defaultTemp, setDefaultTemp] = useState(null);
  const [templateResponse, setTemplateResponse] = useState(null);
  const [outPut, setOutput] = useState(null);
  const [newTemp, setNewTemp] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [uploadingTemplate, setUploadingTemplate] = useState(false);
  const [generateOutputcall, setGenerateOutputCall] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  // const getProcessedData = () => {
  //   var formdata = new FormData();
  //   formdata.append("title", "test");

  //   var requestOptions = {
  //     method: "POST",
  //     body: formdata,
  //     redirect: "follow",
  //   };

  //   fetch("http://127.0.0.1:5000/get-process-data", requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       console.log(result);
  //       setProcessedData(result);
  //     })
  //     .catch((error) => console.log("error", error));
  // };

  const processData = async () => {
    const projectName = localStorage.getItem("project");
    var formdata = new FormData();
    formdata.append("title", projectName);

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    await fetch(`${BASE_API_URL}/prepare-data`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("Processed data =======>", result);
        // getProcessedData();
        generateOutput();
      })
      .catch((error) => console.log("error", error));
  };

  // const generateOutput = async () => {
  //   setGenerateOutputCall(true);
  //   var myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");
  //   const projectName = localStorage.getItem("project");
  //   const templateResponse = localStorage.getItem("templateResponse");
  //   var raw = JSON.stringify({
  //     title: projectName,
  //     template: JSON.parse(templateResponse),
  //   });

  //   var requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: "follow",
  //   };

  //   fetch(
  //     `${BASE_API_URL}/generate-response-with-azure-invoice-ai`,
  //     requestOptions
  //   )
  //     .then((response) => response.json())
  //     .then((result) => {
  //       console.log("Processed data =======>", result);
  //       setOutput(result);
  //       navigate("/azure-invoice-results");
  //       setGenerateOutputCall(false);
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //       setError(true);
  //       setGenerateOutputCall(false);
  //     });
  // };
  const generateOutput = async () => {
    setGenerateOutputCall(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const projectName = localStorage.getItem("project");
    const templateResponse = localStorage.getItem("templateResponse");
    var raw = JSON.stringify({
      title: projectName,
      template: JSON.parse(templateResponse),
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${BASE_API_URL}/generate-response`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("Processed data =======>", result);
        setOutput(result);
        navigate("/results");
      })
      .catch((error) => console.log("error", error))
      .finally(() => {
        setGenerateOutputCall(false);
      });
  };

  const handleSave = (selectedStep) => {
    setStep(selectedStep);
  };

  const handleFileUpload = () => {
    const el = document.getElementById("upload-file");
    el.click();
  };

  const handleFileChange = (event) => {
    const selectedFiles = [...fileData];
    for (let i = 0; i < event.target.files.length; i++) {
      selectedFiles.push(event.target.files[i]);
    }
    setFileData(selectedFiles);
  };

  const uploadFilesData = async () => {
    setUploading(true);
    const projectName = localStorage.getItem("project");

    var formdata = new FormData();
    formdata.append("title", projectName);
    for (let i = 0; i < fileData.length; i++) {
      formdata.append("files[]", fileData[i]);
    }
    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    await fetch(`${BASE_API_URL}/upload`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setStep(4);
        processData();
        setUploading(false);
      })
      .catch((error) => {
        alart("error", error);
        setUploading(false);
      });
  };

  const handleRemoveFile = (index) => {
    const oldFileData = [...fileData];
    oldFileData.splice(index, 1);
    setFileData(oldFileData);
  };

  const handleDefaultTemplate = () => {
    const el1 = document.getElementById("default-temp");
    el1.click();
  };




  const handleDefaultFileChange = () => {
    setUploadingTemplate(true);

      const el1 = document.getElementById("default-temp-radio");
      el1.checked = true;
      setDefaultTemp("");
      const projectName = localStorage.getItem("project");
      var formdata = new FormData();
      formdata.append("file", "");
      formdata.append("title", projectName);

      var requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      fetch(`${BASE_API_URL}/process-template`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          setTemplateResponse(result);
          localStorage.setItem("templateResponse", JSON.stringify([{ "Address": "---", "Convert the Address to ISO 20022-formatted full invoice addresses in XML format ": "---", "Document": "---" }]));
          // setUploadingTemplate(false);
          handleSave(3)
        })
        .catch((error) => {
          // setUploadingTemplate(false);
          alart(error);
          console.log("error", error);
        });

     
    
  };

  useEffect(()=>{
    handleDefaultFileChange()
   
  },[])
  
  const handleAddNewTemp = () => {
    const el1 = document.getElementById("add-new-template");
    el1.click();
  };

  const handleAddNewTempChange = (event) => {
    const selectedFiles = [...newTemp];
    for (let i = 0; i < event.target.files.length; i++) {
      selectedFiles.push(event.target.files[i]);
    }
    setNewTemp(selectedFiles);
  };

  return (
    <div className="container-fluid">
      <div className="ss-inr-hero position-relative mb-4">
        <div className="page-back-btn">
          <button onClick={() => window.location.replace("/#/model")}>
            <i className="bi bi-chevron-left"></i>
          </button>
        </div>
        <h2>
          <span>Project:</span> {localStorage.getItem("project")}
        </h2>
      </div>

      <div className="row ss-inr-upload p-4">
        {step === 2 && (
          <>
            <Strpper activeStep={1} />

            {templateResponse ? (
              <div style={{ padding: 30 }}>
                <div className="position-relative">
                  <div style={{ display: "flex", padding: 10 }}>
                    <img
                      src={xlsImgage}
                      alt=""
                      style={{
                        width: 30,
                        height: 30,
                        marginRight: 10,
                      }}
                    />
                    <h4>Preview Template</h4>
                  </div>

                  <Table data={templateResponse} />
                </div>
                <div
                  className="d-flex justify-content-end upld-btnpage"
                  style={{ marginTop: 20 }}
                >
                  <button
                    className="cmn-btn"
                    onClick={() => setTemplateResponse(null)}
                  >
                    Re-upload
                  </button>
                  <button className="cmn-btn" onClick={() => handleSave(3)}>
                    Save & Next
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="col-3 pe-5"></div>
                <div className="col-6 pe-5" style={{ padding: 30 }}>
                  {!uploadingTemplate ? (
                    <div className="position-relative">
                      <h4>Upload a Template</h4>
                      <br />
                      <div className="temp-upld-hldr d-flex flex-column upload-container">
                        <div
                          className="d-flex align-items-center gap-3 p-3 mb-4"
                          htmlFor="default-tem"
                          onClick={handleDefaultTemplate}
                        >
                          <div>
                            <input
                              type="radio"
                              name="default-tem"
                              id="default-temp-radio"
                              style={{ pointerEvents: "none" }}
                            />
                          </div>
                          <div>
                            <img src={xlsImgage} alt="" style={{ height: 75 }} />
                          </div>
                          <div className="w-100 text-center">
                            Choose a new Template
                          </div>
                          <input
                            id="default-temp"
                            type="file"
                            accept=".csv"
                            onChange={handleDefaultFileChange}
                          />
                        </div>

                        <div
                          className="d-flex align-items-center gap-3 p-3 mb-2"
                          htmlFor="default-tem"
                          // onClick={handleAddNewTemp}
                          style={{
                            cursor: "none",
                          }}
                        >
                          <div>
                            <img src={xlsImgage} alt="" />
                          </div>
                          <div>
                            <img src={csvImgage} alt="" />
                          </div>
                          <div className="w-100 text-center">
                            Default Template
                          </div>
                          <input
                            id="add-new-template"
                            type="file"
                            multiple="multiple"
                          // onChange={handleAddNewTempChange}
                          />
                        </div>
                        <p className="text-center">
                          Supported file : .XLS, .CSV
                        </p>
                      </div>
                    </div>
                  ) : (
                      <div className="loader-container">
                        <div className="loader"></div>
                        <br />
                        <p style={{ marginLeft: 20 }}>Processing template...</p>
                      </div>
                  )}
                </div>
                <div className="col-3 pe-5"></div>
              </>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <Strpper activeStep={2} />

            <div className="col-3 pe-5"></div>
            <div className="col-6 d-flex pe-5" style={{ padding: 30 }}>
              <div className="position-relative w-100" style={{minHeight:"16rem"}}>
                <br/>
                {fileData.length > 0 ? (
                  <div style={{ display: "_none" }} className="ss-filelisthldr">
                    <h3>Uploaded Files</h3>
                    <div className="d-flex flex-column w-100 gap-3 ss-upld-list">
                      {fileData.map((selectedFiles, index) => {
                        return (
                          <div
                            className="d-flex justify-content-space-between w-100"
                            style={{ justifyContent: "space-between" }}
                            key={index}
                          >
                            <div  className="d-flex justify-content-space-between w-100">
                            <p>
                              <img src={csvImgage} alt="" />{" "}
                              <b style={{fontSize:9}}>{selectedFiles.name}</b>
                            </p>
                            {/* <p style={{fontSize:6}}>
                              {selectedFiles.size < 1000000
                                ? Math.floor(selectedFiles.size / 1000) + " KB"
                                : Math.floor(selectedFiles.size / 1000000) +
                                " MB"}
                            </p> */}
                            </div>
                            <div className="d-flex justify-content-space-between ">
                            
                            <i
                              className="bi bi-x"
                              onClick={() => handleRemoveFile(index)}
                            ></i>
                            </div>
                            {/* </button> */}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ):<div
                className="upld-boxhldr w-100 mb-4 upload-container"
                onClick={handleFileUpload}
              >
                <div className="img-hldr">
                  <img src={uploadImage} alt="" />
                </div>
                <p>
                  <strong>Click to upload single or multiple file(s)</strong>
                </p>
                <p>Supported file : .pdf, .jpg, .png</p>
                <input
                  id="upload-file"
                  type="file"
                  multiple="multiple"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </div>}
                

                {!fileData.length && (
                  <div>
                    <div className="d-flex align-items-center ss-hrblk mb-4">
                      <hr />
                      <div>
                        <strong>Or</strong>
                      </div>
                      <hr />
                    </div>
                    <div className="text-center mb-4">
                      <p>
                        <strong>Connect to drive</strong>
                      </p>
                    </div>

                    <div className="d-flex justify-content-center gap-5 ss-dvhldr">
                      <img src={googleDriveImage} alt="" />
                      <img src={dropBoxImgage} alt="" />
                    </div>
                  </div>
                )}

                
              </div>
            </div>
            <div className="col-3 pe-5"></div>
            <div className="col-12 pe-5">
              <div
                className="d-flex justify-content-end upld-btnpage"
                style={{ marginTop: 20 }}
              >
                <button className="cmn-btn" onClick={() => handleSave(2)}>
                  Back
                </button>
                {!uploading ? (
                  <button className="cmn-btn" onClick={() => uploadFilesData()}>
                    Upload & Next
                  </button>
                ) : (
                  <button className="cmn-btn">
                    <CircularProgress color="inherit" />
                  </button>
                )}
              </div>
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <div>
              <Strpper activeStep={3} />

              {processedData?.map((item, index) => (
                <img
                  key={index}
                  src={item}
                  alt={`Processed Data ${index}`}
                  height={200}
                  width={200}
                />
              ))}
              {/* <Progress /> */}
              {error ? (
                <div
                  className="d-flex justify-content-end upld-btnpage"
                  style={{ marginTop: 20 }}
                >
                  <button className="cmn-btn" onClick={() => step(2)}>
                    Back
                  </button>
                  <button className="cmn-btn" onClick={() => generateOutput(2)}>
                    {generateOutputcall ? (
                      <CircularProgress color="inherit" />
                    ) : (
                      "Re-generate"
                    )}
                  </button>
                </div>
              ) : (
                <div className="loader-container">
                  <div className="loader"></div>
                  <br />
                  <p style={{ marginLeft: 20 }}>Generating response...</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <br />
    </div>
  );
};

export default UploadDocument;
