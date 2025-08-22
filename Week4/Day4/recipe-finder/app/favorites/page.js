'use client'
import { useSelector } from 'react-redux'
import RecipeCard from '../../components/RecipeCard'

export default function FavoritesPage() {
  const favorites = useSelector((state) => state.favorites)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Favorites</h1>
      {favorites.length === 0 ? (
        <p>No favorites yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((recipe) => (
            <RecipeCard key={recipe.idMeal} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}
