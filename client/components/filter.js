import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import {
  setDisplayProductsByCategory,
  getProducts,
  clearProducts
} from '../redux/reducers/products'

const FilterView = () => {
  const [categories, setCategories] = useState([])
  const dispatch = useDispatch()
  //   const filters = useSelector((s) => s.product.filter)
  useEffect(() => {
    const baseUrl = window.location.origin
    axios
      .get(`${baseUrl}/api/v1/products/category`)
      .then(({ data }) => setCategories(data))
      .catch((err) => console.log(err))
  }, [])

  function onClick(e) {
    dispatch(setDisplayProductsByCategory(e.target.innerHTML))
  }

  return (
    <div className="card hidden sm:block m-2">
      <div className="header-text w-32 text-left">Category</div>
      <ul className={` w-auto bg-white`}>
        <li className="pl-2 pr-2">
          <button
            type="button"
            onClick={() => {
              dispatch(clearProducts())
              dispatch(getProducts())
            }}
            className="hover:underline focus:outline-none"
          >
            All
          </button>
        </li>
        {categories.map((category) => {
          return (
            <li key={category} className="pl-2 pr-2">
              <button
                type="button"
                onClick={onClick}
                className="hover:underline focus:outline-none"
              >
                {category}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

FilterView.propTypes = {}

export default FilterView
