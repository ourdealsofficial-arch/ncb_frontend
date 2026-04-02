import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Badge from "./Badge";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Determine user role for navigation
  const isSuperAdmin = user?.role === "SUPER_ADMIN" || user?.role === "Super_admin" || user?.role === "super_admin";
  const isFranchiseAdmin = user?.role === "FRANCHISE_ADMIN" || user?.role === "Franchise_Admin" || user?.role === "franchise_admin";

  return (
    <nav className="bg-[#FF6B35] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center cursor-pointer group"
          >
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
              <span className="text-[#FF6B35] font-bold text-xl">R</span>
            </div>
            <h1 className="ml-3 text-xl font-bold text-white tracking-tight">
              Restaurant Manager
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {!isAuthenticated ? (
              // Before Login - Show only Login button
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 bg-white text-[#FF6B35] rounded-lg hover:bg-gray-100 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Login
              </button>
            ) : (
              <>
                {/* Super Admin Navigation */}
                {isSuperAdmin && (
                  <>
                    <NavLink
                      label="Dashboard"
                      isActive={isActive("/dashboard")}
                      onClick={() => navigate("/dashboard")}
                    />
                    <NavLink
                      label="Create Franchise"
                      isActive={isActive("/create-franchise")}
                      onClick={() => navigate("/create-franchise")}
                    />
                    <NavLink
                      label="Food Management"
                      isActive={isActive("/food-management")}
                      onClick={() => navigate("/food-management")}
                    />
                    <NavLink
                      label="Bills"
                      isActive={isActive("/bills")}
                      onClick={() => navigate("/bills")}
                    />
                    <NavLink
                      label="Analytics"
                      isActive={isActive("/analytics")}
                      onClick={() => navigate("/analytics")}
                    />
                  </>
                )}

                {/* Franchise Admin Navigation */}
                {isFranchiseAdmin && (
                  <>
                    <NavLink
                      label="Dashboard"
                      isActive={isActive("/dashboard")}
                      onClick={() => navigate("/dashboard")}
                    />
                    <NavLink
                      label="Food Menu"
                      isActive={isActive("/food-availability")}
                      onClick={() => navigate("/food-availability")}
                    />
                    <NavLink
                      label="Bills"
                      isActive={isActive("/bills")}
                      onClick={() => navigate("/bills")}
                    />
                    <NavLink
                      label="Analytics"
                      isActive={isActive("/analytics")}
                      onClick={() => navigate("/analytics")}
                    />
                  </>
                )}

                {/* User Menu */}
                <div className="relative ml-4 pl-4 border-l border-white border-opacity-30">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-white hover:text-orange-600 hover:bg-opacity-10 rounded-lg transition-all duration-200"
                  >
                    <User size={20} />
                    <span className="font-medium">{user?.name || "User"}</span>
                    <Badge variant={isSuperAdmin ? "warning" : "info"} size="sm">
                      {isSuperAdmin ? "Super Admin" : "Franchise Admin"}
                    </Badge>
                    <ChevronDown size={16} />
                  </button>

                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200">
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <User size={16} />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors duration-200"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {!isAuthenticated ? (
              // Mobile - Before Login
              <button
                onClick={() => {
                  navigate("/login");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#E55A2B] font-medium transition-colors duration-200"
              >
                Login
              </button>
            ) : (
              <>
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="font-medium text-gray-800">{user?.name || "User"}</p>
                  <Badge variant={isSuperAdmin ? "warning" : "info"} size="sm" className="mt-1">
                    {isSuperAdmin ? "Super Admin" : "Franchise Admin"}
                  </Badge>
                </div>

                {/* Super Admin Mobile Navigation */}
                {isSuperAdmin && (
                  <>
                    <MobileNavLink
                      label="Dashboard"
                      onClick={() => {
                        navigate("/dashboard");
                        setMobileMenuOpen(false);
                      }}
                      isActive={isActive("/dashboard")}
                    />
                    <MobileNavLink
                      label="Create Franchise"
                      onClick={() => {
                        navigate("/create-franchise");
                        setMobileMenuOpen(false);
                      }}
                      isActive={isActive("/create-franchise")}
                    />
                    <MobileNavLink
                      label="Food Management"
                      onClick={() => {
                        navigate("/food-management");
                        setMobileMenuOpen(false);
                      }}
                      isActive={isActive("/food-management")}
                    />
                    <MobileNavLink
                      label="Bills"
                      onClick={() => {
                        navigate("/bills");
                        setMobileMenuOpen(false);
                      }}
                      isActive={isActive("/bills")}
                    />
                    <MobileNavLink
                      label="Analytics"
                      onClick={() => {
                        navigate("/analytics");
                        setMobileMenuOpen(false);
                      }}
                      isActive={isActive("/analytics")}
                    />
                  </>
                )}

                {/* Franchise Admin Mobile Navigation */}
                {isFranchiseAdmin && (
                  <>
                    <MobileNavLink
                      label="Dashboard"
                      onClick={() => {
                        navigate("/dashboard");
                        setMobileMenuOpen(false);
                      }}
                      isActive={isActive("/dashboard")}
                    />
                    <MobileNavLink
                      label="Food Availability"
                      onClick={() => {
                        navigate("/food-availability");
                        setMobileMenuOpen(false);
                      }}
                      isActive={isActive("/food-availability")}
                    />
                    <MobileNavLink
                      label="Bills"
                      onClick={() => {
                        navigate("/bills");
                        setMobileMenuOpen(false);
                      }}
                      isActive={isActive("/bills")}
                    />
                    <MobileNavLink
                      label="Analytics"
                      onClick={() => {
                        navigate("/analytics");
                        setMobileMenuOpen(false);
                      }}
                      isActive={isActive("/analytics")}
                    />
                  </>
                )}

                {/* Common Mobile Links */}
                <MobileNavLink
                  label="Profile"
                  onClick={() => {
                    navigate("/profile");
                    setMobileMenuOpen(false);
                  }}
                  isActive={isActive("/profile")}
                />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Desktop Nav Link Component
const NavLink = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      isActive
        ? "text-[#FF6B35] bg-white bg-opacity-20"
        : "text-white hover:bg-white hover:text-[#FF6B35] hover:bg-opacity-10"
    }`}
  >
    {label}
  </button>
);

// Mobile Nav Link Component
const MobileNavLink = ({ label, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
      isActive
        ? "text-[#FF6B35] bg-orange-50"
        : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    {label}
  </button>
);

export default Navbar;
