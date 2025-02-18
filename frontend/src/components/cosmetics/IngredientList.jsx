import React from 'react'
import './IngredientList.scss'

function IngredientList({ className, ingredients }) {
    return (
      <div className="ingredient-list">
        {ingredients.length > 0 ? (
          ingredients.map((item) => (
            <div key={item.ingredientId} className="ingredient">
              <p className="ingredient-name">{item.ingredientName}</p>
              <p className={`ewg-score ${className}`}>
                {item.ewgScoreMin && `${item.ewgScoreMin}-`}{item.ewgScoreMax !== null ? `${item.ewgScoreMax}` : '-'}
              </p>
            </div>
          ))
        ) : (
          <p className='not-included'>해당 성분 없음</p>
        )}
      </div>
    );
  }
  

export default IngredientList