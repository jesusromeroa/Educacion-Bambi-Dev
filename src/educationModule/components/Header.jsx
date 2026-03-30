import React from 'react'
import './styles/header.css'
import { Link, NavLink } from 'react-router'

export const Header = () => {
  return (
    <div className="header-container">
        <Link to="/" tabIndex={0} className="link-to-inicio">
          <img src="https://ik.imagekit.io/ipp76m5qu/logo/HBV_logo_2022_verde.png?updatedAt=1743442250966" alt="Bambi Logo" className="header-logo"/>
          <p className="header-title">Educación Bambi</p>
        </Link>
        
    </div>
  )
}
