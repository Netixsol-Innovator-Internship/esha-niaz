import { useGetAllCollectionsQuery } from "../../redux/slices/product/productsApi"
import Container from "../shared/common/Container"
import { Link } from "react-router-dom"

const Collection = () => {
  const { data, isLoading, isError, error } = useGetAllCollectionsQuery()

  if (isLoading) return <div className="text-center py-12">Loading collections...</div>

  if (isError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Failed to load collections</div>
        <div className="text-sm text-gray-600">
          <p>API URL: {import.meta.env.VITE_API_URL}</p>
          <p>
            Error: {error?.status} - {error?.error || error?.data?.message || "Network error"}
          </p>
          <p className="mt-2 text-xs">Check console for more details</p>
        </div>
      </div>
    )
  }

  const collections = data || []

  return (
    <div className="flex flex-col items-center justify-center">
      <Container>
        <div className="collections flex-col justify-center items-center pb-14 pt-3  px-6 sm:px-10 lg:px-12">
          {/*collections area */}
          <h2 className="text-center text-2xl sm:text-3xl lg:text-[32px] font-prosto my-12">Our Collections</h2>

          <div className="w-full flex flex-wrap justify-start sm:justify-between items-center gap-4 sm:gap-6 lg:gap-7">
            {Array.isArray(collections) &&
              collections.map((item, index) => (
                <Link
                  to={"/collections"}
                  key={index}
                  className="
                  text-center 
                  mb-6
                  w-[calc(50%-0.5rem)]   /* 2 columns for small screens */
                  sm:w-[calc(50%-0.75rem)] 
                  md:w-[calc(33.333%-1rem)] 
                  lg:w-[calc(33.333%-1.167rem)] 
                  max-w-[360px]"
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.collection}
                    className="w-full aspect-square object-cover rounded mx-auto"
                  />
                  <p className="mt-3.5 font-medium font-montserrat text-sm sm:text-base">{item.collection}</p>
                </Link>
              ))}
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Collection