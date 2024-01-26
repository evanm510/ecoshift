import React, { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/message");
        const data = await response.json();
        setMessage(data.message);
        console.log("response: " + JSON.stringify(response));
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header"></header>
      <main>
        <div>Message:</div>
        <div>{message}</div>
      </main>
    </div>
  );
}

export default App;
