// From https://loading.io/css/

import React from 'react';
import './LoadingSpinner.css'

const LoadingSpinner = () => {
    return (
        <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    )
}

export default LoadingSpinner