import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { BASE_API_URL } from "../../config";
import Strpper from "../../components/Staper";
import xlsImage from "../../assets/images/img-xls.png";
import SyncWithDB from "./SyncWithDB"
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';

const downloadXML = (xmlData) => {
  // Create a Blob from the XML data
  const blob = new Blob([xmlData], { type: 'application/xml' });

  // Create a link element
  const link = document.createElement('a');

  // Set the download URL to the Blob object
  link.href = URL.createObjectURL(blob);

  // Set the download attribute with a filename
  link.download = 'data.xml';

  // Append the link to the document body (it must be in the DOM to work)
  document.body.appendChild(link);

  // Programmatically click the link to trigger the download
  link.click();

  // Remove the link from the document
  document.body.removeChild(link);
};

const DataTable = () => {
  const [data, setData] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const projectName = localStorage.getItem("project");
    var formdata = new FormData();
    formdata.append("title", projectName);

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch(`${BASE_API_URL}/get-progress`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setData(result);
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  }, []);

  function convertToCSV() {
    // Convert JSON to CSV
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) => headers.map((field) => row[field]).join(",")),
    ].join("\n");

    // Create a Blob object
    const blob = new Blob([csvContent], { type: "text/csv" });

    // Create download link
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "data.csv";
    link.click();
  }

  const downloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.keys(data[0]).join(",") +
      "\n" +
      data.map((row) => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "table_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  function exportToCSV(fileName = "my_data") {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      formatCSVRow(Object.keys(data[0])) +
      data.map((row) => formatCSVRow(Object.values(row))).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName + ".csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
  }

  function formatCSVRow(row) {
    return row.map((value) => `"${value}"`).join(",");
  }

  if (!data) return null;



  function isValidAddressFormat(value) {
    const regex = /<PstlAdr[\s\S]*<\/PstlAdr>/;
    return regex.test(value);
  }

  return (
    <div className="container-fluid">
      <div className="ss-inr-hero position-relative mb-4">
        <div className="page-back-btn">
          <button onClick={() => window.history.back()}>
            <i className="bi bi-chevron-left"></i>
          </button>
        </div>
        <h2>
          <span>Project:</span> {localStorage.getItem("project")}
        </h2>
      </div>
      <br />
      <Strpper activeStep={5} />

      <div style={{ display: "flex", padding: 10, marginTop: 30 }}>
        <img
          src={xlsImage}
          alt=""
          style={{
            width: 30,
            height: 30,
            marginRight: 10,
          }}
        />
        <h4> Output</h4>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ background: "#900c3f" }}>
              {Object.keys(data[0]).map((key, index) => (
                <TableCell
                  key={index}
                  style={{ border: "1px solid gray", color: "white" }}
                >
                  {key}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {Object.values(row).map((value, valueIndex) => (
                  <TableCell
                    key={valueIndex}
                    style={{ border: "1px solid gray" }}
                  >

                    {isValidAddressFormat(value) ? (
                      <pre >

                        <code> {value} </code>
                        <SimCardDownloadIcon style={{cursor:"pointer", fontSize:20,  float:"right"}} onClick={() => downloadXML(value)} />
                      </pre>) : value}

                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div
        className="d-flex justify-content-end upld-btnpage"
        style={{ marginTop: 20 }}
      >
        <SyncWithDB data={data} />

        <div className="hm-ulogin-btn">
          <button className="cmn-btn" onClick={() => exportToCSV()} >
            Download CSV
          </button>
        </div>


        {/* <Button className="cmn-btn" onClick={goToDashboard}>
          Go to Dashboard
        </Button> */}

      </div>
      <br />
      <br />
    </div>
  );
};

export default DataTable;
