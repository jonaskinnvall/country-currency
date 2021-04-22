import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import './styles.css';

const InputField = forwardRef(({ inputType, inputValue, setInput }, ref) => {
    let waitInput = null;
    let inputText;

    // Handle change in input fields with a timeout
    // to wait for user to finish typing before setting value
    const handleChange = (e) => {
        inputText = e.target.value;
        if (waitInput) clearTimeout(waitInput);
        if (inputType === 'Search') {
            return (waitInput = setTimeout(() => {
                setInput(inputText);
            }, 1000));
        }
        setInput(inputText);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputType === 'Search') {
            clearTimeout(waitInput);
            setInput(inputText);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    ref={ref}
                    className="input-field"
                    type="text"
                    placeholder={
                        inputType === 'Search'
                            ? 'Search countries..'
                            : inputValue
                            ? inputValue + ' SEK'
                            : ' SEK'
                    }
                    onChange={handleChange}
                ></input>
            </form>
        </>
    );
});

export default InputField;

InputField.displayName = 'InputField';

InputField.propTypes = {
    inputType: PropTypes.string,
    inputValue: PropTypes.string,
    setInput: PropTypes.func,
    country: PropTypes.object,
};
