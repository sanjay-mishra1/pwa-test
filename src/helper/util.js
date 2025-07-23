import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";
import jspdf from "jspdf";

const selectedCountryColor = "#0095ff";

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    rgb: "rgb(204, 16, 52)",
    half_op: "rgba(204, 16, 52, 0.5)",
    multiplier: 300,
  },
  recovered: {
    hex: "#7dd71d",
    rgb: "rgb(125, 215, 29)",
    half_op: "rgba(125, 215, 29, 0.5)",
    multiplier: 400,
  },
  deaths: {
    hex: "#fb4443",
    rgb: "rgb(251, 68, 67)",
    half_op: "rgba(251, 68, 67, 0.5)",
    multiplier: 2000,
  },
  vaccines: {
    hex: "#00c275", //border
    half_op: "#00fa96", //back
  },
};
export const getBackgroundColor = (casesType) =>
  casesTypeColors[casesType].half_op;
export const getBorderColor = (casesType) => casesTypeColors[casesType].hex;
export const sortData = (data, casesType = "cases") => {
  let sortedData = [...data];
  sortedData.sort((a, b) => {
    if (a[casesType] > b[casesType]) {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedData;
};

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const showDataOnMap = (data, casesType = "cases", selectedCountry) => {
  return data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      color={
        selectedCountry === country.countryInfo.iso2
          ? selectedCountryColor
          : casesTypeColors[casesType].hex
      }
      key={casesType + "" + country.country}
      fillColor={casesTypeColors[casesType].hex}
      fillOpacity={0.4}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
};
export const getDate = (millis) => {
  var d = new Date(parseInt(millis.toString(), 10));
  var date = d.toString("MM/dd/yy HH:mm:ss");
  return date.substr(0, date.indexOf("GMT"));
};

export const buildChartData = (originalData, casesType, fromVaccine) => {
  let data = {};
  if (casesType === "default") data.default = originalData;
  else data = originalData;
  let chartData = [];
  let lastDataPoint;
  for (let date in data[casesType]) {
    if (lastDataPoint) {
      let pointDiff = Math.abs(data[casesType][date] - lastDataPoint);
      let newDataPoint = {
        x: date,
        y: pointDiff,
      };
      if (pointDiff <= 1000000 || fromVaccine) chartData.push(newDataPoint);
    }

    lastDataPoint = data[casesType][date];
  }
  return chartData;
};
export const downloadMarkup = (id, fileName, type = "p", size = "a2") => {
  let markup = document.getElementById(id);
  const pdf = new jspdf(type, "mm", size);
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
    markup,
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
          pdf.internal.getCurrentPageInfo().pageNumber + "/" + pageCount + "\n"
        );
      }
      pdf.save(id);
    },
    margins
  );
  // pdf.fromHTML(markup);
  // pdf.save(fileName);
  return;
};
export var monthjson = [
  {},
  {
    name: "January",
    days: 31,
  },
  {
    name: "February",
    days: 28,
  },
  {
    name: "March",
    days: 31,
  },
  {
    name: "April",
    days: 30,
  },
  {
    name: "May",
    days: 31,
  },
  {
    name: "June",
    days: 30,
  },
  {
    name: "July",
    days: 31,
  },
  {
    name: "August",
    days: 31,
  },
  {
    name: "September",
    days: 30,
  },
  {
    name: "October",
    days: 31,
  },
  {
    name: "November",
    days: 30,
  },
  {
    name: "December",
    days: 31,
  },
];
export const getNumOfDays = (no_of_month) => {
  //get current day
  var currentdate = new Date();
  let total_days = currentdate.getDate();
  //start from 1 since we already have curr month days
  let current_month_count = 1;
  //since date start from 0(Jan) to 11(Dec)
  let monthIndex = currentdate.getMonth();
  while (true) {
    if (monthIndex === 0) monthIndex = 12;
    current_month_count++;

    total_days += monthjson[monthIndex].days;

    monthIndex--;

    if (current_month_count === no_of_month) break;
  }
  return total_days;
};
export const isNumber = (number) => {
  return /^\d+$/.test(number);
};
