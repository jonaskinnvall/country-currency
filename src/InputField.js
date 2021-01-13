import React from "react";
import "./styles.css";

const InputField = ({ inputType, setInput }) => {
  let waitInput = null;

  // Handle change in input fields with a timeout
  // to wait for user to finish typing before setting value
  const handleChange = (e) => {
    let inputText = e.target.value;
    if (waitInput) clearTimeout(waitInput);
    waitInput = setTimeout(() => {
      setInput(inputText);
    }, 500);
  };

  return (
    <>
      <input
        className="Input"
        type="text"
        placeholder={inputType === "Search" ? "Search countries.." : "SEK"}
        onChange={(e) => {
          handleChange(e);
        }}
      ></input>
    </>
  );
};

export default InputField;
