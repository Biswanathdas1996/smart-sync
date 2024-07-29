import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import './CreateTemplate.css'; 

const CreateTemplate = () => {
  const [columnNames, setColumnNames] = useState(['']); // First blank input field by default

  const handleAddColumn = () => {
    setColumnNames([...columnNames, '']);
  };

  const handleColumnNameChange = (index, value) => {
    const updatedColumnNames = [...columnNames];
    updatedColumnNames[index] = value;
    setColumnNames(updatedColumnNames);
  };

  const handleRemoveColumn = (index) => {
    const updatedColumnNames = [...columnNames];
    updatedColumnNames.splice(index, 1);
    setColumnNames(updatedColumnNames);
  };

  useEffect(() => {
    // Ensure there is always at least one input field
    if (columnNames.length === 0) {
      setColumnNames(['']);
    }
  }, [columnNames]);

  const handleSubmit = () => {
    const csvContent = columnNames.join(',') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'columns.csv');
  };

  return (
    <div className="container">
      <h2>Add Your Template</h2>
      {columnNames.map((name, index) => (
        <div className="column-input" key={index}>
          <input
            type="text"
            value={name}
            onChange={(e) => handleColumnNameChange(index, e.target.value)}
            placeholder="Enter input field"
          />
          <button className="remove-button" onClick={() => handleRemoveColumn(index)}>-</button>
          {index === columnNames.length - 1 && (
            <button className="add-button" onClick={handleAddColumn}>+</button>
          )}
        </div>
      ))}
      <br />
      <button className="submit-button" onClick={handleSubmit}>Submit</button>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table aria-label="simple table">
          <TableBody>
            <TableRow>
              {columnNames.map((cell, cellIndex) => (
                <TableCell key={cellIndex} style={{ border: "1px solid gray" }}>
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CreateTemplate;
