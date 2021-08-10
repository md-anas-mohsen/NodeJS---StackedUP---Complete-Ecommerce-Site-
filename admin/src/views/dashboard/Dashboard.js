import React, { lazy, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from 'src/actions/productActions.js'
import { allOrders } from 'src/actions/orderActions.js'
import Metadata from 'src/reusable/Metadata.js'
import { getUsers } from 'src/actions/userActions.js'

const WidgetsDropdown = lazy(() => import('../components/widgets/WidgetsDropdown.js'))

const Dashboard = () => {
  const dispatch = useDispatch()
  const { products, loading } = useSelector((state) => state.products)
  const { orders, totalAmount } = useSelector((state) => state.orders)
  const { users } = useSelector((state) => state.users)
  const [outOfStock, setOutOfStock] = useState(0)
  const [ordersPending, setOrdersPending] = useState(0)

  useEffect(() => {
    dispatch(getProducts())
    dispatch(allOrders())
    dispatch(getUsers())
  }, [dispatch])

  useEffect(() => {
    if (products && orders) {
      setOutOfStock(0)
      setOrdersPending(0)
      products.forEach((product) => {
        if (product.stock === 0) setOutOfStock((prev) => prev + 1)
      })
      orders.forEach((order) => {
        if (order.orderStatus === 'Processing') setOrdersPending((prev) => prev + 1)
      })
    }
  }, [products, orders])

  return (
    <>
      {!loading && products && orders && totalAmount && users && (
        <>
          <Metadata title="Dashboard" />
          <WidgetsDropdown
            productCount={products.length}
            outOfStock={outOfStock}
            ordersPending={ordersPending}
            totalAmount={totalAmount}
            totalUsers={users.length}
          />
        </>
      )}
    </>
  )
}

export default Dashboard
