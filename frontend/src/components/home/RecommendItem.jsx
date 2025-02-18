import { Link } from 'react-router-dom';
import './RecommendItem.scss'

function RecommendItem({ cosmetic }) {
  return (
    <Link to={`/cosmetics/${cosmetic.cosmeticId}`} className='recommend-item'>
      <img className='recomend-img' src={cosmetic.imageUrl} alt={cosmetic.cosmeticName} />
      <div className="recommend-txt">
        <p className='brand-name'>{cosmetic.brandName}</p>
        <p className='cosmetic-name'>{cosmetic.cosmeticName}</p>
      </div>
    </Link>
  )
}

export default RecommendItem