import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'recipesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://www.themealdb.com/api/json/v1/1/' }),
  endpoints: (builder) => ({
    searchRecipes: builder.query({
      query: (term) => `search.php?s=${term}`,
    }),
  }),
})

export const { useSearchRecipesQuery } = apiSlice
