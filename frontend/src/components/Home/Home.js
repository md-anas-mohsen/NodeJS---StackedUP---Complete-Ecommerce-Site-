import { Grid, Typography } from '@material-ui/core';
import React, {useState, useEffect, useContext} from 'react';
import ProductCard from '../Product/ProductCard/ProductCard';
import "./styles/Home.css";
import MetaData from '../Layout/MetaData/MetaData';
import { createTheme, ThemeProvider } from '@material-ui/core';

import {useDispatch, useSelector} from 'react-redux';
import {getProducts} from '../../actions/productActions';
import ProductSkeleton from '../Product/ProductSkeleton/ProductSkeleton';
import { Fragment } from 'react';
import { AppContext } from '../../context/AppContext';
import { Pagination, Rating } from '@material-ui/lab';
import useQuery from '../../hooks/useQuery';
import RangeSlider from '../Misc/RangeSlider/RangeSlider';
import { useHistory } from 'react-router-dom';

export const titleTheme = createTheme({
    typography: {
      fontFamily: [
        "Abril Fatface", 
        "cursive"
      ].join(",")
    }
  });

const Home = () => {
    const {loading, products, error, productCount, resPerPage} = useSelector(state => state.products);
    const dispatch = useDispatch();
    const {alertState, priceState, keywordState, categoryState, ratingState, searchQueryState} = useContext(AppContext);
    const [, setAlert] = alertState;
    const [searchQuery] = searchQueryState;
    const [keyword, setKeyword] = keywordState;
    const [category, setCategory] = categoryState;
    const [price, setPrice] = priceState;
    const [rating, setRating] = ratingState;
    const history = useHistory();

    const query = useQuery();
    // const keyword = query.get("keyword") || "";
    // const category = query.get("category") || "";
    // const minPrice = query.get("price[gte]") || 1;
    // const maxPrice = query.get("price[lte]") || 100000;
    const[page, setPage] = useState(1);
    useEffect(() => {
        if(category) {
            setPage(1);
        }
    }, [category]);
    useEffect(() => {
        console.log("RUN");
        setKeyword(query.get("keyword") || "");
        setCategory(query.get("category") || "");
        setPrice([query.get("price[gte]") || 1, query.get("price[lte]") || 100000]);
        setRating(query.get("rating[gte]") || 0);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if(keyword) history.push(`/search/?${searchQuery}`);
        if(searchQuery === "") setPrice([1, 1000]);
    }, [keyword, price, history, searchQuery, setPrice]);

    useEffect(() => {
        if(error) {
            return setAlert({message: error, type: "error"});
        }
        dispatch(getProducts(keyword, page, price, category, rating));
    }, [dispatch, error, keyword, page, price, setAlert, category, rating]);

    useEffect(() => {
        setPage(1);
    }, [keyword, setPage]);

    return (
        <div className="home">
            <MetaData title={!keyword ? "Home" : keyword} />
            <ThemeProvider theme={titleTheme}>
                <Typography variant="h3" align="center">
                    {!category && !keyword ? "Latest Products" : category}
                </Typography>
            </ThemeProvider>
            {category || keyword ? 
                <div className="home__filters">
                    <RangeSlider
                        state={[price, setPrice]}
                        title={"Price"}
                        unit={"$"}
                        marks={[{
                                value: 1,
                                label: '$1',
                                },
                                {
                                    value: 1000,
                                    label: '$1000',
                                }]}
                        min={1}
                        max={1000}
                    />
                    <div>
                        <Typography className="home__filters__ratings" gutterBottom>
                            Rating
                        </Typography>
                        <Rating value={rating} precision={0.5} onChange={(e) => setRating(e.target.value)} />
                    </div>
                </div>
            :null}
            {keyword ? 
                <Typography variant="subtitle1" align="center">
                    {`Results for "${keyword}"`}
                </Typography>
            :null}
            <Grid container align="center" className="home__products">
                {loading ? [0, 1, 2, 3, 4, 5, 6, 7].map(i => {
                    return (
                        <Grid key={i} item xs={12} md={3}>
                            <ProductSkeleton key={i} />
                        </Grid>
                    )
                }): (
                    <Fragment>
                        {products && products.map(product => {
                            return (
                                <Grid key={product._id} item xs={12} sm={6} md={4} lg={3}>
                                    <ProductCard
                                        key={product._id}
                                        name={product.name} 
                                        image={product.images[0]}
                                        price={product.price}
                                        ratings={product.ratings}
                                        numOfReviews={product.numOfReviews}
                                        productID={product._id}
                                    />
                                </Grid>
                            )
                        })}
                    </Fragment>
                )}
            </Grid>
            {products ? (
                <div className="home__pagination">
                    <Pagination 
                        size="large" 
                        count={Math.ceil(productCount/resPerPage)}  
                        shape="rounded"
                        page={page}
                        defaultPage={1}
                        onChange={(e, pageNum) => setPage(pageNum)}
                        showFirstButton
                        showLastButton
                    />
                </div>
            ): null}
        </div>
    )
}

export default Home
