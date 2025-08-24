import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link } from "react-router-dom";
import { signUpSchema } from "../../schemas/authSchema";
import LoadingSpinner from "../shared/common/LoadingSpinner";
import { toast } from 'react-toastify';
import { useSignupMutation } from "../../redux/slices/auth/authApi";

const SignupForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(signUpSchema),
    });

    const [signup, { isLoading }] = useSignupMutation();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await signup({
                name: data.name,
                email: data.email,
                password: data.password,
            }).unwrap();

            toast.success("Account created successfully! Redirecting to login...");
            navigate("/login");
        } catch (err) {
            toast.error(err?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white shadow-2xl p-6 sm:p-8 lg:p-10 w-full max-w-md sm:max-w-lg font-montserrat"
            >
                <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center text-[#282828]">
                    Create an Account
                </h2>

                {/* Name */}
                <div className="mb-6">
                    <label className="block mb-2 sm:mb-3 font-medium text-sm sm:text-base text-[#282828]">
                        Name
                    </label>
                    <input
                        {...register("name")}
                        type="text"
                        placeholder="Enter your full name"
                        className={`w-full px-4 sm:px-5 py-3 sm:py-4 border-1 text-sm sm:text-base focus:outline-none focus:ring-1 transition-all duration-300
              ${errors.name ? "border-[#e63946] focus:ring-[#e63946]" : "focus:ring-[#457b9d]"}
              ${isLoading ? "bg-[#f1faee] cursor-not-allowed opacity-60" : "bg-white cursor-text hover:border-opacity-80"}`}
                    />
                    {errors.name && <p className="mt-2 text-sm sm:text-base text-[#e63946]">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div className="mb-6">
                    <label className="block mb-2 sm:mb-3 font-medium text-sm sm:text-base text-[#282828]">
                        Email
                    </label>
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

                {/* Password */}
                <div className="mb-6">
                    <label className="block mb-2 sm:mb-3 font-medium text-sm sm:text-base text-[#282828]">
                        Password
                    </label>
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

                {/* Confirm Password */}
                <div className="mb-6">
                    <label className="block mb-2 sm:mb-3 font-medium text-sm sm:text-base text-[#282828]">
                        Confirm Password
                    </label>
                    <input
                        {...register("confirmPassword")}
                        type="password"
                        placeholder="Confirm your password"
                        className={`w-full px-4 sm:px-5 py-3 sm:py-4 border-1 text-sm sm:text-base focus:outline-none focus:ring-1 transition-all duration-300
              ${errors.confirmPassword ? "border-[#e63946] focus:ring-[#e63946]" : "border-[#282828] focus:ring-[#457b9d]"}
              ${isLoading ? "bg-[#f1faee] cursor-not-allowed opacity-60" : "bg-white cursor-text hover:border-opacity-80"}`}
                    />
                    {errors.confirmPassword && <p className="mt-2 text-sm sm:text-base text-[#e63946]">{errors.confirmPassword.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 sm:py-4 text-white font-semibold transition-all duration-300 mb-6 sm:mb-8 flex items-center justify-center text-sm sm:text-base
            ${isLoading ? "bg-[#585757] cursor-not-allowed opacity-60" : "bg-[#282828] hover:bg-[#585757] cursor-pointer hover:shadow-lg hover:scale-105 active:scale-95"}`}
                >
                    {isLoading ? <LoadingSpinner /> : "Create Account"}
                </button>

                <p className="text-center text-sm sm:text-base text-[#282828]">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-medium hover:underline hover:opacity-80 hover:font-semibold text-[#1d3557] cursor-pointer"
                    >
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default SignupForm;