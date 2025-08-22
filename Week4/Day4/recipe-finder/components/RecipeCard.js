'use client'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { addFavorite, removeFavorite } from '../store/favoritesSlice'

export default function RecipeCard({ recipe }) {
  const dispatch = useDispatch()
  const favorites = useSelector((state) => state.favorites)
  const isFav = favorites.some((r) => r.idMeal === recipe.idMeal)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      className="p-4 border cursor-pointer rounded-lg shadow-md flex flex-col items-center"
    >
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="w-48  rounded-md"
      />
      <h2 className="font-bold mt-2">{recipe.strMeal}</h2>
      <button
        onClick={() =>
          isFav
            ? dispatch(removeFavorite(recipe.idMeal))
            : dispatch(addFavorite(recipe))
        }
        className={`mt-2 px-4 py-1  cursor-pointer rounded-lg text-white ${
          isFav ? 'bg-red-600' : 'bg-blue-600'
        }`}
      >
        {isFav ? 'Remove Favorite' : 'Add Favorite'}
      </button>
    </motion.div>
  )
}
