import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Tab,
  Tabs,
  TextField,
} from "@material-ui/core";
import React from "react";
import edit from "../../images/edit.svg";
import remove from "../../images/remove.svg";
import add from "../../images/add.svg";
import { getNumOfDays, isNumber } from "../../helper/util";

function DaysSelector({ days, handleMonthClick }) {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [currentActivatedButton, setCurrentActivatedButton] = React.useState(0);
  const [localDays, setlocalDays] = React.useState(days);
  const handleChange = (event, newValue) => {
    if (newValue === 0) {
      setTabIndex(newValue);
      setlocalDays(localDays < 12 ? localDays * 30 : localDays);
    } else if (newValue === 1) {
      setTabIndex(newValue);
      setlocalDays(localDays > 31 ? Math.round(localDays / 30) : localDays);
    } else {
      newValue = event.target.value;
      if (
        newValue.trim() === "" ||
        (isNumber(newValue) && parseInt(newValue) > 0)
      )
        if (
          (tabIndex === 0 && parseInt(newValue) < 1000) ||
          (tabIndex === 1 && parseInt(newValue) <= 36)
        )
          setlocalDays(newValue.trim());
    }
  };
  const handleIncreaseClick = () => {
    try {
      if (localDays >= 36) {
        var oldText = parseInt(document.getElementById("custom-input").value);
        if (oldText <= 36) setlocalDays(oldText + 1);
        else setlocalDays(1);
      } else setlocalDays(localDays + 1);
    } catch (eer) {
      setlocalDays(1);
    }
  };
  const handleDecreaseClick = () => {
    try {
      if (localDays < 1) {
        let oldText = parseInt(document.getElementById("custom-input").value);
        if (oldText > 1) setlocalDays(oldText - 1);
        else setlocalDays(12);
      } else {
        let oldText = parseInt(document.getElementById("custom-input").value);
        if (oldText > 36) setlocalDays(Math.round(oldText / 30) - 1);
        else setlocalDays(oldText - 1);
      }
    } catch (err) {
      setlocalDays(12);
    }
  };
  const handleDaySubmit = () => {
    let localD = localDays;
    if (tabIndex !== 0) {
      localD = getNumOfDays(localDays);
    }
    setlocalDays(localD);
    handleMonthClick(localD);
    setOpenDialog(false);
    setCurrentActivatedButton(2);
  };
  const handleMonthSubmit = (month) => {
    handleMonthClick("" + getNumOfDays(month + 1));
    setCurrentActivatedButton(month === 4 ? 0 : 1);
  };
  return (
    <div
      style={{ margin: 10, display: "flex", justifyContent: "space-between" }}
    >
      <Button
        onClick={() => handleMonthSubmit(4)}
        style={{ textTransform: "none", borderRadius: 25 }}
        variant={currentActivatedButton === 0 ? "contained" : "outlined"}
        color={currentActivatedButton === 0 ? "primary" : "default"}
      >
        4 months
      </Button>
      <Button
        onClick={() => handleMonthSubmit(1)}
        style={{ textTransform: "none", borderRadius: 25 }}
        variant={currentActivatedButton === 1 ? "contained" : "outlined"}
        color={currentActivatedButton === 1 ? "primary" : "default"}
      >
        1 month
      </Button>
      <Button
        onClick={() => setOpenDialog(true)}
        style={{ textTransform: "none", borderRadius: 25 }}
        variant={currentActivatedButton === 2 ? "contained" : "outlined"}
        color={currentActivatedButton === 2 ? "primary" : "default"}
        startIcon={
          currentActivatedButton === 2 ? (
            <img src={edit} alt="custom time" />
          ) : null
        }
      >
        {currentActivatedButton !== 2
          ? "Custom"
          : tabIndex === 0
          ? days + " D"
          : Math.round(days / 30) + " M"}
      </Button>
      <Dialog
        onClose={() => setOpenDialog(false)}
        aria-labelledby="simple-dialog-title"
        open={openDialog}
      >
        <DialogTitle id="simple-dialog-title">Set custom time</DialogTitle>
        <Paper square>
          <Tabs
            value={tabIndex}
            indicatorColor="primary"
            centered
            textColor="primary"
            onChange={handleChange}
            aria-label="disabled tabs example"
          >
            <Tab label="Days" />
            <Tab label="Months" />
          </Tabs>
          <Divider />
          <DialogContent>
            <br />
            {tabIndex === 0 ? (
              <div className="custom-day-input">
                <TextField
                  // className="custom-day-input"
                  style={{
                    textAlign: "center",
                    paddingRight: 20,
                    paddingTop: 4,
                  }}
                  value={localDays}
                  onChange={handleChange}
                >
                  <input type="number" id="custom-input" />
                </TextField>
                <div />
                <div />
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "center" }}>
                {/* <IconButton style={{ width: 50 }} onClick={handleIncreaseClick}> */}
                <img
                  style={{ width: 30 }}
                  src={add}
                  className="icon-button"
                  onClick={handleIncreaseClick}
                  alt="add months"
                />
                {/* </IconButton> */}
                <input
                  value={
                    localDays > 0 && localDays <= 36
                      ? localDays
                      : Math.round(localDays / 30) > 0
                      ? parseInt(Math.round(localDays / 30))
                      : 1
                  }
                  type="number"
                  id="custom-input"
                  disabled
                  style={{
                    width: 93,
                    paddingTop: 4,
                    textAlign: "center",
                    fontSize: "larger",
                  }}
                />
                {/* <IconButton style={{ width: 50 }} onClick={handleDecreaseClick}> */}
                <img
                  style={{ width: 30 }}
                  src={remove}
                  className="icon-button"
                  onClick={handleDecreaseClick}
                  alt="decrease months"
                />
                {/* </IconButton> */}
              </div>
            )}
            <br />
            <br />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleDaySubmit}
            >
              Done
            </Button>
          </DialogContent>
        </Paper>
      </Dialog>
    </div>
  );
}

export default DaysSelector;
