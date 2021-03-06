import React, { Component } from "react";
import { graphql } from "react-apollo";
import "./Navbar.scss";
import { Link } from "react-router-dom";
import { currencyProduct } from "../../GraphQl/Queries";
import "font-awesome/css/font-awesome.min.css";
import MiniCart from "./MiniCart";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCurrency: false,
      showCart: false,
      modaleVisibility: false,
      cardProductsQuantity: 0,
    };

    if (typeof localStorage["currencySymbol"] === "undefined") {
      localStorage["currencySymbol"] = "$";
    }
  }

  handleVisibilty = () => {
    this.setState({ modaleVisibility: true });
  };

  hideModal = () => {
    this.setState({ modaleVisibility: false });
  };

  displayCard = () => {
    const addedProducts = JSON.parse(localStorage["cardProduct"]);
    return addedProducts.map((val) => {
      // console.log(val.brand);
      return (
        <>
          <div className="car-item" key={val.id}>
            <div className="cart-prod-items-show">
              <div className="item-prod-belt-left">
                <h4 className="item-prod-name">{val.name}</h4>
                <h3 className="item-prod-names">{val.brand}</h3>
                <p className="car-price">
                  {localStorage["currencySymbol"]}{" "}
                  {
                    val.prices.find(
                      (p) =>
                        p.currency.symbol === localStorage["currencySymbol"]
                    ).amount
                  }
                </p>
                <span
                  className="car-delete-btn"
                  onClick={() => this.removeItemFromCart(val.id)}
                >
                  <i className="fa fa-trash fa-lg"></i>
                </span>
                <div className="button-prod-cart">
                  <button className="button-attribute">S</button>
                </div>
              </div>
              <div className="item-prod-belt-right">
                <div className="button-prod-quantity">
                  <button
                    className="button-quantity"
                    onClick={() => this.addToCart(val)}
                  >
                    +
                  </button>
                  <p className="cart-qty">{val.quantity}</p>
                  <button
                    className="button-quantity"
                    onClick={() => this.minusToCart(val)}
                  >
                    -
                  </button>
                </div>
                <img className="car-img" src={val.gallery[0]} alt="" />
              </div>
            </div>
          </div>
        </>
      );
    });
  };

  displayCurrency() {
    var data = this.props.data;
    if (data.loading) {
      return <p>Loading</p>;
    } else {
      return data.currencies.map((item) => {
        return (
          <li
            key={item.symbol}
            className="cur-options"
            onClick={() => {
              localStorage["currencySymbol"] = item.symbol;

              var products = JSON.parse(localStorage["cardProduct"]);
              let amount = 0;
              for (var i = 0; i < products.length; i++) {
                products[i].symbol = item.symbol;
                products[i].amount =
                  products[i].prices.find(
                    (p) => p.currency.symbol === item.symbol
                  ).amount * products[i].quantity;
                amount += products[i].amount;
              }
              localStorage.setItem("cardProduct", JSON.stringify(products));
              localStorage["totalCardAmount"] = amount;

              window.location.reload(false);
            }}
          >
            <div className="item-label">
              {item.symbol} {item.label}
            </div>
          </li>
        );
      });
    }
  }

  addToCart = (val) => {
    val["quantity"] = 1;

    if (localStorage["cardProduct"] == null) {
      localStorage["cardProduct"] = JSON.stringify([val]);
    } else {
      let products = JSON.parse(localStorage["cardProduct"]) || [];
      const index = products.findIndex((obj) => obj.id === val.id);
      if (index >= 0) {
        products[index].quantity += 1;
      } else {
        products.push(val);
        this.setState({ cardProductsQuantity: products.length });
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
  };

  minusToCart = (val) => {
    val["quantity"] = 1;

    if (localStorage["cardProduct"] == null) {
      localStorage["cardProduct"] = JSON.stringify([val]);
    } else {
      let products = JSON.parse(localStorage["cardProduct"]) || [];
      const index = products.findIndex((obj) => obj.id === val.id);
      if (index >= 0) {
        products[index].quantity -= 1;
      } else {
        products.push(val);
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
  };

  removeItemFromCart(id) {
    var products = JSON.parse(localStorage["cardProduct"]);
    let amount = localStorage["totalCardAmount"];
    for (var i = 0; i < products.length; i++) {
      if (id === products[i].id) {
        amount -=
          products[i].prices.find(
            (p) => p.currency.symbol === localStorage["currencySymbol"]
          ).amount * products[i].quantity;
        products[i].quantity -= 1;
        products.splice(i, 1);
        break;
      }
    }
    // this.setState({cardProductsQuantity : products.length})
    localStorage.setItem("cardProduct", JSON.stringify(products));
    localStorage["totalCardAmount"] = amount.toFixed(2);
  }

  render() {
    return (
      <div className="header-nav">
        <div className="nav-bar">
          <div className="link-navbar">
            <Link
              className="link-item "
              to="/all"
              onClick={() => {
                localStorage["category"] = "All";
              }}
            >
              ALL
            </Link>
            <Link
              className="link-item"
              to="/clothes"
              onClick={() => {
                localStorage["category"] = "Clothes";
              }}
            >
              CLOTHES
            </Link>
            <Link
              className="link-item"
              to="/tech"
              onClick={() => {
                localStorage["category"] = "Tech";
              }}
            >
              TECH
            </Link>
          </div>
          <div>
            <span>
              <i className="fa fa-shopping-bag" aria-hidden="true"></i>
            </span>
          </div>
          <div className="nav-right-block">
            <Link
              className="currency-prod-label"
              to="#"
              onMouseEnter={() => this.setState({ showCurrency: true })}
              onMouseLeave={() => this.setState({ showCurrency: false })}
            >
              {this.state.showCurrency ? (
                <div className="cur-dropdown">
                  <ul
                    className="cur-submenu"
                    onClick={() =>
                      this.setState({ showCurrency: !this.state.showCurrency })
                    }
                  >
                    {this.displayCurrency()}
                  </ul>
                </div>
              ) : (
                <></>
              )}
              <span className="label-currency">
                {" "}
                {localStorage["currencySymbol"]}{" "}
                <i className="fa fa-caret-down"></i>{" "}
              </span>
            </Link>

            <div
              className="nav-car-btn"
              to="#"
              onClick={this.handleVisibilty}
              // onMouseLeave={() => this.setState({ showCart: false })}
            >
              <span>
                <i className="fa fa-shopping-cart fa-2x"></i>
              </span>
              <p className="cart-quantities">
                {typeof localStorage["cardProduct"] === "undefined" ||
                  JSON.parse(localStorage["cardProduct"]).length +
                    this.state.cardProductsQuantity}{" "}
              </p>
            </div>
          </div>
        </div>
        <MiniCart
          handleVisibilty={this.state.modaleVisibility}
          handleClose={this.hideModal}
          // showCart = {this.state.showCart}
        />
      </div>
    );
  }
}

export default graphql(currencyProduct)(Navbar);
