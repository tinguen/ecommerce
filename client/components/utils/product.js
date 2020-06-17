import store from '../../redux/index'

export default function addCurrentPrice(products) {
  const { rates } = store.getState().product
  const { currentCurrency } = store.getState().product
  const rate = rates[currentCurrency]
  if (!Array.isArray(products)) {
    return { ...products, currentPrice: (products.price * rate).toFixed(2) }
  }

  return products.map((product) => ({
    ...product,
    currentPrice: (product.price * rate).toFixed(2)
  }))
}
