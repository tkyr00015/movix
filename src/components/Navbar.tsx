"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, X, Menu } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync search input if user lands directly on /search?q=...
  useEffect(() => {
    if (pathname === "/search") {
      const q = new URLSearchParams(window.location.search).get("q");
      if (q) {
        setSearchQuery(q);
        setSearchOpen(true);
      }
    }
  }, [pathname]);

  // Click outside to collapse search bar if empty
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        if (!searchQuery.trim()) {
          setSearchOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchQuery]);

  const toggleSearch = () => {
    if (!searchOpen) {
      setSearchOpen(true);
      setTimeout(() => inputRef.current?.focus(), 80);
    } else if (!searchQuery.trim()) {
      setSearchOpen(false);
    } else {
      handleSearchSubmit();
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchQuery("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      if (searchQuery) {
        setSearchQuery("");
      } else {
        setSearchOpen(false);
        inputRef.current?.blur();
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        isScrolled
          ? "bg-netflix-black/95 backdrop-blur-md shadow-xl"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side: Brand Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-netflix-red font-black text-2xl sm:text-3xl tracking-wider uppercase drop-shadow-md transition-transform group-hover:scale-105">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
            {siteConfig.navigation.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors duration-200 ${
                    active
                      ? "text-white font-semibold"
                      : "text-zinc-300 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Side: Search & Profile */}
        <div className="flex items-center gap-4">
          {/* Netflix-Style Expandable Search Box */}
          <div
            ref={searchContainerRef}
            className={`relative flex items-center transition-all duration-300 ease-in-out ${
              searchOpen
                ? "w-48 sm:w-64 md:w-72 bg-black/90 border border-white px-2.5 py-1.5 shadow-lg"
                : "w-9 h-9 bg-transparent border border-transparent justify-center"
            }`}
          >
            {/* Search Icon / Toggle */}
            <button
              type="button"
              onClick={toggleSearch}
              aria-label="Search"
              className="text-white hover:text-zinc-200 transition-colors flex-shrink-0 flex items-center justify-center focus:outline-none"
            >
              <Search className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </button>

            {/* Hidden / Expanded Search Input Form */}
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center min-w-0">
              <input
                ref={inputRef}
                type="text"
                placeholder="Titles, people, genres"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                tabIndex={searchOpen ? 0 : -1}
                className={`bg-transparent text-white text-xs sm:text-sm placeholder:text-zinc-400 focus:outline-none border-none transition-opacity duration-300 w-full pl-2 ${
                  searchOpen ? "opacity-100" : "opacity-0 w-0 pointer-events-none p-0"
                }`}
              />
            </form>

            {/* Clear Button (Netflix 'X' inside input) */}
            {searchOpen && searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="text-zinc-400 hover:text-white transition-colors flex-shrink-0 ml-1 p-0.5 focus:outline-none"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-zinc-200 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-netflix-black/95 border-b border-zinc-800 px-4 py-4 space-y-3">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-zinc-300 hover:text-netflix-red"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
