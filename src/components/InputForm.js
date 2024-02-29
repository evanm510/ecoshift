import React, { useState } from "react";

const InputForm = () => {
  const [calculationChoices, setCalculationChoices] = useState({
    evCostPerMile: false,
    equivalentMPG: false,
    annualCost: false,
    breakevenTime: false,
  });

  const [formValues, setFormValues] = useState({
    electricityPrice: "",
    evEfficiency: "",
    gasPrice: "",
    gasEfficiency: "",
    evVehiclePrice: "",
    taxCredit: false,
    gasVehiclePrice: "",
    annualMiles: "",
  });

  const [response, setResponse] = useState({});

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCalculationChoices((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let responses = {};

    if (calculationChoices.evCostPerMile) {
      const endpoint = "http://localhost:3001/calcEvCostPerMile";
      const data = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          electricityPrice: formValues.electricityPrice,
          evEfficiency: formValues.evEfficiency,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setResponse((prevResponses) => ({
            ...prevResponses,
            evCostPerMile: data,
          }));
        })
        .catch((err) => console.error("Error:", err));
    }

    if (calculationChoices.equivalentMPG) {
      const endpoint = "http://localhost:3001/calcEquivalentMpgCost";
      const data = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gasPrice: formValues.gasPrice,
          electricityPrice: formValues.electricityPrice,
          evEfficiency: formValues.evEfficiency,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setResponse((prevResponses) => ({
            ...prevResponses,
            equivalentMPG: data,
          }));
        })
        .catch((err) => console.error("Error:", err));
    }

    if (calculationChoices.annualCost) {
      const endpoint = "http://localhost:3001/calcEvAnnualCost";
      const data = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          annualMiles: formValues.annualMiles,
          electricityPrice: formValues.electricityPrice,
          evEfficiency: formValues.evEfficiency,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setResponse((prevResponses) => ({
            ...prevResponses,
            annualCost: data,
          }));
        })
        .catch((err) => console.error("Error:", err));
    }

    if (calculationChoices.breakevenTime) {
      const endpoint = "http://localhost:3001/calcYearsUntilBreakeven";
      const data = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          evPrice: formValues.evVehiclePrice,
          gasVehiclePrice: formValues.gasVehiclePrice,
          taxCredit: formValues.taxCredit,
          gasPrice: formValues.gasPrice,
          gasEfficiency: formValues.gasEfficiency,
          annualMiles: formValues.annualMiles,
          electricityPrice: formValues.electricityPrice,
          evEfficiency: formValues.evEfficiency,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setResponse((prevResponses) => ({
            ...prevResponses,
            breakevenTime: data,
          }));
        })
        .catch((err) => console.error("Error:", err));
    }
  };

  return (
    <div>
      <div>What would you like to calculate?</div>
      <div className="calculation-choice-container">
        <label>
          Cost Per Mile
          <input
            type="checkbox"
            name="evCostPerMile"
            checked={calculationChoices.evCostPerMile}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Equivalent MPG
          <input
            type="checkbox"
            name="equivalentMPG"
            checked={calculationChoices.equivalentMPG}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Annual Cost
          <input
            type="checkbox"
            name="annualCost"
            checked={calculationChoices.annualCost}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Breakeven Time
          <input
            type="checkbox"
            name="breakevenTime"
            checked={calculationChoices.breakevenTime}
            onChange={handleCheckboxChange}
          />
        </label>
      </div>
      <form className="form-container" onSubmit={handleSubmit}>
        {/* Conditionally render input fields based on selected calculation choices */}
        {calculationChoices.evCostPerMile ||
        calculationChoices.equivalentMPG ||
        calculationChoices.annualCost ? (
          <>
            <div className="user-input">
              <label>
                Price of Electricity ($/kWh):
                <input
                  type="text"
                  name="electricityPrice"
                  value={formValues.electricityPrice}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="user-input">
              <label>
                Efficiency of EV (miles/kWh):
                <input
                  type="text"
                  name="evEfficiency"
                  value={formValues.evEfficiency}
                  onChange={handleChange}
                />
              </label>
            </div>
          </>
        ) : null}

        {calculationChoices.equivalentMPG ||
        calculationChoices.annualCost ||
        calculationChoices.breakevenTime ? (
          <>
            <div className="user-input">
              <label>
                Price of Gas ($/gallon):
                <input
                  type="text"
                  name="gasPrice"
                  value={formValues.gasPrice}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="user-input">
              <label>
                Efficiency of Gas Vehicle (mpg):
                <input
                  type="text"
                  name="gasEfficiency"
                  value={formValues.gasEfficiency}
                  onChange={handleChange}
                />
              </label>
            </div>
          </>
        ) : null}

        {calculationChoices.breakevenTime ? (
          <>
            <div className="user-input">
              <label>
                Purchase Price of EV ($):
                <input
                  type="text"
                  name="evVehiclePrice"
                  value={formValues.evVehiclePrice}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="user-input">
              <label>
                Eligible for $7,500 tax credit?:
                <input
                  type="checkbox"
                  name="taxCredit"
                  checked={formValues.taxCredit}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="user-input">
              <label>
                Purchase Price of Gas Vehicle ($):
                <input
                  type="text"
                  name="gasVehiclePrice"
                  value={formValues.gasVehiclePrice}
                  onChange={handleChange}
                />
              </label>
            </div>
          </>
        ) : null}

        {calculationChoices.breakevenTime || calculationChoices.annualCost ? (
          <div className="user-input">
            <label>
              Annual Mileage:
              <input
                type="text"
                name="annualMiles"
                value={formValues.annualMiles}
                onChange={handleChange}
              />
            </label>
          </div>
        ) : null}

        <button type="submit">Calculate</button>
      </form>
      {Object.keys(response).length > 0 && (
        <div>
          <h2>Results</h2>
          {response.evCostPerMile && (
            <div>Cost Per Mile: ${response.evCostPerMile}</div>
          )}
          {response.equivalentMPG && (
            <div>Equivalent MPG: {response.equivalentMPG}</div>
          )}
          {response.annualCost && (
            <div>EV Annual Cost: ${response.annualCost}</div>
          )}
          {response.gasAnnualCost && (
            <div>Gas Annual Cost: ${response.gasAnnualCost}</div>
          )}
          {response.breakevenTime && (
            <div>Breakeven Time: {response.breakevenTime} years</div>
          )}
        </div>
      )}
    </div>
  );
};

export default InputForm;
