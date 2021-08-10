import { Box, Card, Grid, ThemeProvider, Typography } from '@material-ui/core';
import React from 'react';
import { titleTheme } from '../../Home/Home';
import { Info, MaximumRed, Warning } from '../Colors/Colors';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';

const PageError = ({ error, severity, svgPath }) => {
    const Icon = (severity) => {
        switch(severity) {
            case "warning":
                return <WarningIcon fontSize="large" style={{color: Warning}} />;
            case "error":
                return <ErrorIcon fontSize="large" style={{color: MaximumRed}} />;
            default: 
                return <InfoIcon fontSize="large" style={{color: Info}} />;
        }
    }

    return (
        <Box p={5}>
            <Grid container justifyContent="center">
                <Grid component={Card} elevation={5} xs={12} md={8} item>
                    <Box p={10}>
                        <Box p={2} align="center">{Icon(severity)}</Box>
                        {svgPath &&
                        <Box p={2} align="center">
                            <object aria-label="order confirmed" type="image/svg+xml" data={svgPath} width="300px" />
                        </Box>}
                        <ThemeProvider theme={titleTheme}>
                            <Typography align="center" variant="h4">
                                {error}
                            </Typography>
                        </ThemeProvider>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default PageError;
