import {
  Avatar,
  Dialog,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import React from "react";
import { renderToString } from "react-dom/server";
import download from "../images/download_icon.svg";
import excel_icon from "../images/excel.svg";
import pdf_icon from "../images/pdf.svg";
import logo from "../logo.png";
import download_graph_icon from "../images/photo.svg";
import jspdf from "jspdf";
import numeral from "numeral";
const Download = ({ id, countryName, casesType, country, data }) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const downloadClick = () => {
    setOpenDialog(true);
  };
  const onClose = () => {
    setOpenDialog(false);
  };
  const getFileName = () => {
    if (id.includes("global")) return "worldwide " + casesType;
    else
      return (
        (country === "worldwide" ? "global " : countryName) + " " + casesType
      );
  };
  const formatData = () => {
    let formattedData = [];
    for (const key in data) {
      var temp = {};
      temp.date = key;
      temp[casesType] = data[key];
      formattedData.push(temp);
    }
    return formattedData;
  };
  const exportIntoExcel = () => {
    var data = formatData();
    const replacer = (key, value) => (value === null ? "" : value); // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(",")
    );
    csv.unshift(header.join(","));
    csv = csv.join("\r\n");

    //Download the file as CSV
    var downloadLink = document.createElement("a");
    var blob = new Blob(["\ufeff", csv]);
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = `${id}.csv`; //Name the file here
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  const downloadAsImageClick = () => {
    var link = document.createElement("a");
    link.download = getFileName();
    link.href = document.getElementById(id).toDataURL();
    link.click();
  };
  const downloadAsPDF = () => {
    var link = document.createElement("a");
    link.download = getFileName();
    link.href = document.getElementById(id).toDataURL();
    print(link.href, formatData());
  };
  const handleListItemClick = (index) => {
    onClose();
    switch (index) {
      case 0:
        downloadAsImageClick();
        break;
      case 1:
        return exportIntoExcel();
      case 2:
        return downloadAsPDF();
      default:
        break;
    }
  };

  const colstyle = {
    width: "50%",
  };
  const tableStyle = {
    width: "140%",
  };
  const getDate = (d) => {
    var monthNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    console.log(d);
    var date = new Date("" + d);
    date.setDate(date.getDate() - 1);
    date =
      date.getDate() +
      " " +
      monthNames[date.getMonth()] +
      " " +
      date.getFullYear();
    return date;
  };
  const Prints = ({ image, rows, columns }) => (
    <div>
      <div style={{ width: "400px", display: "flex" }}>
        <img
          style={{ marginLeft: "20em", width: 20, height: 20 }}
          src={logo}
          alt={"covid tracker logo"}
        />
        <h4 style={{ marginLeft: "32em" }}>Covid Trackers</h4>
      </div>
      <h3 style={{ marginLeft: "28em" }}>{id}</h3>
      <div style={{ marginLeft: "35em" }}>
        <img style={{ height: 100, width: 180 }} src={image} alt={id} />
      </div>
      <table id="tab_customers" class="table table-striped" style={tableStyle}>
        <colgroup>
          <col span="1" style={colstyle} />
          <col span="1" style={colstyle} />
        </colgroup>
        <thead>
          <tr class="warning">
            {columns.map((item) => (
              <th key={item}>
                {item.substring(0, 1).toUpperCase() + item.substring(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((item, index) => (
            <tr key={index}>
              {item.map((field, number) => (
                <td key={field}>
                  {number ? numeral(field).format("0,0") : getDate(field)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const print = (img, data) => {
    const columns = Object.keys(data[0]);
    var rows = data.map((field) => [field.date, field[casesType]]);

    const string = renderToString(
      <Prints rows={rows} columns={columns} image={img} />
    );
    var pdf = new jspdf("p", "mm", "a4");
    let margins = {
      bottom: 10,
      top: 10,
      left: 10,
      right: 10,
    };

    // const pdf = new jspdf("p", "mm", "a4");
    // console.log(string);
    // pdf.fromHTML(string);
    // pdf.save("pdf");

    pdf.fromHTML(
      string,
      10,
      10,
      {
        pagesplit: true,
      },
      function (dispose) {
        var pageCount = pdf.internal.getNumberOfPages();
        for (let i = 0; i < pageCount; i++) {
          pdf.setPage(i);
          pdf.text(
            95,
            285,
            pdf.internal.getCurrentPageInfo().pageNumber +
              "/" +
              pageCount +
              "\n"
          );
        }
        pdf.save(id);
      },
      margins
    );
  };

  const downloadTypes = [
    { title: "As image", img: download_graph_icon },
    { title: "As sheet", img: excel_icon },
    { title: "As PDF", img: pdf_icon },
  ];
  return (
    <React.Fragment>
      <IconButton onClick={downloadClick}>
        <img style={{ width: 18 }} src={download} alt="download" />
      </IconButton>
      <Dialog
        onClose={onClose}
        aria-labelledby="simple-dialog-title"
        open={openDialog}
      >
        <DialogTitle id="simple-dialog-title">Download Graph</DialogTitle>
        <List>
          {downloadTypes.map((fileType, index) => (
            <ListItem
              button
              onClick={() => handleListItemClick(index)}
              key={fileType.title}
            >
              <ListItemAvatar>
                <Avatar
                  style={{ color: "#1e88e5", backgroundColor: " #bbdefb" }}
                  className={"avatar"}
                >
                  <img
                    className="avatar-icon"
                    src={fileType.img}
                    alt={fileType.title}
                  />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={fileType.title} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </React.Fragment>
  );
};

export default Download;
