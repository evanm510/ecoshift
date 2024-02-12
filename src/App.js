import React, { useState, useEffect } from "react";
import InputForm from "./components/InputForm";

function App() {
  const [message, setMessage] = useState("");

  return (
    <div className="background">
      <div className="app">
        <header className="App-header">
          <div className="app-title">EcoShift: EV vs. Gas Calculator</div>
        </header>
        <main>
          <div className="info-text">
            Electricity for Electric Vehicles (EVs) typically costs
            significantly less than gasoline for traditional vehicles, offering
            substantial savings on a per-mile basis. This cost advantage is due
            to the higher efficiency of electric motors and the generally more
            stable and lower prices of electricity compared to the often
            volatile gasoline market. This app will allow you to directly
            compare the energy costs associated with EVs vs. gas powered
            vehicles to help you be an informed buyer when considering an EV as
            your next vehicle.
          </div>
          <InputForm />
        </main>
      </div>
    </div>
  );
}

export default App;
