/* eslint-disable prettier/prettier */
import CIcon from '@coreui/icons-react';
import { CAlert, CButton, CCard, CCardBody, CCardHeader, CSpinner } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getFeatured, clearErrors, deleteFeatured } from 'src/actions/productActions';
import { DELETE_FEATURED_RESET } from 'src/constants/productConstants';
import Metadata from 'src/reusable/Metadata';
import Table from 'src/reusable/Table';

const AllSlides = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    
    const { error, featured, loading } = useSelector(state => state.banner);
    const { error: slideError, isDeleted, loading: slideLoading } = useSelector(state => state.slide);

    const [rows, setRows] = useState(null);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        dispatch(getFeatured());
        if (error) {
          setAlert({ type: "danger", message: error });
          dispatch(clearErrors());
        }
        if (slideError) {
          setAlert({ type: "danger", message: slideError });
          dispatch(clearErrors());
        }
        if (isDeleted) {
          setAlert({ type: "success", message: "Slide deleted from banner successfully" });
          dispatch({ type: DELETE_FEATURED_RESET });
        }
    }, [dispatch, error, slideError, isDeleted]);

    useEffect(() => {
        if (featured) {
            setRows(featured.map(slide => ({
                slideID: slide._id,
                title: slide.title,
                description: slide.description,
                image: <img alt="" src={slide.image.url} style={{ height: "100px" }} />,
                link: slide.link,
                actions: <>
                            <CButton 
                              color="danger" 
                              variant="ghost"
                              size="sm"
                              disabled={slideLoading || loading}
                              onClick={() => dispatch(deleteFeatured(slide._id))}
                            >
                                <CIcon name="cil-trash" />
                            </CButton>
                         </>
            })));
        }
    }, [history, featured, slideLoading, loading, dispatch]);

    const columns = [
          {
            label: 'Image',
            field: 'image',
            sort: 'disabled',
            width: 200
          },
          {
            label: 'Title',
            field: 'title',
            width: 100
          },
          {
            label: 'Description',
            field: 'description',
            width: 150
          },
          {
            label: 'Link',
            field: 'link',
            width: 400
          },
          {
            label: 'Actions',
            field: 'actions',
            sort: 'disabled',
            width: 100
          }
    ]

    return (
        <>
        <Metadata title="All Slides" />
        {alert && <CAlert color={alert.type}>{alert.message}</CAlert>}
        <CCard className="mb-4">
            <CCardHeader>
              All Slides
            </CCardHeader>
            <CCardBody>
              {!loading && !slideLoading && featured ? <Table nohover columns={columns} rows={rows} scrollX /> 
              : <center><CSpinner color="primary" size="xl" /></center>}
            </CCardBody>
        </CCard>
        </>
    )
}

export default AllSlides
