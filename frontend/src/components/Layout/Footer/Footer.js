import { Typography } from '@material-ui/core';
import React from 'react';
import './styles/Footer.css';

const Footer = () => {
    return (
        <div className="footer">
            <Typography variant="subtitle1">
                StackedUP {new Date().getFullYear()}.
            </Typography>
        </div>
    )
}

export default Footer
