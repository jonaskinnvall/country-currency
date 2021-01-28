import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import './styles.css';

const InputField = ({ inputType, inputValue, setInput, country }) => {
    let waitInput = null;
    const countryInfo = useRef(country);
    const inputText = useRef();

    // Clear currency InputField on re-render
    if (
        document.getElementsByClassName('Input')[1] &&
        countryInfo.current !== country
    ) {
        document.getElementsByClassName('Input')[1].value = null;
        countryInfo.current = country;
    }

    // Handle change in input fields with a timeout
    // to wait for user to finish typing before setting value
    const handleChange = (e) => {
        inputText.current = e.target.value;

        if (waitInput) clearTimeout(waitInput);

        waitInput = setTimeout(() => {
            setInput(inputText.current);
        }, 2000);
    };

    const handleSubmit = (e) => {
        if (e.charCode === 13) {
            clearTimeout(waitInput);

            setInput(inputText.current);
        }
    };

    return (
        <>
            <input
                className="Input"
                type="text"
                placeholder={
                    inputType === 'Search'
                        ? 'Search countries..'
                        : inputValue
                        ? inputValue + ' SEK'
                        : ' SEK'
                }
                onChange={handleChange}
                onKeyPress={handleSubmit}
            ></input>
        </>
    );
};

export default InputField;

InputField.propTypes = {
    inputType: PropTypes.string,
    inputValue: PropTypes.string,
    setInput: PropTypes.func,
    country: PropTypes.object,
};
