import { Outlet, useLocation } from "react-router-dom"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar/Navbar"
import { Footer } from "../components/Footer/Footer"
import RegisterForm from "../components/RegisterForm"
import ForgotPasswordModal from "../components/ForgotPasswordForm"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginModal from "../components/LoginModal"


// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    const location = useLocation();

    return (
        <ScrollToTop location={location}>
            <Navbar />
            <LoginModal />
            <RegisterForm />
            <ForgotPasswordModal />
            <Outlet />
            <Footer />
            <ToastContainer position="top-right" autoClose={3000} />
        </ScrollToTop>
    )
}