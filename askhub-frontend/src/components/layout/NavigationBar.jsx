

function NavigationBar() {

return (
  <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">
      {/* Left */}
      <div className="flex items-center gap-10">
        <h1 className="cursor-pointer text-2xl font-bold tracking-tight">
          Logo
        </h1>

        <div className="flex items-center gap-8">
          {/* Active */}
          <button className="relative text-sm font-semibold text-black after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-black">
            Home
          </button>

          {/* Hover */}
          <button className="group relative text-sm font-medium text-gray-600 hover:text-black">
            Explore
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
          </button>
        </div>
      </div>

      {/* Center */}
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-60 rounded-full border border-gray-300 bg-gray-100 px-4 py-2 text-sm outline-none transition-all duration-300 focus:w-96 focus:border-black focus:bg-white"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
          Log In
        </button>

        <button className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800">
          Sign Up
        </button>
      </div>
    </div>
  </nav>
);

}

export default NavigationBar;