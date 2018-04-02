class ProductList extends React.Component {
  constructor(props) {     
    super(props);     
      this.state = {       
        products: [],       
        newproduct: {}     
      };      
      this.handleInputChange = this.handleInputChange.bind(this);   
      this.refreshList = this.refreshList.bind(this);   
      this.handleClick = this.handleClick.bind(this);   
  }

  handleClick(event){
    const header = {
      'Content-Type' : 'application/json'
    }
    const body = {product: this.state.newproduct}
    body.product['num_votes'] = 0
    console.log(JSON.stringify(body))
    fetch(`http://localhost:3000/products`, {method: 'POST', header: header, body: JSON.stringify(body)})
        .then((response) => this.refreshList())
  }

  handleInputChange(event) {
    const value = event.target.value
    const name = event.target.name
    this.state.newproduct[name]=value
  }

  refreshList(){
    fetch(`http://localhost:3000/products`)
        .then((response) => response.json())
        .then((json) => this.setState({products: json}))
  }

  componentDidMount() {
    this.refreshList();
  }

  handleProductUpVote = (productId) => {
    this.state.products.forEach((product, index) => {
      if(product.id === productId){
        fetch(`http://localhost:3000/products/${productId}/upvote`, {method: 'POST'})
        .then((response) => this.refreshList())
      }
    });
  }

  render() {
    const products = this.state.products.sort((a, b) => (
      b.votes - a.votes
      ));
      const productComponents = products.map((product) => (
        <Product
          key={'product-' + product.id}
          id={product.id}
          title={product.title}
          description={product.description}
          url={product.image}
          votes={product.num_votes}
          submitterAvatarUrl={product.submitterAvatarUrl}
          productImageUrl={product.productImageUrl}
          onVote={this.handleProductUpVote}
        />
    ));
    return (
      <div className='ui unstackable items'>
      {productComponents}
      title
      <input name="title" value={this.state.newproduct.title} onChange={this.handleInputChange}/>
      description
      <input name="description" value={this.state.newproduct.description} onChange={this.handleInputChange}/>
      image
      <input name="image" value={this.state.newproduct.image} onChange={this.handleInputChange}/>
      <button onClick={this.handleClick}>Submit</button>
      </div>
      );
  }
}
class Product extends React.Component {
  handleUpVote = () => (
    this.props.onVote(this.props.id)
  );
  handleUpVote() {
    this.props.onVote(this.props.id);
  }
  render() {
    return (
      <div className='item'>
        <div className='image'>
          <img src={this.props.productImageUrl} />
        </div>
        <div className='middle aligned content'>
          <div className='header'>
            <a onClick={this.handleUpVote}>
              <i className='large caret up icon' />
            </a>
            {this.props.votes}
          </div>
          <div className='description'>
            <a href={this.props.url}>
              {this.props.title}
            </a>
            <p>
              {this.props.description}
            </p>
          </div>
          <div className='extra'>
            <span>Submitted by:</span>
              <img
                className='ui avatar image'
                src={this.props.submitterAvatarUrl}
            />
          </div>
        </div>
      </div>
      );
  }
}

ReactDOM.render(
  <ProductList />,
  document.getElementById('content')
);

