import React, { Component } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import MenuComponent from "./MenuComponent";
import InformComponent from "./InformComponent";
import HomeComponent from "./HomeComponent";
import ProductComponent from "./ProductComponent";
import ProductDetailComponent from "./ProductDetailComponent";

import SignupComponent from "./SignupComponent";
import LoginComponent from "./LoginComponent";
import ActiveComponent from "./ActiveComponent";
import MyprofileComponent from "./MyprofileComponent";

import Mycart from "./MycartComponent";
import Myorders from "./MyordersComponent";

class MainComponent extends Component {

  render(){
    return(

      <div style={{
        background:"#f5f6fa",
        minHeight:"100vh",
        fontFamily:"Arial, sans-serif"
      }}>

        {/* HEADER */}
        <MenuComponent/>
        <InformComponent/>

        {/* 🔥 FIX: đẩy toàn bộ content xuống */}
        <div style={{ marginTop: "120px" }}>

          {/* MAIN CONTENT */}
          <div style={{
            width:"90%",
            maxWidth:"1200px",
            margin:"20px auto",
            background:"#fff",
            padding:"20px",
            borderRadius:"12px",
            boxShadow:"0 4px 12px rgba(0,0,0,0.05)"
          }}>

            <Routes>

              <Route path="/" element={<Navigate replace to="/home"/>} />

              <Route path="/home" element={<HomeComponent/>} />

              <Route path="/product/category/:cid" element={<ProductComponent/>} />

              <Route path="/product/search/:keyword" element={<ProductComponent/>} />

              <Route path="/product/:id" element={<ProductDetailComponent/>} />

              {/* CUSTOMER ROUTES */}

              <Route path="/signup" element={<SignupComponent/>} />

              <Route path="/login" element={<LoginComponent/>} />

              <Route path="/active" element={<ActiveComponent/>} />

              <Route path="/myprofile" element={<MyprofileComponent/>} />

              <Route path="/mycart" element={<Mycart/>} />

              <Route path="/myorders" element={<Myorders/>} />

            </Routes>

          </div>

        </div>

      </div>
    )
  }

}

export default MainComponent;