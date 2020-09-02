import React from 'react'
import {
    Link
  } from "react-router-dom";

class Header extends React.Component { 
    render() {
        return (
            <div className="header">
                <div className="header-item">MAB Dashboard</div>
                <Link className="header-item" to="/">Home</Link>
            </div>
        )
    }
}

export default Header;