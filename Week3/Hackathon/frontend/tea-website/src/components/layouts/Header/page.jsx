import { useState, useEffect } from "react";
import Container from "../../shared/common/Container";
import hamburgerIcon from "../../../assets/header/hamburger.svg";
import { NavList, Icons } from "../../../constants/gernal";
import { Link, useNavigate } from "react-router-dom";
import { MobileMenu } from "./MobileMenu";
import logo from "../../../assets/header/logo.svg";
import CartPopup from "./CartPopup";
import { useDispatch, useSelector } from "react-redux";
import { actions as authActions, getToken, getUser } from "../../../redux/slices/auth/authSlice";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const user = useSelector(getUser);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(authActions.logout()); // clears user and token from Redux + localStorage
    setShowUserPopup(false);
    setIsMenuOpen(false);
    navigate("/"); // redirect to home
  };

  const handleUserClick = () => {
    if (token) {
      // Logged in → toggle popup
      setShowUserPopup(!showUserPopup);
    } else {
      // Guest → go to login
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center justify-center font-montserrat relative">
      <Container>
        {/* Header - hidden when menu is open */}
        {!isMenuOpen && (
          <header className="flex items-center justify-between my-2 px-6 sm:px-2 md:my-7 lg:px-12 w-full">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img
                src={logo}
                alt="Company Logo"
                className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
              />
              <h1 className="text-sm sm:text-xl md:text-xl font-prosto font-normal">
                Brand Name
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-3 lg:gap-6">
              {Object.entries(NavList).map(([key, item]) => (
                <Link
                  key={key}
                  to={item.path}
                  className="text-[#282828] text-xs lg:text-sm font-montserrat font-medium hover:text-black uppercase whitespace-nowrap"
                >
                  {item.value}
                </Link>
              ))}

                {/* If user is logged in → show Dashboard + Logout */}
  {token && (
    <>
      {["admin", "superAdmin"].includes(user?.role) && (
        <Link
          to="/dashboard"
          className="text-[#282828] text-xs lg:text-sm font-montserrat font-medium hover:text-black uppercase whitespace-nowrap"
        >
          Dashboard
        </Link>
      )}
      <button
        onClick={handleLogout}
        className="text-[#282828] text-xs lg:text-sm font-montserrat font-medium hover:text-black uppercase whitespace-nowrap"
      >
        Logout
      </button>
    </>
  )}
            </nav>

            {/* Side Icons + Hamburger */}
            <div className="flex items-center gap-3 sm:gap-6 lg:gap-9 flex-shrink-0 relative">
              {/* User Icon */}
              <button
                // onClick={handleUserClick}
                className="hidden md:block cursor-pointer"
              >
                <img
                  src={Icons.search.src}
                  alt={Icons.search.alt}
                  className="h-5 w-5 sm:h-6 sm:w-6"
                />
              </button>
              {/* User Icon */}
              <button
                onClick={handleUserClick}
                className="hidden md:block cursor-pointer"
              >
                <img
                  src={Icons.user.src}
                  alt={Icons.user.alt}
                  className="h-5 w-5 sm:h-6 sm:w-6"
                />
              </button>

              {/* Popup (only if logged in) */}



              

              {/* Cart Icon */}
<button
  onClick={() => {
    if (!token) {
      navigate("/login");  // Guest → redirect to login
    } else {
      setIsCartOpen(!isCartOpen); // Logged in → show cart popup
    }
  }}
  className="hidden md:block cursor-pointer"
>
  <img
    src={Icons.cart.src}
    alt={Icons.cart.alt}
    className="h-5 w-5 sm:h-6 sm:w-6"
  />
</button>

              {/* Hamburger (mobile only) */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden relative focus:outline-none"
              >
                <img
                  src={hamburgerIcon}
                  alt="Menu"
                  className="h-7 w-7 sm:h-6 sm:w-6"
                />
              </button>

            </div>
          </header>
        )}


        {/* Mobile Menu */}
        {isMenuOpen && (
          <MobileMenu
            onClose={() => setIsMenuOpen(false)}
            setIsCartOpen={setIsCartOpen}
            token={token}
            user={user}   // 👈 add this
            onLogout={handleLogout}
          />
        )}


        {isCartOpen && <CartPopup onClose={() => setIsCartOpen(false)} />}
      </Container>
    </div>
  );
};

export default Header;