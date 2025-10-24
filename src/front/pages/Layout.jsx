import { Outlet } from "react-router-dom"
import ScrollToTop from "../components/ScrollToTop"
import {Navbar}  from "../components/Navbar/Navbar"
import { Footer } from "../components/Footer"
import LoginForm from "../components/LoginForm"
import RegisterForm from "../components/RegisterForm"
import ForgotPasswordModal from "../components/ForgotPasswordForm"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    return (
        <ScrollToTop>
            <Navbar />
            <LoginForm />
            <RegisterForm />
            <ForgotPasswordModal />
            <Outlet />
            <Footer />
            <ToastContainer position="top-right" autoClose={3000} />
        </ScrollToTop>
    )
}