import React from "react";
import { useState, useEffect } from "react";
import "./../App.css";

const Results = ({ data }) => {
  return (
    <div>
      {data.cost_per_mile && <div>Cost Per Mile: ${data.cost_per_mile}</div>}
      {data.equivalent_mpg && <div>Equivalent MPG: {data.equivalent_mpg}</div>}
      {data.annual_cost && <div>EV Annual Cost: ${data.annual_cost}</div>}
      {data.gas_annual_cost && (
        <div>Gas Annual Cost: ${data.gas_annual_cost}</div>
      )}
      {data.breakeven_time && (
        <div>Break-even Time: {data.breakeven_time} years</div>
      )}
    </div>
  );
};

export default function () {
  const [calculationChoices, setCalculationChoices] = useState({
    costPerMile: false,
    equivalentMPG: false,
    annualCost: false,
    breakevenTime: false,
  });

  useEffect(() => {
    // Update formValues with the latest calculationChoices
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      calculationChoices: calculationChoices,
    }));
  }, [calculationChoices]); // This effect runs when calculationChoices changes

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCalculationChoices((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const [formValues, setFormValues] = useState({
    calculationChoices: calculationChoices,
    electricityPrice: "",
    evEfficiency: "",
    gasPrice: "",
    gasEfficiency: "",
    evVehiclePrice: "",
    taxCredit: false,
    gasVehiclePrice: "",
    annualMileage: "",
  });

  const [response, setResponse] = useState({});

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Making the POST request
    fetch("/calculate", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues), // body data type must match "Content-Type" header
    })
      .then((response) => response.json()) // Parsing the JSON response
      .then((data) => {
        setResponse(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <div>What would would like to calculate?</div>
      <div className="calculation-choice-container">
        <div>
          Cost Per Mile
          <input
            type="checkbox"
            name="costPerMile"
            checked={calculationChoices.costPerMile}
            onChange={handleCheckboxChange}
          />
        </div>
        <div>
          Equivalent MPG
          <input
            type="checkbox"
            name="equivalentMPG"
            checked={calculationChoices.equivalentMPG}
            onChange={handleCheckboxChange}
          />
        </div>
        <div>
          Annual Cost
          <input
            type="checkbox"
            name="annualCost"
            checked={calculationChoices.annualCost}
            onChange={handleCheckboxChange}
          />
        </div>
        <div>
          Breakeven Time
          <input
            type="checkbox"
            name="breakevenTime"
            checked={calculationChoices.breakevenTime}
            onChange={handleCheckboxChange}
          />
        </div>
      </div>
      <div>
        <form className="form-container">
          {(calculationChoices.costPerMile ||
            calculationChoices.equivalentMPG ||
            calculationChoices.annualCost ||
            calculationChoices.breakevenTime) && (
            <>
              <div>
                <div className="user-input">
                  Price of Electricity ($/kWh):
                  <input
                    type="text"
                    name="electricityPrice"
                    value={formValues.electricityPrice}
                    onChange={handleChange}
                  ></input>
                </div>
              </div>
              <div>
                <div className="user-input">
                  Efficiency of EV (miles/kWh):
                  <input
                    type="text"
                    name="evEfficiency"
                    value={formValues.evEfficiency}
                    onChange={handleChange}
                  ></input>
                </div>
              </div>
            </>
          )}
          {(calculationChoices.equivalentMPG ||
            calculationChoices.breakevenTime) && (
            <>
              <div>
                <div className="user-input">
                  Price of Gas: $
                  <input
                    type="text"
                    name="gasPrice"
                    value={formValues.gasPrice}
                    onChange={handleChange}
                  ></input>
                </div>
              </div>
              <div>
                <div className="user-input">
                  Efficiency of Gas Vehicle (mpg):
                  <input
                    type="text"
                    name="gasEfficiency"
                    value={formValues.gasEfficiency}
                    onChange={handleChange}
                  ></input>
                </div>
              </div>
            </>
          )}
          {(calculationChoices.annualCost ||
            calculationChoices.breakevenTime) && (
            <div>
              <div className="user-input">
                Annual Mileage:
                <input
                  type="text"
                  name="annualMileage"
                  value={formValues.annualMileage}
                  onChange={handleChange}
                ></input>
              </div>
            </div>
          )}
          {calculationChoices.breakevenTime && (
            <>
              <div>
                <div className="user-input">
                  Purchase Price of EV: $
                  <input
                    type="text"
                    name="evVehiclePrice"
                    value={formValues.evVehiclePrice}
                    onChange={handleChange}
                  ></input>
                </div>
              </div>
              <div>
                <div className="user-input">
                  Eligible for $7,500 tax credit?:
                  <input
                    type="checkbox"
                    name="taxCredit"
                    value={formValues.taxCredit}
                    onChange={handleChange}
                  ></input>
                </div>
              </div>
              <div>
                <div className="user-input">
                  Purchase Price of Gas Vehicle: $
                  <input
                    type="text"
                    name="gasVehiclePrice"
                    value={formValues.gasVehiclePrice}
                    onChange={handleChange}
                  ></input>
                </div>
              </div>
            </>
          )}
        </form>
        <div>
          <button onClick={handleSubmit}>
            {Object.keys(response).length > 0 ? "ReCalculate" : "Calculate"}
          </button>
        </div>
      </div>
      {Object.keys(response).length > 0 && <Results data={response} />}
    </div>
  );
}
