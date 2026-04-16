import React, { Component } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MenuComponent from "./components/MenuComponent";
import InformComponent from "./components/InformComponent";
import HomeComponent from "./components/HomeComponent";
import ProductComponent from "./components/ProductComponent";
import ProductDetailComponent from "./components/ProductDetailComponent";

import SignupComponent from "./components/SignupComponent";
import LoginComponent from "./components/LoginComponent";
import ActiveComponent from "./components/ActiveComponent";
import MyprofileComponent from "./components/MyprofileComponent";

// 🔥 thêm 2 component
import Mycart from "./components/MycartComponent";
import Myorders from "./components/MyordersComponent";

import MyProvider from "./contexts/MyProvider";

class App extends Component {
  render() {
    return (
      <MyProvider>
        <BrowserRouter>

          {/* MENU */}
          <MenuComponent />

          {/* INFORM */}
          <InformComponent />

          <Routes>

            {/* DEFAULT */}
            <Route path="/" element={<Navigate replace to="/home" />} />

            {/* HOME */}
            <Route path="/home" element={<HomeComponent />} />

            {/* CATEGORY */}
            <Route
              path="/product/category/:cid"
              element={<ProductComponent />}
            />

            {/* SEARCH */}
            <Route
              path="/product/search/:keyword"
              element={<ProductComponent />}
            />

            {/* PRODUCT DETAIL */}
            <Route
              path="/product/:id"
              element={<ProductDetailComponent />}
            />

            {/* CUSTOMER */}
            <Route path="/signup" element={<SignupComponent />} />
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/active" element={<ActiveComponent />} />
            <Route path="/myprofile" element={<MyprofileComponent />} />

            {/* 🔥 QUAN TRỌNG */}
            <Route path="/mycart" element={<Mycart />} />
            <Route path="/myorders" element={<Myorders />} />

          </Routes>

        </BrowserRouter>
      </MyProvider>
    );
  }
}

export default App;