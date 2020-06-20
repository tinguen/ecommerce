import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import ReactPaginate from 'react-paginate'
import Product from './product-view'
import FilterView from './filter'
import { setPage } from '../../redux/reducers/products'

const ProductView = () => {
  const products = useSelector((s) => s.product.displayProducts)
  const userId = useSelector((s) => s.user.user.id)
  const token = useSelector((s) => s.user.user.token)
  const cart = useSelector((s) => s.user.user.cart)
  const size = useSelector((s) => s.product.filters.currentSize)
  const page = useSelector((s) => s.product.filters.page)
  const limit = useSelector((s) => s.product.filters.limit)
  const dispatch = useDispatch()

  useEffect(() => {
    async function updateCart() {
      if (!userId) return
      const baseUrl = window.location.origin
      await axios.put(
        `${baseUrl}/api/v1/users/${userId}`,
        { cart },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
    }
    updateCart()
  }, [cart, token, userId])

  return (
    <div className="block sm:flex">
      <FilterView />
      <div className="flex flex-auto flex-col">
        <ReactPaginate
          previousLabel={
            <img
              alt="Previous img"
              src="images/previous-arrow.png"
              className="w-4 h-4 object-cover"
            />
          }
          nextLabel={
            <img alt="Next img" src="images/next-arrow.png" className="w-4 h-4 object-cover" />
          }
          pageCount={Math.ceil(size / limit)}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          containerClassName="flex justify-center items-center m-4"
          pageClassName="ml-2 mr-2"
          pageLinkClassName="focus:outline-none"
          activeLinkClassName="bg-gray-400 rounded-lg p-1"
          previousLinkClassName="focus:outline-none"
          nextLinkClassName="focus:outline-none"
          forcePage={page - 1}
          onPageChange={(v) => dispatch(setPage(v.selected + 1))}
        />
        <div className="m-2 grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-g-center flex-auto">
          {products.map((product) => {
            return (
              <Product
                key={product.id}
                product={product}
                className="sm:transform sm:hover:scale-105 m-2 sm:m-0 transition duration-150 ease"
              />
            )
          })}
        </div>
        <ReactPaginate
          previousLabel={
            <img
              alt="Previous img"
              src="images/previous-arrow.png"
              className="w-4 h-4 object-cover"
            />
          }
          nextLabel={
            <img alt="Next img" src="images/next-arrow.png" className="w-4 h-4 object-cover" />
          }
          pageCount={Math.ceil(size / limit)}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          containerClassName="flex justify-center items-center m-4"
          pageClassName="ml-2 mr-2"
          pageLinkClassName="focus:outline-none"
          activeLinkClassName="bg-gray-400 rounded-lg p-1"
          previousLinkClassName="focus:outline-none"
          nextLinkClassName="focus:outline-none"
          forcePage={page - 1}
          onPageChange={(v) => dispatch(setPage(v.selected + 1))}
        />
      </div>
    </div>
  )
}

ProductView.propTypes = {}

export default ProductView
