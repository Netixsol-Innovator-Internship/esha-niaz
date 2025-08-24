"use client"

import { useEffect } from "react"
import Container from "../components/shared/common/Container"
import Breadcrumb from "../components/shared/common/Breadcrumb"
import ProductOverview from "../components/singleProduct/ProductOverview"
import ProductImage from "../components/singleProduct/ProductImage"
import ProductDetails from "../components/singleProduct/ProductDetails"
import ProductInfoSection from "../components/singleProduct/ProductInfoSection"
import SteepingInstructions from "../components/singleProduct/SteepingInstructions"
import ProductDescription from "../components/singleProduct/ProductDescription"
import RelatedProducts from "../components/shared/common/RelatedProducts"
import { useParams } from "react-router-dom"
import { useGetProductBySlugQuery } from "../redux/slices/product/productsApi"

const SingleProductPage = () => {
  const { slug } = useParams()

  const { data: product, isLoading, isError } = useGetProductBySlugQuery(slug)


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [slug])

  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading product...</div>
  if (isError) return <div className="flex justify-center items-center min-h-screen">Failed to load product</div>

  return (
    <div className="">
      <Breadcrumb />
      <div className="flex justify-center pb-12">
        <Container>
          <ProductOverview>
            <ProductImage img={product?.image} />
            <ProductDetails product={product} />
          </ProductOverview>
        </Container>
      </div>

      <div className="bg-[#F4F4F4] w-full flex justify-center mb-12">
        <Container>
          <ProductInfoSection>
            <SteepingInstructions />
            <ProductDescription product={product} />
          </ProductInfoSection>
        </Container>
      </div>

      <div className="flex justify-center">
        <Container>
          {/* <RelatedProducts title={"You may also like"} /> */}
        </Container>
      </div>
    </div>
  )
}

export default SingleProductPage