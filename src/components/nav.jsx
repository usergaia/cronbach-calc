import { SlCalculator } from "react-icons/sl";
import { FaGithub } from "react-icons/fa";



export const NavBar = () => {
  return (
  <nav className="bg-neutral-300 fixed left-0 top-0 w-full navbar rounded-none shadow-base-300/20 shadow-sm m-0 px-8 py-4 z-50 border-b-2 border-zinc-400">
      <div className="w-full flex items-center">
        <div className="flex flex-row items-center gap-3">
          <a href="#" aria-label="Homepage Link" className="flex items-center">
            <SlCalculator className="text-2xl text-black" />
            <span className="text-2xl font-bold text-black ml-3 whitespace-nowrap">Cronbach's Alpha Calculator</span>
          </a>
        </div>
        <div className="ml-auto">
          <a href="https://github.com/usergaia/cronbach-calc" target="_blank" rel="noopener noreferrer" className="flex items-center">
            <FaGithub className="h-5 w-5 text-black" />
          </a>
        </div>
      </div>
    </nav>
  );
}
