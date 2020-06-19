import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { createPopper } from '@popperjs/core'
import { setProductsByCategory, setSortBy, filterOptions } from '../../redux/reducers/products'

const FilterView = () => {
  const [categories, setCategories] = useState([])
  const [dropdownShow, setDropdownShow] = useState(false)
  const [dropdownMsg, setDropdownMsg] = useState('Manual')
  const btnDropdownRef = useRef()
  const popoverDropdownRef = useRef()
  const dispatch = useDispatch()
  //   const filters = useSelector((s) => s.product.filter)
  useEffect(() => {
    const baseUrl = window.location.origin
    axios
      .get(`${baseUrl}/api/v1/products/category`)
      .then(({ data }) => setCategories(data))
      .catch(() => {})
  }, [])

  function openDropdown() {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: 'bottom-start'
    })
    setDropdownShow(true)
  }

  function closeDropdown() {
    setDropdownShow(false)
  }

  function onClick(e) {
    dispatch(setProductsByCategory(e.target.innerHTML))
  }

  return (
    <div className="overflow-x-visible sm:min-w-1/4">
      <div className="card m-2 sm:sticky align-flex-start top-25 overflow-y-auto sm:max-h-3/4">
        Sort by
        <button
          className="text-black text-sm px-3 py-3 outline-none focus:outline-none mr-1 mb-1 bg-white transition-all duration-150 ease"
          type="button"
          ref={btnDropdownRef}
          onClick={() => {
            // eslint-disable-next-line no-unused-expressions
            dropdownShow ? closeDropdown() : openDropdown()
          }}
        >
          {dropdownMsg}
        </button>
        <ul
          ref={popoverDropdownRef}
          className={`${
            dropdownShow ? 'block ' : 'hidden '
          } bg-white text-sm z-50 float-left py-2 list-none text-left rounded shadow-lg mt-1 p-1`}
        >
          <li>
            <button
              type="button"
              onClick={() => {
                dispatch(setSortBy(filterOptions.sortBy.nameUp))
                setDropdownMsg('Name up')
                setDropdownShow(false)
              }}
              className="focus:outline-none"
            >
              Name Up
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                dispatch(setSortBy(filterOptions.sortBy.nameDown))
                setDropdownMsg('Name down')
                setDropdownShow(false)
              }}
              className="focus:outline-none"
            >
              Name Down
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                dispatch(setSortBy(filterOptions.sortBy.priceUp))
                setDropdownMsg('Price up')
                setDropdownShow(false)
              }}
              className="focus:outline-none"
            >
              Price Up
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                dispatch(setSortBy(filterOptions.sortBy.priceDown))
                setDropdownMsg('Price down')
                setDropdownShow(false)
              }}
              className="focus:outline-none"
            >
              Price Down
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                dispatch(setSortBy(filterOptions.sortBy.initial))
                setDropdownMsg('Manual')
                setDropdownShow(false)
              }}
              className="focus:outline-none"
            >
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
                dispatch(setProductsByCategory(filterOptions.category.all))
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
