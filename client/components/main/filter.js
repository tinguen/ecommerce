import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { createPopper } from '@popperjs/core'
import { useTranslation } from 'react-i18next'
import { setProductsByCategory, setSortBy, filterOptions } from '../../redux/reducers/products'

const FilterView = () => {
  const { t, i18n } = useTranslation()
  const [translation, setTranslation] = useState(t('home', { returnObjects: true }))
  const [categories, setCategories] = useState([])
  const [dropdownShow, setDropdownShow] = useState(false)
  const [dropdownMsg, setDropdownMsg] = useState(translation.manual)
  const btnDropdownRef = useRef()
  const popoverDropdownRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    setTranslation(t('home', { returnObjects: true }))
    dispatch(setSortBy(filterOptions.sortBy.initial))
    setDropdownMsg(translation.manual)
    setDropdownShow(false)
  }, [t, i18n.language, dispatch, translation.manual])

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
      <div className="card m-2 sm:sticky align-flex-start top-25 overflow-y-auto max-h-3/4">
        {translation.sort}
        <button
          className="text-black outline-none focus:outline-none ml-2 mr-1 mb-1 bg-white transition-all duration-150 ease"
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
          } bg-white text-sm z-50 float-left py-2 list-none text-left rounded mt-1 p-1 border-solid border-2`}
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
              {translation.nameUp}
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
              {translation.nameDown}
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
              {translation.priceUp}
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
              {translation.priceDown}
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                dispatch(setSortBy(filterOptions.sortBy.initial))
                setDropdownMsg(translation.manual)
                setDropdownShow(false)
              }}
              className="focus:outline-none"
            >
              {translation.clear}
            </button>
          </li>
        </ul>
        <div className="header-text w-32 text-left">{translation.category}</div>
        <ul className={` w-auto bg-white`}>
          <li className="pl-2 pr-2">
            <button
              type="button"
              onClick={() => {
                dispatch(setProductsByCategory(filterOptions.category.all))
              }}
              className="hover:underline focus:outline-none"
            >
              {translation.all}
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
