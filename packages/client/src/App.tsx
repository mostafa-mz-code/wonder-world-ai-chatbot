import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setMessage(data.message);
      });
  }, []);
  return <p className="font-bold p-4 text-xl">server says: {message}</p>;
};

export default App;
