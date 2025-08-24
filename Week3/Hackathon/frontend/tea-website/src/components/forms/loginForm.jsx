"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useNavigate, Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { actions as authActions } from "../../redux/slices/auth/authSlice"
import { loginInSchema } from "../../schemas/authSchema"
import LoadingSpinner from "../shared/common/LoadingSpinner"
import { toast } from "react-toastify"
import { useLoginMutation } from "../../redux/slices/auth/authApi"

const LoginForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginInSchema),
    })

    const [loginMutation, { isLoading }] = useLoginMutation()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onSubmit = async (data) => {
        try {
            // Call RTK Query login mutation
            const res = await loginMutation(data).unwrap()

            // Save user & token in store + localStorage
            dispatch(authActions.setCredentials({ user: res.data, token: res.data.token }))

            // Redirect based on role
            if (["admin", "superAdmin"].includes(res.data.role)) {
                navigate("/dashboard")
            } else {
                navigate("/")
            }

            toast.success("Login successful!")
        } catch (err) {
            toast.error(err?.data?.message || "Login failed")
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white shadow-2xl p-6 sm:p-8 lg:p-10 w-full max-w-md sm:max-w-lg font-montserrat"
            >
                <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center text-[#282828]">Welcome Back</h2>

                <div className="mb-6">
                    <label className="block mb-2 sm:mb-3 font-medium text-sm sm:text-base text-[#282828]">Email</label>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="example@gmail.com"
                        className={`w-full px-4 sm:px-5 py-3 sm:py-4 border-1 text-sm sm:text-base focus:outline-none focus:ring-1 transition-all duration-300
              ${errors.email ? "border-[#e63946] focus:ring-[#e63946]" : "border-[#282828] focus:ring-[#457b9d]"}
              ${isLoading ? "bg-[#f1faee] cursor-not-allowed opacity-60" : "bg-white cursor-text hover:border-opacity-80"}`}
                    />
                    {errors.email && <p className="mt-2 text-sm sm:text-base text-[#e63946]">{errors.email.message}</p>}
                </div>

                <div className="mb-6">
                    <label className="block mb-2 sm:mb-3 font-medium text-sm sm:text-base text-[#282828]">Password</label>
                    <input
                        {...register("password")}
                        type="password"
                        placeholder="Enter your password"
                        className={`w-full px-4 sm:px-5 py-3 sm:py-4 border-1 text-sm sm:text-base focus:outline-none focus:ring-1 transition-all duration-300
              ${errors.password ? "border-[#e63946] focus:ring-[#e63946]" : "border-[#282828] focus:ring-[#457b9d]"}
              ${isLoading ? "bg-[#f1faee] cursor-not-allowed opacity-60" : "bg-white cursor-text hover:border-opacity-80"}`}
                    />
                    {errors.password && <p className="mt-2 text-sm sm:text-base text-[#e63946]">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 sm:py-4 text-white font-semibold transition-all duration-300 mb-6 sm:mb-8 flex items-center justify-center text-sm sm:text-base
            ${isLoading ? "bg-[#585757] cursor-not-allowed opacity-60" : "bg-[#282828] hover:bg-[#585757] cursor-pointer hover:shadow-lg hover:scale-105 active:scale-95"}`}
                >
                    {isLoading ? <LoadingSpinner /> : "Login"}
                </button>

                <p className="text-center text-sm sm:text-base text-[#282828]">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="font-medium hover:underline hover:opacity-80 hover:font-semibold text-[#1d3557] cursor-pointer"
                    >
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default LoginForm