// Dashboard.jsx
import { Routes, Route } from "react-router-dom";
import DashboardPage from "../components/dashboard/DashboardPage";
import ProductManagement from "../components/dashboard/ProductManagement";
import UserManagement from "../components/dashboard/UserManagement";
import AddProductForm from "../components/dashboard/AddProductForm";
import EditProductWrapper from "../components/dashboard/EditProductWrapper";


const Dashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />}>
        <Route path="products" element={<ProductManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="add-product" element={<AddProductForm />} />
        <Route path="edit-product/:id" element={<EditProductWrapper/>} />
        <Route index element={<ProductManagement />} />
      </Route>
    </Routes>
  );
};

export default Dashboard;