import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setDisplayProductsByCategory, setSortBy, filterOptions } from '../redux/reducers/products'

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
    <div className="overflow-x-visible">
      <div className="card m-2 sm:sticky align-flex-start top-25 overflow-y-auto sm:max-h-3/4">
        <ul>
          Sort By
          <li>
            <button type="button" onClick={() => dispatch(setSortBy(filterOptions.sortBy.nameUp))}>
              Name Up
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => dispatch(setSortBy(filterOptions.sortBy.nameDown))}
            >
              Name Down
            </button>
          </li>
          <li>
            <button type="button" onClick={() => dispatch(setSortBy(filterOptions.sortBy.priceUp))}>
              Price Up
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => dispatch(setSortBy(filterOptions.sortBy.priceDown))}
            >
              Price Down
            </button>
          </li>
          <li>
            <button type="button" onClick={() => dispatch(setSortBy(filterOptions.sortBy.initial))}>
              Clear
            </button>
          </li>
        </ul>
        <div className="header-text w-32 text-left">Category</div>
        <ul className={` w-auto bg-white`}>
          <li className="pl-2 pr-2">
            <button
              type="button"
              onClick={() => {
                dispatch(setDisplayProductsByCategory(filterOptions.category.all))
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
    </div>
  )
}

FilterView.propTypes = {}

export default FilterView
