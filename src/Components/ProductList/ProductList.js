import React from "react";
import { graphql } from "react-apollo";
// import { Link } from "react-router-dom";
import { getCategories } from "../../GraphQl/Queries";
import "../Navbar/Navbar.js";
import Modal from "./ModalProduct";
import "./ProductList.scss";

class ProductList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categoryName: "All",
      modalVisibility: false,
    };

    this.addToCart = this.addToCart.bind(this);
    this.handleVisibilty = this.handleVisibilty.bind(this);
    this.hideModal = this.hideModal.bind(this)
  }

  handleVisibilty(){
    this.setState({modalVisibility : true})
  }

  hideModal(){
    this.setState({modalVisibility : false})
  }

  addToCart(item) {
    item["quantity"] = 1;

    if (localStorage["cardProduct"] == null) {
      localStorage["cardProduct"] = JSON.stringify([item]);
    } else {
      let products = JSON.parse(localStorage["cardProduct"]) || [];
      const index = products.findIndex((obj) => obj.id === item.id);
      if (index >= 0) {
        products[index].quantity += 1;
      } else {
        products.push(item);
      }
      localStorage["cardProduct"] = JSON.stringify(products);
    }

    let amount = 0;
    JSON.parse(localStorage["cardProduct"]).map((val) => {
      return (amount +=
        val.prices.find(
          (p) => p.currency.symbol === localStorage["currencySymbol"]
        ).amount * val.quantity);
    });
    localStorage["totalCardAmount"] = amount.toFixed(2);
  }

  displayProducts = () => {
    var data = this.props.data;
    const selectedCategory = localStorage["category"];
    var products = [];
    if (data.categories !== undefined && data.categories.length > 0) {
      if (selectedCategory === "Tech") {
        products = data.categories.filter((d) => d.name === "tech");
      } else if (selectedCategory === "Clothes") {
        products = data.categories.filter((d) => d.name === "clothes");
      } else {
        products = data.categories.filter((d) => d.name === "all");
      }
    }

    if (data.loading) {
      return <div>Loading products</div>;
    } else {
      var prod = [];
      if (products.length > 0) {
        prod = products[0].products;
    // console.log(prod.brand);

        return (
          <div>
            <div className="cartegory-list">
              <div className="categorName">{selectedCategory}</div>
            </div>
            <div className="product-section">
              
              {prod.map((item) => {
              // console.log(item.attributes);

                return (
                  <div key={item.id}>
                    {/* <Link
                      className="pro-card"
                      to={`/product/${item.id}`}
                      onClick={() => {
                        localStorage["selectedProductId"] = item.id;
                      }}
                    > */}
                      <div className="card">
                      { !item.inStock && <div className="outOfStockBadge"><h2>OUT OF STOCK</h2></div>}
                        <div className="card-image">
                          <img
                            className="img-card"
                            src={item.gallery[0]}
                            alt="{item.id}"
                          />
                        </div>
                        <div className="card-info">
                          <h4 className="cart-name">{item.name}</h4>
                          <h4 className="cart-price">
                            {" "}
                            {localStorage["currencySymbol"]}{" "}
                            <b>
                              {
                                item.prices.find(
                                  (p) =>
                                    p.currency.symbol ===
                                    localStorage["currencySymbol"]
                                ).amount
                              }
                            </b>
                          </h4>
                        </div>
                        <button type="button"
                          to="#"
                          className="product-cart" 
                          onClick={this.handleVisibilty}
                        >
                          <i className="fa fa-shopping-cart"></i>
                        </button>
                      </div>
                    {/* </Link> */}
                  </div>
                );
              })}
            </div>{" "}
          </div>
        );
      }
    }
  }

  render() {
    return <div>
        {this.displayProducts()}
        <Modal 
          handleVisibilty={this.state.modalVisibility} 
          handleClose={this.hideModal}
          // prodItem = {this.products}
        />
      </div>;
  }
}

export default graphql(getCategories)(ProductList);
