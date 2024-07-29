import * as React from "react";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import RemoveRedEyeSharpIcon from "@mui/icons-material/RemoveRedEyeSharp";
import { Modal, Typography, Box, Stack } from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import _ from "lodash/get";
import { BASE_API_URL } from "../../config";
import Strpper from "../../components/Staper";
import ItemTable from "./ItemTable";
import { useNavigate } from "react-router-dom";

function isObject(variable) {
  return typeof variable === "object" && variable !== null;
}

function convertToTitleCase(str) {
  // Split the string into words
  let words = str.split("_");

  // Capitalize the first letter of each word
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  // Join the words back together with spaces
  return words.join(" ");
}

const DataTable = ({ data }) => {
  const [openDetails, setOpenDetails] = useState(null);
  const openDetail = Boolean(openDetails);
  let itemIndex = 0;
  const [detailViewData, setDetailViewData] = useState([]);
  const [detailViewHeaderData, setDetailViewHeaderData] = useState({});
  const [seletedItemData, setSeletedItemData] = useState({});
  const navigate = useNavigate();
  console.log("Invoicedata", data);
  Object.keys(data[0]).map((header, index) => {
    if (header == "items") {
      itemIndex = index;
    }
  });
  const handleDetailView = (row) => {
    setDetailViewHeaderData({});
    setDetailViewData([]);
    setOpenDetails(true);
    let result = data.filter((obj) => obj.invoice_id == row.invoice_id);
    setDetailViewHeaderData(result[0].items[0]);
    setDetailViewData(result[0].items);
  };
  const handleDetailsBack = () => {
    setOpenDetails(null);
  };

  function downloadCSV() {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));
    for (const row of data) {
      const values = headers.map((header, index) => {
        // to set empty the array of object value items key
        const val =
          index == itemIndex
            ? ""
            : !isObject(row[header])
              ? row[header]
              : `${row[header]["amount"]} ${row[header]["code"]}`;
        return `"${val}"`;
      });
      csvRows.push(values.join(","));
    }
    let convertedHeader = Object.keys(data[0]).map((header) =>
      convertToTitleCase(header)
    );
    csvRows[0] = convertedHeader;
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "table_data.csv");
    document.body.appendChild(link);
    link.click();
  }
  return (
    <div>
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

      <TableContainer
        component={Paper}
        style={{ padding: 20, marginBottom: 50, marginTop: 20 }}
      >
        <Table aria-label="simple table">
          <TableHead style={{ background: "#989898" }}>
            <TableRow>
              {data &&
                Object.keys(data[0]).map((header, index) => (
                  <TableCell
                    key={index}
                    style={{ border: "1px solid gray", color: "white" }}
                  >
                    {convertToTitleCase(header)}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row, index) => (
              <TableRow key={index}>
                {Object.values(row).map((cell, cellIndex) =>
                  cellIndex == itemIndex ? (
                    <TableCell
                      key={cellIndex}
                      style={{ border: "1px solid gray" }}
                    >
                      <RemoveRedEyeSharpIcon
                        style={{ fontSize: "17px" }}
                        onClick={() => {
                          handleDetailView(row);
                          setSeletedItemData(cell);
                        }}
                      />

                      {/* {JSON.stringify(cell)} */}
                    </TableCell>
                  ) : (
                    <TableCell
                      key={cellIndex}
                      style={{ border: "1px solid gray" }}
                    >
                      {isObject(cell)
                        ? `${cell["amount"]} ${cell["code"]}`
                        : cell}
                    </TableCell>
                  )
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Modal
          open={openDetail}
          anchorEl={openDetails}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              p: 3,
              background: "white",
              width: "60%",
              height: "80%",
              overflow: "scroll",
              outline: "none",
            }}
          >
            <Stack
              direction="row"
              style={{ padding: "1.5em" }}
              justifyContent="space-between"
            >
              <Typography
                style={{
                  fontSize: "14px",
                  color: "#000000",
                  fontWeight: "bold",
                }}
              >
                Items
              </Typography>
              <CancelOutlinedIcon
                style={{ fontSize: "25px", color: "black" }}
                onClick={handleDetailsBack}
              />
            </Stack>

            <ItemTable data={seletedItemData} />
          </Box>
        </Modal>

        <div className="col-12">
          <div
            className="d-flex justify-content-end upld-btnpage"
            style={{ marginTop: 20 }}
          >
            <button
              className="cmn-btn"
              onClick={() => navigate("/scenario-name")}
            >
              Start again
            </button>
            <button className="cmn-btn" onClick={() => downloadCSV()}>
              Download CSV
            </button>
          </div>
        </div>
      </TableContainer>
    </div>
  );
};

const InvoiceTable = () => {
  const [data, setData] = React.useState(null);

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

  return <>{data && <DataTable data={data} />}</>;
};

export default InvoiceTable;
