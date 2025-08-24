import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/layouts/Header/page";
import Footer from "./components/layouts/Footer/page";
import Home from "./pages/home";
import PublicRoute from "./components/shared/common/PublicRoute";
import LoginForm from "./components/forms/loginForm";
import SignupForm from "./components/forms/signupForm";
import ProductsPage from "./pages/productsPage";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import SingleProductPage from "./pages/singleProductPage";
import BagPage from "./pages/BagPage";
import ProtectedRoute from "./components/shared/common/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

// import AdminDashboard from "./pages/AdminDashboard";
// import SuperAdminDashboard from "./pages/SuperAdminDashboard";

import DashboardLayout from "./components/layouts/DashboardLayout/page";
import Dashboard from "./pages/Dashboard";


function MainLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Store routes */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/collections"
          element={
            <MainLayout>
              <ProductsPage />
            </MainLayout>
          }
        />
        <Route
          path="/product/:slug"
          element={
            <MainLayout>
              <SingleProductPage />
            </MainLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <MainLayout>
                <BagPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Auth routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <MainLayout>
                <LoginForm />
              </MainLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <MainLayout>
                <SignupForm />
              </MainLayout>
            </PublicRoute>
          }
        />

        {/* Dashboard routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={["admin", "superAdmin"]}>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}



// function App() {
//   return (
//     <Router>
//       <ScrollToTop />
//       <Header />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/collections" element={<ProductsPage />} />
//         <Route path="/product/:slug" element={<SingleProductPage />} />
//         <Route
//           path="/cart"
//           element={
//             <ProtectedRoute>
//               <BagPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/login"
//           element={
//             <PublicRoute>
//               <LoginForm />
//             </PublicRoute>
//           }
//         />
//         <Route
//           path="/signup"
//           element={
//             <PublicRoute>
//               <SignupForm />
//             </PublicRoute>
//           }
//         />
//         <Route
//           path="/admin/dashboard"
//           element={
//             <ProtectedRoute role="admin">
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/super-admin/dashboard"
//           element={
//             <ProtectedRoute role="superAdmin">
//               <SuperAdminDashboard />
//             </ProtectedRoute>
//           }
//         />

//       </Routes>
//       <Footer />

//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={true}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />
//     </Router>
//   );
// }



export default App;
