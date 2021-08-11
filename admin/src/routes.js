import React from 'react'

// examples

const AllProducts = React.lazy(() => import('./views/pages/products/AllProducts'))
const AddProduct = React.lazy(() => import('./views/pages/products/AddProduct'))
const UpdateProduct = React.lazy(() => import('./views/pages/products/UpdateProduct'))
const AllOrders = React.lazy(() => import('./views/pages/orders/AllOrders'))
const ProcessOrder = React.lazy(() => import('./views/pages/orders/ProcessOrder'))
const AllUsers = React.lazy(() => import('./views/pages/users/AllUsers'))
const UpdateUser = React.lazy(() => import('./views/pages/users/UpdateUser'))
const ProductReviews = React.lazy(() => import('./views/pages/products/ProductReviews'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const routes = [
  { path: '/', exact: true, name: 'Admin' },
  { path: '/admin/dashboard', name: 'Dashboard', component: Dashboard, exact: true },
  { path: '/admin/products', name: 'Products', exact: true },
  {
    path: '/admin/products/update/:id',
    name: 'Update Product',
    component: UpdateProduct,
    exact: true,
  },
  {
    path: '/admin/products/all-products',
    name: 'All Products',
    component: AllProducts,
    exact: true,
  },
  { path: '/admin/products/add-product', name: 'Add Product', component: AddProduct, exact: true },
  {
    path: '/admin/products/product-reviews',
    name: 'Product Reviews',
    component: AllProducts,
    exact: true,
  },
  {
    path: '/admin/products/product-reviews/:id',
    name: 'Product Reviews',
    component: ProductReviews,
  },
  { path: '/admin/products/:id', name: 'Update Product', component: UpdateProduct },
  { path: '/admin/orders', name: 'All Orders', component: AllOrders, exact: true },
  { path: '/admin/orders/:id', name: 'Process Order', component: ProcessOrder },
  { path: '/admin/users', name: 'All Users', component: AllUsers, exact: true },
  { path: '/admin/users/:id', name: 'Update User', component: UpdateUser },
]

export default routes
