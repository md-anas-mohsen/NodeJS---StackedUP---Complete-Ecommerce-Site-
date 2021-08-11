import React from 'react';
import {Skeleton} from '@material-ui/lab';
import { Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    root: {
      maxWidth: 250,
      height: 400,
      padding: "15px 0",
      backgroundColor: "white",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      marginBottom: "50px"
    },
    btn_orange: {
        backgroundColor: "#F77F00",
        color: "white",
        "&:hover": {
            color: "white",
            backgroundColor: "#dc7100",
        }
    }
  });

const ProductSkeleton = () => {
    const classes = useStyles();

    return (
        <Card className={classes.root} elevation={5} style={{border: "1px solid lightgray"}}>
            <center>
                <Skeleton variant="rect" width={210} height={150} />
            </center>
            <CardContent>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
            </CardContent>
            {/* <center>
                <Skeleton variant="rect" width={210} height={40} />
            </center> */}
        </Card>
    )
}

export default ProductSkeleton;
