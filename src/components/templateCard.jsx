import React from 'react'
import cover from '../assets/cover.png'
import './styles/templateCard.css'

export default function templateCard() {
  return (
    <div className='main'>
      <div className='card-image'>
        <img src={cover} alt="Card Cover" className='image'/>
      </div>
      <div className='card-title'>
        Template Card Title
      </div>
    </div>
  )
}
