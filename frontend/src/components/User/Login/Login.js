import React, {useState, useEffect, useContext} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Link as RouteLink }from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import MetaData from '../../Layout/MetaData/MetaData';

import { AppContext } from '../../../context/AppContext';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearErrors } from '../../../actions/userActions';
import useQuery from '../../../hooks/useQuery';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '25px 0'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login({history}) {
    const classes = useStyles();
    const query = useQuery();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {alertState} = useContext(AppContext);
    const [, setAlert] = alertState;
    const dispatch = useDispatch();
    const redirect = query.get("redirect") || "";

    const { isAuthenticated, error, loading } = useSelector(state => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    }
    
    useEffect(() => {
        if(isAuthenticated) {
            history.push(`/${redirect}`);
        }
        if(error) {
            if(error === "Login to view this resource" && !redirect) return;
            setAlert({message: error, type: "error"});
            dispatch(clearErrors());
        }
    }, [dispatch, history, setAlert, isAuthenticated, error, redirect]);

    return (
        <Container component="main" maxWidth="xs">
            <MetaData title={!loading ? "Login" : "Logging In"} />
            {!loading && !isAuthenticated ? (
              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                Sign in
                </Typography>
                <form className={classes.form} noValidate>
                <TextField
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                />
                <TextField
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                />
                {/* <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                /> */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={loading}
                    onClick={handleSubmit}
                >
                    {loading ? <CircularProgress /> : "Sign In"}
                </Button>
                <Grid container>
                    <Grid item xs>
                    <Link variant="body2" component={RouteLink} to="/forgotpassword">
                        Forgot password?
                    </Link>
                    </Grid>
                    <Grid item>
                    <Link variant="body2" component={RouteLink} to="/signup">
                        {"Don't have an account? Sign Up"}
                    </Link>
                    </Grid>
                </Grid>
                </form>
            </div>
            ):(
              <Grid style={{minHeight: "100vh"}} container justifyContent="center" alignItems="center">
                <Grid item>
                  <CircularProgress />
                </Grid>
              </Grid>
            )}
        </Container>
    );
}