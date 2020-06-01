import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { history } from '../redux'

const CreateView = () => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [currency, setCurrency] = useState('')
  const [price, setPrice] = useState()
  const firstUpdate = useRef(true)
  const [err, setErr] = useState(false)
  const baseUrl = window.location.origin
  function handleSubmit(e) {
    e.preventDefault()
    async function createUser() {
      try {
        const obj = {
          title,
          category,
          currency,
          price
        }
        const file = document.getElementById('input-files').files
        let id
        if (file.length) {
          const formData = new FormData()
          formData.append('file', file[0])
          id = await axios({
            method: 'post',
            url: `${baseUrl}/api/v1/images/upload`,
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
          })
            // .then(({ data }) => {
            //   console.log(data.id)
            //   // setImageId(data.id)
            //   document
            //     .getElementById('img')
            //     .setAttribute('src', `${baseUrl}/api/v1/images/${data.id}`)
            //   return data.id
            // })
            .catch((response) => {
              console.log(response)
            })
        }

        if (id) obj.imageId = id
        await axios.post(`${baseUrl}/api/v1/products/create`, obj)
        setErr(false)
        history.push('/')
      } catch (er) {
        setErr(true)
      }
    }
    createUser()
  }

  function onUpload(e) {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = (ev) => {
      document.getElementById('img').setAttribute('src', ev.target.result)
    }

    const file = document.getElementById('input-files').files
    reader.readAsDataURL(file[0])
    // const formData = new FormData()

    // formData.append('file', file[0])
    // axios({
    //   method: 'post',
    //   url: `${baseUrl}/api/v1/images/upload`,
    //   data: formData,
    //   headers: { 'Content-Type': 'multipart/form-data' }
    // })
    //   .then(({ data }) => {
    //     console.log(data.id)
    //     setImageId(data.id)
    //     document.getElementById('img').setAttribute('src', `${baseUrl}/api/v1/images/${data.id}`)
    //   })
    //   .catch((response) => {
    //     console.log(response)
    //   })
  }

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }
    if (!err) history.push('/')
  }, [err])

  return (
    <div className="card">
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

        <label htmlFor="currency">Currency</label>
        <input
          className="input-view"
          name="currency"
          placeholder="UAH"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
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
