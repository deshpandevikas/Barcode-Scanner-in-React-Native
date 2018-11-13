import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  state = {
    products: [],
    product: {
      Name: '',
      code: ''
    }
  }

  componentDidMount() {
    this.getProducts();
  }

  getProducts = _ => {
    fetch('https://barcodescannerserver.herokuapp.com/products')
    .then(response => response.json())
    .then(response => this.setState({ products: response.data}))
    .catch(err => console.error(err));
  }

  addProduct = _ => {
    const { product } = this.state;
    fetch(`https://barcodescannerserver.herokuapp.com/products/add?Name=${product.Name}&code=${product.code}`)
    .then(this.getProducts)
    .catch(err => console.error(err))
  }

  renderProduct = ({product_id, Name, code }) => <div key={product_id}>{Name}  |  {code}  </div>
  render() {
    const { products, product } = this.state;
    return (
      <div className="App">
          <h1> Add UPC Codes to the Database </h1>
          <img src={require('./1.jpg')} />
          <div>
            <label>
              Product Name: &nbsp;&nbsp;&nbsp;&nbsp;
              <input type="text" value={product.Name} onChange={e => this.setState({product: { ...product, Name: e.target.value}})}/>
            </label>
          </div>
          <div>
            <label>
              UPC Code&nbsp; : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <input type="text" value={product.code} onChange={e => this.setState({product: { ...product, code: e.target.value}})}/>
            </label>
          </div>
          <div>
            <button onClick={this.addProduct}> Add Product </button>
          </div>
          <p> These are the products and upc codes available in the database </p>
          {products.map(this.renderProduct)}
      </div>
    );
  }
}

export default App;
