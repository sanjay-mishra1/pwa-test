import React from "react";
import { HorizontalBar } from "react-chartjs-2";
import { getBackgroundColor, getBorderColor } from "../../helper/util";

import numeral from "numeral";
import FullGraph from "./FullGraph";
import Download from "../Download";
const monthName = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "Septembar",
  "Octobar",
  "November",
  "December",
];
const getMonthName = (date) => {
  var newDate = date.split("/");
  return monthName[newDate[0] - 1] + " 20" + newDate[2];
};
function HorizontalBarGraph({
  data,
  caseType,
  countryName,
  id,
  type = "default",
}) {
  const prepareData = () => {
    try {
      var totalCasePerMonth = {};
      var previousPoint;
      for (const date in data[caseType]) {
        if (!previousPoint) {
          previousPoint = data[caseType][date];
        } else {
          var monthName = getMonthName(date);
          var diff = data[caseType][date] - previousPoint;
          totalCasePerMonth[monthName] = totalCasePerMonth[monthName]
            ? totalCasePerMonth[monthName] + diff
            : diff;
          previousPoint = data[caseType][date];
        }
      }

      return {
        labels: Object.keys(totalCasePerMonth),
        datasets: [
          {
            label: caseType,
            backgroundColor: getBackgroundColor(caseType),
            borderColor: getBorderColor(caseType),
            borderWidth: 1,
            hoverBackgroundColor: getBackgroundColor(caseType),
            hoverBorderColor: getBorderColor(caseType),
            data: Object.values(totalCasePerMonth),
          },
        ],
      };
    } catch (err) {}
  };
  const prepareDataCustom = () => {
    try {
      var totalCasePerMonth = {};
      var previousPoint;
      for (const date in data[caseType]) {
        if (!previousPoint) {
          previousPoint = data[caseType][date];
        } else {
          var monthName = getMonthName(date);
          var diff = data[caseType][date] - previousPoint;
          totalCasePerMonth[monthName] = totalCasePerMonth[monthName]
            ? totalCasePerMonth[monthName] + diff
            : diff;
          previousPoint = data[caseType][date];
        }
      }
      return totalCasePerMonth;
    } catch (err) {}
  };

  return (
    <React.Fragment>
      {data && Object.keys(data).length > 0 ? (
        <div>
          <HorizontalBar
            options={{
              tooltips: {
                mode: "index",
                intersect: false,
                callbacks: {
                  label: function (tooltipItem, data) {
                    return numeral(tooltipItem.value).format("0,0");
                  },
                },
              },
            }}
            data={prepareData()}
            id={id}
          />

          {type === "default" && (
            <React.Fragment>
              <Download
                casesType={"default"}
                id={id}
                data={prepareDataCustom()}
                countryName={countryName}
              />
              <FullGraph
                data={data}
                type="custom-bar"
                id={`${id}-full`}
                country={countryName}
              />
            </React.Fragment>
          )}
        </div>
      ) : (
        <p className="error-message">No data found</p>
      )}
    </React.Fragment>
  );
}

export default HorizontalBarGraph;
