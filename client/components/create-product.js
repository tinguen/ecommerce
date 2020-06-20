import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { history } from '../redux'
import { fetchProducts, setDisplayProductsByCategory } from '../redux/reducers/products'

const CreateView = () => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState()
  const [description, setDescription] = useState('')
  const firstUpdate = useRef(true)
  const [err, setErr] = useState(false)
  const dispatch = useDispatch()
  // const userId = useSelector((s) => s.user.user.id)
  const token = useSelector((s) => s.user.user.token)
  const storeCategory = useSelector((s) => s.product.filters.category)
  const baseUrl = window.location.origin
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

  function onUpload(e) {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = (ev) => {
      document.getElementById('img').setAttribute('src', ev.target.result)
    }

    const file = document.getElementById('input-files').files
    reader.readAsDataURL(file[0])
  }

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }
    if (!err) history.push('/')
  }, [err])

  return (
    <div className="card card-margin">
      <form onSubmit={handleSubmit}>
        <h1>Create a new product</h1>

        <label htmlFor="title">Title</label>
        <input
          className="input-view"
          name="title"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />

        <label htmlFor="category">Category</label>
        <input
          className="input-view"
          type="text"
          name="category"
          placeholder="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <br />

        <label htmlFor="price">Price</label>
        <input
          className="input-view"
          name="price"
          placeholder="price"
          value={price || ''}
          onChange={(e) => setPrice(e.target.value)}
        />
        <br />

        <label htmlFor="description" className="align-top">
          Description
        </label>
        <textarea
          className="input-view"
          name="description"
          cols="40"
          rows="5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />

        <div className="form-group">
          <input type="file" name="file" id="input-files" className="form-control-file border" />
        </div>
        <button type="submit" className="btn btn-primary" onClick={onUpload}>
          Upload
        </button>
        <img
          alt=""
          id="img"
          style={{
            display: 'block'
          }}
        />
        <button type="submit" id="search-button" className="button">
          Add product
        </button>
      </form>
      <div className="text-red-800">{err ? 'Product title is taken' : ''}</div>
    </div>
  )
}

CreateView.propTypes = {}

export default CreateView
