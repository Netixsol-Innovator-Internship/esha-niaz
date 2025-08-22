'use client'
import { useSelector, useDispatch } from 'react-redux'
import { useSearchRecipesQuery } from '../store/apiSlice'
import { setSearchTerm } from '../store/searchSlice'
import RecipeCard from '../components/RecipeCard'

export default function HomePage() {
  const term = useSelector((state) => state.search.term)
  const dispatch = useDispatch()

  const { data, error, isLoading } = useSearchRecipesQuery(term)

  return (
    <div className=''>
      <h1 className="text-2xl font-bold mb-4">Recipe Finder</h1>
      <input
        type="text"
        placeholder="Search recipes..."
        value={term}
        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
        className="border p-2 w-full mb-6"
      />

      {isLoading && <p>Loading...</p>}
      {error && <p>Error fetching recipes</p>}

      {/* Handle wrong/no results */}
      {data?.meals === null && <p className="text-red-600">Recipe not found</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data?.meals?.map((recipe) => (
          <RecipeCard key={recipe.idMeal} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}
