import React from 'react'
import { Link } from 'react-router-dom'
import cover from '../assets/cover.png'
import './styles/templateCard.css'

export default function TemplateCard({ templateId, templateName }) {

  return (
    <div className='template-card-container'>
      <Link to={`/template/${templateId}`} className='card-link'>
        <div className='card-cover-container'>
          <img src={cover} alt="Card Cover" className='card-cover'/>
        </div>
        <div className='card-title-container'>
          <h3>{templateName}</h3>
        </div>
      </Link>
    </div>
  )
}