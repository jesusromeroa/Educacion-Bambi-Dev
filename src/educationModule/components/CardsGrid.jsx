import React from 'react'
import './styles/cardsGrid.css'
import { CardElement } from './CardElement'
import { useSelector } from 'react-redux'
import { CircularLoader } from './CircularLoader'

export const CardsGrid = () => {

  const { loadedCategories, isLoading } = useSelector(store => store.educationModule.categories);

  return (
    (isLoading) ?(
      <div style={{ marginLeft: '8%', marginRight: '8%', marginTop: '200px', marginBottom: '200px', display: 'flex', justifyContent: 'center'}}>
        <CircularLoader/>
      </div>
    )
    :
    (
      <div className='cards-grid'>
        {loadedCategories.map((card, index) => <CardElement key={index+card.title} {...card}/>)}
      </div>
    )
  )
}
