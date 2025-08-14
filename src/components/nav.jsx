import { SlCalculator } from "react-icons/sl";
import { FaGithub } from "react-icons/fa";
import { GrSend } from "react-icons/gr";

export const NavBar = () => {
  return (
    <nav className="navbar shadow-base-300/20 fixed top-0 left-0 z-50 m-0 w-full rounded-none border-b-2 border-zinc-400 bg-neutral-300 px-8 py-4 shadow-sm">
      <div className="flex w-full items-center">
        <div className="flex flex-row items-center gap-3">
          <SlCalculator className="text-2xl text-black" />
          <span className="ml-3 text-2xl font-bold whitespace-nowrap text-black text-shadow-lg/30">
            <span className="text-yellow-500">C</span>ronbach
            <span className="text-[#ffda03]">C</span>alculator
          </span>
        </div>
        <div className="ml-auto flex items-center gap-6">
          <a
            href="https://github.com/usergaia/cronbach-calc"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-black transition-colors hover:text-blue-700"
          >
            <FaGithub className="h-5 w-5" />
            <span className="font-medium">GitHub</span>
          </a>
          <span className="text-xl font-extralight text-gray-400">|</span>
          <a
            href="https://tally.so/r/m6BXP5"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-black transition-colors hover:text-blue-700"
          >
            <GrSend className="h-5 w-5" />
            <span className="font-medium">Feedback</span>
          </a>
        </div>
      </div>
    </nav>
  );
};
