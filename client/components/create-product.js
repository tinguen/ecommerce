import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { history } from '../redux'
import { fetchProducts, setDisplayProductsByCategory } from '../redux/reducers/products'

const CreateView = () => {
  const { t, i18n } = useTranslation()
  const [translation, setTranslation] = useState(t('newProduct', { returnObjects: true }))
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState()
  const [description, setDescription] = useState('')
  const [err, setErr] = useState(false)
  const dispatch = useDispatch()
  const token = useSelector((s) => s.user.user.token)
  const storeCategory = useSelector((s) => s.product.filters.category)
  const baseUrl = window.location.origin

  useEffect(() => {
    setTranslation(t('newProduct', { returnObjects: true }))
  }, [t, i18n.language])

  function handleSubmit(e) {
    e.preventDefault()
    async function createProduct() {
      try {
        const obj = {
          title,
          category,
          price
        }
        if (description) obj.description = description
        const file = document.getElementById('input-files').files
        let data
        if (file.length) {
          const formData = new FormData()
          formData.append('file', file[0])
          data = await axios({
            method: 'post',
            url: `${baseUrl}/api/v1/images/upload`,
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
          }).catch(() => {})
        }

        if (data && data.data.id) obj.imageId = data.data.id
        await axios.post(`${baseUrl}/api/v1/products/create`, obj, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        dispatch(fetchProducts())
        setErr(false)
        history.push('/')
        dispatch(fetchProducts()).then(() => dispatch(setDisplayProductsByCategory(storeCategory)))
      } catch (er) {
        setErr(true)
      }
    }
    createProduct()
  }

  return (
    <div className="flex flex-auto justify-center items-center">
      <div className="card card-margin overflow-auto">
        <form onSubmit={handleSubmit} className="flex flex-col flex-auto">
          <h1>{translation.titleMsg}</h1>

          <label htmlFor="title">{translation.title}</label>
          <input
            className="input-view"
            name="title"
            placeholder={translation.title}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label htmlFor="category">{translation.category}</label>
          <input
            className="input-view"
            type="text"
            name="category"
            placeholder={translation.category}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <label htmlFor="price">{translation.price}</label>
          <input
            className="input-view"
            name="price"
            placeholder={translation.price}
            value={price || ''}
            onChange={(e) => setPrice(e.target.value)}
          />

          <label htmlFor="description" className="align-top">
            {translation.description}
          </label>
          <textarea
            className="input-view"
            name="description"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="form-group">
            <input type="file" name="file" id="input-files" className="form-control-file border" />
          </div>
          <button type="submit" id="search-button" className="button">
            {translation.add}
          </button>
        </form>
        <div className="text-red-800">{err ? 'Product title is taken' : ''}</div>
      </div>
    </div>
  )
}

CreateView.propTypes = {}

export default CreateView
