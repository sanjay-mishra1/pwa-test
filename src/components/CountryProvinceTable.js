import React from "react";
import "../css/Table.css";
import numeral from "numeral";
import { Divider, IconButton } from "@material-ui/core";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import download from "../images/download_icon.svg";
import Paper from "@material-ui/core/Paper";

import { downloadMarkup, isNumber } from "../helper/util";
function CountryProvinceTable({ countryName, countryShortName, defaultData }) {
  const [filterText, setFilterText] = React.useState("");
  const [filteredData, setFilteredData] = React.useState({});
  const [data, setData] = React.useState([]);
  const [currentcountryName, setCurrentcountryName] = React.useState();
  var defaultKeys = [
    { label: "STATE", color: "#000000", id: "province" },
    { label: "TOTAL CASES", color: "rgb(204, 16, 52)", id: "confirmed" },
    { label: "NEW CASES", color: "rgb(204, 16, 52)", id: "confirmed_diff" },
    { label: "ACTIVE CASES", color: "rgb(204, 16, 52)", id: "active" },
    { label: "TOTAL DEATHS", color: "rgb(251, 68, 67)", id: "deaths" },
    { label: "NEW DEATHS", color: "rgb(251, 68, 67)", id: "deaths_diff" },
    {
      label: "CASE FATALITY RATE",
      color: "#000000",
      id: "Case_Fatality_Rate",
    },
    { label: "TOTAL RECOVERED", color: "rgb(0 201 25)", id: "recovered" },
    {
      label: "RECOVERY PERCENTAGE",
      color: "#000000",
      id: "Recovery_Proporation",
    },
  ];
  var worldwideKeys = [
    { label: "COUNTRY", color: "#000000", id: "country" },
    { label: "NEW CASES", color: "rgb(204, 16, 52)", id: "todayCases" },
    { label: "NEW DEATHS", color: "rgb(251, 68, 67)", id: "todayDeaths" },
    { label: "NEW RECOVERED", color: "rgb(0 201 25)", id: "todayRecovered" },

    { label: "CASES", color: "rgb(204, 16, 52)", id: "cases" },

    { label: "DEATHS", color: "rgb(251, 68, 67)", id: "deaths" },
    { label: "RECOVERED", color: "rgb(0 201 25)", id: "recovered" },

    { label: "ACTIVE", color: "rgb(204, 16, 52)", id: "active" },
    { label: "CRITICAL", color: "#000000", id: "critical" },

    { label: "TESTS", color: "#00c275", id: "tests" },
    {
      label: "ACTIVE/MILLION",
      color: "rgb(204, 16, 52)",
      id: "activePerOneMillion",
    },
    {
      label: "CASES/MILLION",
      color: "rgb(204, 16, 52)",
      id: "casesPerOneMillion",
    },
    { label: "CONTINENT", color: "#000000", id: "continent" },
    {
      label: "CRITICAL/MILLION",
      color: "#000000",
      id: "criticalPerOneMillion",
    },
    {
      label: "DEATHS/MILLION",
      color: "rgb(251, 68, 67)",
      id: "deathsPerOneMillion",
    },
    {
      label: "RECOVERED/MILLION",
      color: "rgb(0 201 25)",
      id: "recoveredPerOneMillion",
    },
    { label: "TESTS/MILLION", color: "#00c275", id: "testsPerOneMillion" },
    {
      label: "ONE DEATH/PEOPLE",
      color: "rgb(251, 68, 67)",
      id: "oneDeathPerPeople",
    },
    { label: "ONE TEST/PEOPLE", color: "#00c275", id: "oneTestPerPeople" },

    { label: "POPULATION", color: "#000000", id: "population" },
  ];
  let keys;
  const worldCustomiseData = (data) => {
    if (!data || data.length <= 1) {
      setFilteredData({});
      return;
    }
    keys = worldwideKeys;
    let stateData = {};
    //setting keys
    stateData.keys = keys;

    stateData.values = [];
    data.forEach((state) => {
      let tempData = setFieldData(state);
      let countryName = (
        <div style={{ display: "flex" }}>
          <img
            src={state.countryInfo.flag}
            className="table-img"
            alt={state.country}
          />
          <p>{state.country}</p>
        </div>
      );
      tempData.country = countryName;
      stateData.values.push(tempData);
    });
    setFilteredData(stateData);
  };
  const customizeData = (data) => {
    if (!data || data.length <= 1) {
      setFilteredData({});
      return;
    }
    keys = defaultKeys;
    let stateData = {};
    //setting keys
    stateData.keys = keys;
    //remove reports

    stateData.values = [];
    data.forEach((state) => stateData.values.push(setFieldData(state)));
    setFilteredData(stateData);
  };
  const setFieldData = (state) => {
    var rowData = {};
    keys.forEach((item) => (rowData[item.id] = state[item.id]));

    return rowData;
  };
  React.useEffect(() => {
    if (currentcountryName !== countryName) {
      setCurrentcountryName(countryName);

      const fetchData = async () => {
        let url;
        if (countryShortName)
          url = `https://vaccovid.live/api/api-covid-data/provinces-report-iso-based/${countryShortName}`;
        else url = `https://disease.sh/v3/covid-19/countries`;
        await fetch(url)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (countryShortName) customizeData(data);
            else worldCustomiseData(data);
          })
          .catch((err) => {
            return <p>No data found</p>;
          });
      };

      fetchData();
    } else {
      setFilteredData(filteredData);
    }
  }, [countryName]);
  React.useEffect(() => {
    const setData = () => {
      if (filterText === "") {
        setFilteredData(data.map((item) => item));
        return;
      }

      setFilteredData(
        data.filter((item) =>
          item.country.toUpperCase().startsWith(filterText.toUpperCase())
        )
      );
    };
    setData();
  }, [filterText]);

  const downloadClick = () => {
    downloadMarkup(
      `${countryShortName ? "state" : "world"}-list`,
      (countryShortName ? countryName : "world") + "-state-covid-19",
      "l",
      [countryShortName ? 627 : 927, 510]
    );
  };
  return (
    <React.Fragment>
      {Object.keys(filteredData).length > 0 && (
        <React.Fragment>
          <EnhancedTable
            headers={filteredData.keys}
            rows={filteredData.values}
            country={countryName}
          />
          {countryShortName && (
            <IconButton onClick={downloadClick}>
              <img style={{ width: 18 }} src={download} alt="download" />
            </IconButton>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, headCells } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding={"default"}>#</TableCell>
        {headCells.map((headCell, index) => (
          <TableCell
            key={headCell.id}
            align={"center"}
            padding={"default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 12,
    marginRight: 29,
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
    margin: 10,
  },
  table: {
    minWidth: 750,
    height: 500,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  container: {
    height: 500,
  },
  container2: {
    height: 660,
  },
}));

function EnhancedTable({ rows, headers, country }) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  return (
    <div id={country ? `state-list` : `world-list`} className={classes.root}>
      <Paper variant="outlined" className={classes.paper}>
        {country && (
          <h3 className="card-title">
            {country} {" States"}
          </h3>
        )}
        <Divider />
        <TableContainer
          className={country ? classes.container : classes.container2}
        >
          <Table
            stickyHeader
            aria-label="sticky table"
            className={classes.table}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              headCells={headers}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy)).map(
                (row, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {/* <TableCell padding="checkbox"></TableCell> */}
                      <TableCell component="th" id={index} align="center">
                        {index + 1}
                      </TableCell>
                      {headers.map((item, index) => (
                        <TableCell
                          key={item.id + index}
                          style={{ color: headers[index].color }}
                          align="center"
                        >
                          {isNumber(row[item.id])
                            ? numeral(row[item.id]).format("0,0")
                            : row[item.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
export default CountryProvinceTable;
