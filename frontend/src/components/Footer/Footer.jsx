import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img className='logo' src={assets.logo} alt="" />
          
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>About</h2>
            <p>Food Junction is a beloved restaurant offering authentic Bengali cuisine, known for dishes like Shorshe Ilish and Mishti Doi. With a warm ambiance and hospitable staff, it provides a delightful experience celebrating Bengal's rich flavors..</p>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
            <li>Owner:Food Junction.</li>
                <li>Address:Barasat,Kolkata.</li>
                <li>Pnone:8100090650</li>
                <li>Email:d12mondal@gmail.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2024 © Food Junction - All Right Reserved.</p>
    </div>
  )
}

export default Footer
