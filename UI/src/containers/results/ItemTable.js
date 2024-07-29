import React from "react";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const MyTable = ({ data }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead style={{ background: "#989898" }}>
          <TableRow>
            <TableCell style={{ border: "1px solid gray", color: "white" }}>
              Amount
            </TableCell>
            <TableCell style={{ border: "1px solid gray", color: "white" }}>
              Item Date
            </TableCell>
            <TableCell style={{ border: "1px solid gray", color: "white" }}>
              Item Description
            </TableCell>
            <TableCell style={{ border: "1px solid gray", color: "white" }}>
              Item Quantity
            </TableCell>
            <TableCell style={{ border: "1px solid gray", color: "white" }}>
              Product Code
            </TableCell>
            <TableCell style={{ border: "1px solid gray", color: "white" }}>
              Tax
            </TableCell>
            <TableCell style={{ border: "1px solid gray", color: "white" }}>
              Unit
            </TableCell>
            <TableCell style={{ border: "1px solid gray", color: "white" }}>
              Unit Price
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell style={{ border: "1px solid gray" }}>
                {row?.amount?.amount} {row.amount?.code}
              </TableCell>
              <TableCell style={{ border: "1px solid gray" }}>
                {row?.item_date}
              </TableCell>
              <TableCell style={{ border: "1px solid gray" }}>
                {row?.item_description}
              </TableCell>
              <TableCell style={{ border: "1px solid gray" }}>
                {row?.item_quantity}
              </TableCell>
              <TableCell style={{ border: "1px solid gray" }}>
                {row?.product_code}
              </TableCell>
              <TableCell style={{ border: "1px solid gray" }}>
                {row?.tax}
              </TableCell>
              <TableCell style={{ border: "1px solid gray" }}>
                {row?.unit}
              </TableCell>
              <TableCell style={{ border: "1px solid gray" }}>
                {row?.unit_price?.amount} {row.unit_price?.code}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MyTable;
