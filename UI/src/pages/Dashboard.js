import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { AppBar, Toolbar, Button, Grid, Box, Avatar, Typography, Card, CardContent, TextField, Table, TableHead, TableBody, TableCell, TableRow } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { TableContainer, Paper } from "@mui/material";
import {BASE_API_URL } from "../config"

const columns = [
  { field: "id", headerName: "S(No.)", width: 70 },
  { field: "fileName", headerName: "File(s) Name", width: 130 },
  { field: "templateName", headerName: "Template Name", width: 160 },
  { field: "uploadDate", headerName: "Date and Time", width: 160 },
  { field: "status", headerName: "Status", width: 160 },
];

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/get-all-scenario`);
      const jsonData = await response.json();
      const formattedData = formatData(jsonData);
      setData(formattedData); // Update state with formatted data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const formatData = (jsonData) => {
    let formattedData = [];
    Object.keys(jsonData).forEach((key, index) => {
      const folder = jsonData[key];
      const templateFolder = folder.subfolders.find(subfolder => subfolder.template);
      const templateFiles = templateFolder ? templateFolder.template.files : [];
      templateFiles.forEach((file, fileIndex) => {
        formattedData.push({
          id: index + fileIndex + 1,
          fileName: file,
          templateName: key,
          uploadDate: new Date().toLocaleString(), // Placeholder for current date and time
          status: "Completed", // Placeholder for status
        });
      });
    });
    return formattedData;
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileMenuToggle = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleProfileMenuClose = () => {
    setIsProfileMenuOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    // Implement your search functionality here
  };

  function handleClick() {
    navigate("/login");
  }

  const downloadCSV = (templateName) => {
    navigate(`/generate/${templateName}`); // Navigate to '/generate' route with the template name
  };

  return (
    <>
      <div className="container-fluid">
        <div className="ss-inr-hero position-relative mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="page-back-btn">
            <button onClick={() => window.location.replace("/results")}>
              <i className="bi bi-chevron-left"></i>
            </button>
          </div>
          <h2>Dashboard</h2>
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <Card className="data-grid">
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.field}
                      style={{ fontWeight: "bold" }}
                    >
                      {column.headerName}
                    </TableCell>
                  ))}
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id}>
                    {columns.map((column) => (
                      <TableCell key={column.field}>
                        {column.field === "status" ? (
                          <span
                            style={{
                              color:
                                row.status === "Completed" ? "green" : "red",
                            }}
                          >
                            {row.status}
                          </span>
                        ) : (
                          row[column.field]
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button variant="text" onClick={() => downloadCSV(row.templateName)}>
                        <ArrowDownwardIcon style={{ color: "#900C3F" }} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
