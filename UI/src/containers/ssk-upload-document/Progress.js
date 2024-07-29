import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { BASE_API_URL } from "../../config";

const DataTable = ({ data }) => {
  console.log("++++++===>", data);
  if (data && data?.length == 0) return;
  return (
    <TableContainer
      component={Paper}
      style={{ marginTop: 30, marginBottom: 10 }}
    >
      <Table>
        <TableHead style={{ background: "#989898" }}>
          <TableRow>
            {Object.keys(data[0]).map((key) => (
              <TableCell
                key={key}
                style={{ border: "1px solid gray", color: "white" }}
              >
                {key}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row, index) => (
            <TableRow key={index}>
              {Object.values(row).map((value, index) => (
                <TableCell key={index} style={{ border: "1px solid gray" }}>
                  {value}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Progress = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const projectName = localStorage.getItem("project");
    const fetchData = async () => {
      try {
        const formdata = new FormData();
        formdata.append("title", projectName);

        const requestOptions = {
          method: "POST",
          body: formdata,
          redirect: "follow",
        };

        const response = await fetch(
          `${BASE_API_URL}/get-progress`,
          requestOptions
        );
        const result = await response.json();

        setData(result);
      } catch (error) {
        console.log("error", error);
      }
    };

    const interval = setInterval(fetchData, 5000); // Call the API every 5 seconds

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);
  console.log("");
  return <>{data && <DataTable data={data} />}</>;
};

export default Progress;
