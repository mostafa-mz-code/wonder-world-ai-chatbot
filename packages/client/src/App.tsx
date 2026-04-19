import React, { useEffect, useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";

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
  return (
    <div className="p-5">
      <p className="font-bold p-4 text-xl">server says: {message}</p>
      <Button variant="default">Hello World!</Button>
    </div>
  );
};

export default App;
