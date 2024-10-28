import React, { useState, useEffect } from 'react';
import './CustomInputSection.css'

const CustomInputSection = ({onSubmit}) => {
    const [text, setText] = useState("");

    const handleChange = (event) => {
        setText(event.target.value);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            onSubmit(text);
        }
    };

    return (
        <div className='custom-input'>
            Enter a custom input:
            <textarea
                value={text}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                maxLength={500}
                placeholder="Enter some keywords or describe your ideal movie or book and press Enter..."
                className='text-area'
            />
            <div className='show-recommendations-button' onClick={() => onSubmit(text)}>
                Show Recommendations
            </div>
        </div>
    )
}

export default CustomInputSection