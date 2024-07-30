import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
// import ReactJson from "react-json-view";
import CircularProgress from "@mui/material/CircularProgress";
import CloudSyncIcon from "@mui/icons-material/CloudSync";

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import PostGress from "../../assets/postgress.png";
import Sap from "../../assets/sap.jpg";
import salesforce from "../../assets/salesforce.png";
import mongodb from "../../assets/mongodb.png";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    height: "90%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 2,
};

export default function BasicModal({ data }) {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [showSyncDetails, setShowSyncDetails] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const apiDetails = {
        Endpoint: "https://check-mate-logs.azurewebsites.net/order",
        Method: "POST",
        "Auth Token":
            "Breaer adffrr888888NNksl@#999hdm754m3mdjc8jemeedkmd99eok09ieeokeoeo",
        "Base URI": "https://abc.azure.wenpage.com",
    };
    console.log("-----data-->", data);

    const submitData = () => {
        setLoading(true);

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Add any other headers if needed (e.g., authentication tokens)
            },
            body: JSON.stringify(data),
        };

        fetch(apiDetails?.Endpoint, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                return response.json();
            })
            .then((data) => {
                setLoading(false);
                console.log("Success:", data);
                // Handle the response data as needed
            })
            .catch((error) => {
                setLoading(false);
                console.error("Error:", error);
                // Handle errors, such as network issues or API errors
            });
    };

    return (
        <div>

            <div className="hm-ulogin-btn">
                <button className="cmn-btn" onClick={handleOpen} >
                    Sync with database
                </button>
            </div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} style={{ overflow: "auto", }}>
                    <br />
                    <div className="container-fluid">
                        <div className="ss-inr-hero position-relative mb-4">
                            <div className="page-back-btn">
                                <button onClick={() => setShowSyncDetails(false)}>
                                    <i className="bi bi-chevron-left"></i>
                                </button>
                            </div>
                            <h2>
                                <span>Project:</span> {localStorage.getItem("project")}
                            </h2>
                        </div>
                        <div style={{ display: "grid", justifyContent: "center" }}>



                            {showSyncDetails ? (
                                <>
                                    <Typography id="modal-modal-title" variant="h5" component="h2">
                                        Api Details
                                    </Typography>

                                    <Typography
                                        id="modal-modal-description"
                                        sx={{ mt: 2 }}
                                        style={{ background: "#80808021", padding: 10 }}
                                    >
                                        <pre>
                                            <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', border: '1px solid #ddd' }}>
                                                <h2>Client API Details</h2>
                                                <ul>
                                                    {Object.entries(apiDetails).map(([key, value]) => (
                                                        <li key={key} style={{ marginBottom: '10px' }}>
                                                            <strong>{key}:</strong> {value}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </pre>
                                    </Typography>
                                    <br />
                                    <Typography id="modal-modal-title" variant="h5" component="h2">
                                        Payload
                                    </Typography>

                                    <Typography
                                        id="modal-modal-description"
                                        sx={{ mt: 2 }}
                                        style={{ background: "#80808021", padding: 10 }}
                                    >
                                        {/* <ReactJson
                  src={data}
                  collapsed={true}
                  displayDataTypes={false}
                /> */}

                                        <p style={{ overflow: "auto" }}>{JSON.stringify(data)}</p>

                                    </Typography>
                                    <br />

                                    {loading ? (
                                        <CircularProgress
                                            sx={{ color: "#D85604" }}
                                            size="40px"
                                            style={{ float: "right" }}
                                        />
                                    ) : (
                                        <>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    marginBottom: "1rem",

                                                    backgroundColor: "#AD1B02",
                                                }}
                                                style={{ float: "right" }}
                                                onClick={() => submitData()}
                                            >
                                                <CloudSyncIcon style={{ marginRight: 10 }} /> Sync with
                                                database
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                sx={{
                                                    marginBottom: "1rem",
                                                    marginRight: "1rem",
                                                }}
                                                style={{ float: "right" }}
                                                onClick={() => setShowSyncDetails(false)}
                                            >
                                                Back
                                            </Button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Box sx={{ flexGrow: 1 }}>

                                        <Typography id="modal-modal-title" variant="h5" component="h2">
                                            Please Select a Datasource
                                        </Typography>
                                        <br />
                                        <Grid container spacing={2}>
                                            <Grid item xs={3}>
                                                <Paper
                                                    style={{ height: 100, width: 100, marginLeft: 40, cursor: "pointer" }}
                                                    onClick={() => setShowSyncDetails(true)}
                                                >
                                                    <img
                                                        src={PostGress}
                                                        style={{ height: 100, width: 100, borderRadius: 25, }}
                                                    />
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Paper style={{ height: 100, width: 100, marginLeft: 40, }}>
                                                    <img
                                                        src={Sap}
                                                        style={{ height: 100, width: 100, borderRadius: 25, opacity: "35%" }}
                                                    />
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Paper style={{ height: 100, width: 100, marginLeft: 40, }}>
                                                    <img
                                                        src={salesforce}
                                                        style={{ height: 100, width: 100, borderRadius: 25, opacity: "35%" }}
                                                    />
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Paper style={{ height: 100, width: 100, marginLeft: 40, }} onClick={() => setShowSyncDetails(true)}>
                                                    <img
                                                        src={mongodb}
                                                        style={{ height: 100, width: 100, borderRadius: 25 }}
                                                    />
                                                </Paper>
                                            </Grid>
                                        </Grid>

                                    </Box>
                                    <br />
                                </>
                            )}
                        </div>
                        <br />
                        <br />
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
