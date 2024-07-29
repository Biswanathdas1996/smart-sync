import React, { useState } from "react";

import {
  Button,
  Grid,
  Paper,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import "../pages/Generate.css";
import {BASE_API_URL } from "../config"


const Generate = () => {
  const [fileDetails, setFileDetails] = useState([]);
  const [filesToAdd, setFilesToAdd] = useState([]);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    setFilesToAdd(Array.from(files));
  };

  const handleAddFiles = () => {
    setFileDetails((prevDetails) => [
      ...prevDetails,
      ...filesToAdd.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
    ]);
    setFilesToAdd([]);
  };

  const handleDeleteFile = (index) => {
    const newFileDetails = [...fileDetails];
    newFileDetails.splice(index, 1);
    setFileDetails(newFileDetails);
  };

  const handleDownloadFile = (index) => {
  };

  const handleGenerate = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/get-all-scenario`);
      const jsonData = await response.json();
  
      const fileDetails = [];
      Object.keys(jsonData).forEach((templateName) => {
        const folder = jsonData[templateName];
        const templateFiles = folder.subfolders.find(subfolder => subfolder.template)?.template?.files || [];
        templateFiles.forEach((file) => {
          fileDetails.push({
            templateName: templateName,
            fileName: file,
          });
        });
      });
  
      console.log("File details:", fileDetails);
    } catch (error) {
      console.error("Error fetching file details:", error);
    }
  };
  


  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={10}>
        
          <Button variant="contained" onClick={handleGenerate} style={{ backgroundColor: "#900C3F", color: "#fff" , marginTop: "15px", marginLeft: "919px"}}>
            Generate
          </Button>
      
      </Grid>

      <Grid item xs={10}>
        <Paper elevation={3} className="paper">
          <Typography variant="h5" className="section-title">File Details</Typography>
          <List>
            {fileDetails.map((file, index) => (
              <ListItem key={index} className="list-item">
                <ListItemText primary={file.name} secondary={`${file.size} bytes`} />
                <ListItemSecondaryAction className="secondary-action">
                  <IconButton onClick={() => handleDeleteFile(index)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDownloadFile(index)}>
                    <CloudDownloadIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      <Grid item xs={10}>
        <Paper elevation={3} className="paper">
          <Typography variant="h5" className="section-title">Add, Delete, Download Options</Typography>
          <IconButton className="add-button" onClick={handleAddFiles}>
            <AddIcon />
          </IconButton>
          <input type="file" multiple onChange={handleFileUpload} style={{ display: "none" }} />
          <IconButton className="delete-button" onClick={() => handleDeleteFile()}>
            <DeleteIcon />
          </IconButton>
        </Paper>
      </Grid>

      <Grid item xs={10}>
        <Paper elevation={3} className="paper">
          <Typography variant="h5" className="section-title">Selected/Uploaded Files</Typography>
          {/* Display selected/uploaded files here */}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Generate;
