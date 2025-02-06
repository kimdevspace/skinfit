import React from 'react'
import './RecommendItem.scss'
// import testImg from './favicon.png'

function RecommendItem() {
  return (
    <button className='recommend-item'>
      {/* <img className='recomend-img' src={testImg} alt="" /> */}
      <div className="recommend-txt">
        <p className='brand-name'>브랜드명</p>
        <p className='cosmetic-name'>화장품명</p>
      </div>
    </button>
  )
}

export default RecommendItem