import React from "react";
import Strpper from "../../components/Staper";
import { BASE_API_URL } from "../../config";

const Process = () => {
  const [processed, setProcessed] = React.useState(false);
  const [generating, setGenerating] = React.useState(false);

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
        generateOutput();
        setProcessed(true);
      })
      .catch((error) => console.log("error", error));
  };

  let isGeneratingOutput = false;

  const generateOutput = () => {
    if (isGeneratingOutput) {
      console.log("generateOutput is already running");
      return;
    }

    isGeneratingOutput = true;

    setGenerating(true);
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
      .catch((error) => console.log("error", error));
  };

  React.useEffect(() => {
    processData();
  }, []);

  return (
    <div>
      <Strpper activeStep={2} />
      <div class="loader-container">
        <div class="loader"></div>
      </div>
    </div>
  );
};

export default Process;
