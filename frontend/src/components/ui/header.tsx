import Link from "next/link";
import { useState } from "react";
import { Menu, TableProperties, X } from "lucide-react";
import AuthButton from "../auth/button";
import AuthModal from "../auth/login-modal";
import Image from "next/image";
import { DebounceSearchBar } from "../shared/debounce-search-bar";
import useUser from "@/hooks/useUser";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleAuthModal = () => {
    setIsAuthModalOpen(!isAuthModalOpen);
  };

  const { user } = useUser();

  return (
    <header className="bg-white shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/" className="text-xl font-bold text-gray-800">
              <Image
                src="/images/logo.png"
                alt="Logo"
                className="w-10 h-10"
                width={40}
                height={40}
              />
            </Link>
          </div>
          <div className="-mr-2 -my-2 md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open menu</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {user && user.username && (
            <nav className="hidden md:flex space-x-10">
              <Link
                href="/watchlist"
                className="text-base font-medium text-gray-900 hover:text-gray-700 flex items-center gap-2"
              >
                <TableProperties />
                <span>Watchlist</span>
              </Link>
            </nav>
          )}

          <nav className="hidden md:flex space-x-10">
            <AuthButton toggleAuthModal={toggleAuthModal} />
          </nav>

          {user && user.username && (
            <nav className="hidden md:flex space-x-10">
              <DebounceSearchBar />
            </nav>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <Link href="/" className="text-xl font-bold text-gray-800">
                    <img
                      src="/images/logo.jpg"
                      alt="Logo"
                      className="w-10 h-10 rounded-full"
                    />
                  </Link>
                </div>
                <div className="-mr-2">
                  <button
                    type="button"
                    className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    onClick={toggleMenu}
                  >
                    <span className="sr-only">Close menu</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  <Link
                    href="/"
                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                  >
                    Home
                  </Link>
                  <Link
                    href="/about"
                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                  >
                    About
                  </Link>
                  <Link
                    href="/services"
                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                  >
                    Services
                  </Link>
                  <Link
                    href="/contact"
                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                  >
                    Contact
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
      <AuthModal isOpen={isAuthModalOpen} setIsOpen={setIsAuthModalOpen} />
    </header>
  );
};

export default Header;
