import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);
  return (
    <div>
      <p>{message}</p>
    </div>
  );
};

export default App;
