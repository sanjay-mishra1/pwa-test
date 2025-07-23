import React from "react";
import "../css/Table.css";
import numeral from "numeral";
import { Card } from "@material-ui/core";
import Searchbar from "../components/Searchbar";
import FullGraph from "./graph/FullGraph";
function Table({ countries, casesType, setCountryChange }) {
  const [filterText, setFilterText] = React.useState("");
  const [filteredCountries, setFilteredCountries] = React.useState([
    ...countries,
  ]);

  const handleClick = (countryCode) => {
    setCountryChange(countryCode);
  };
  React.useEffect(() => {
    setFilteredCountries([...countries]);
  }, [countries]);
  React.useEffect(() => {
    const setCountries = () => {
      if (filterText === "") {
        setFilteredCountries(countries.map((item) => item));
        return;
      }

      setFilteredCountries(
        countries.filter((item) =>
          item.country.toUpperCase().startsWith(filterText.toUpperCase())
        )
      );
    };
    setCountries();
  }, [filterText]);
  return (
    <React.Fragment>
      <div style={{ display: "flex" }}>
        <h3 style={{ flex: 1, color: "#6a5d5d", fontWeight: 400 }}>
          Live {casesType} by country
        </h3>
        <FullGraph
          data={filteredCountries}
          cardTitle="World covid data"
          type="custom-table"
          country={"Worldwide"}
          customCss={{ marginTop: -10 }}
        />
      </div>
      <Card variant="outlined">
        <Searchbar setFilterText={setFilterText} filterText={filterText} />
        <div className="table">
          {filteredCountries.map((country) => (
            <tr
              onClick={() => handleClick(country.countryInfo.iso2)}
              className="table-row"
              key={country.country}
            >
              <td>
                <div style={{ display: "flex" }}>
                  <img
                    src={country.countryInfo.flag}
                    className="table-img"
                    alt={country.country}
                  />
                  <p>{country.country}</p>
                </div>
              </td>
              <td>
                <strong>{numeral(country[casesType]).format("0,0")}</strong>
              </td>
            </tr>
          ))}
        </div>
      </Card>
    </React.Fragment>
  );
}

export default Table;
