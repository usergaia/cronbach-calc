// import { SlCalculator } from "react-icons/sl";
import { FaGithub } from 'react-icons/fa';
import { GrSend } from 'react-icons/gr';
import logo from '../assets/icon.png';

export const NavBar = () => {
  return (
    <nav className="navbar shadow-base-300/20 fixed top-0 left-0 z-50 m-0 w-full rounded-none border-b-2 border-zinc-400 bg-neutral-300 px-3 py-3 shadow-sm md:px-8 md:py-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-row items-center gap-2 md:gap-3">
          <img
            src={logo}
            alt="logo"
            className="h-6 w-6 opacity-75 md:h-8 md:w-8"
          />
          <span className="ml-1 text-lg font-bold whitespace-nowrap text-black text-shadow-lg/30 md:text-2xl">
            <span className="text-yellow-500">C</span>ronbach
            <span className="text-[#ffda03]">C</span>alculator
          </span>
        </div>
        <div className="flex items-center gap-2 md:gap-6">
          <a
            href="https://github.com/usergaia/cronbach-calc"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-black transition-colors hover:text-blue-700 md:gap-2"
          >
            <FaGithub className="h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden font-medium sm:inline">GitHub</span>
          </a>
          <span className="hidden text-xl font-extralight text-gray-400 sm:inline">
            |
          </span>
          <a
            href="https://tally.so/r/m6BXP5"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-black transition-colors hover:text-blue-700 md:gap-2"
          >
            <GrSend className="h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden font-medium sm:inline">Feedback</span>
          </a>
        </div>
      </div>
    </nav>
  );
};
