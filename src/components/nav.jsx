import { SlCalculator } from "react-icons/sl";
import { FaGithub } from "react-icons/fa";

export const NavBar = () => {
  return (
    <nav className="navbar shadow-base-300/20 fixed top-0 left-0 z-50 m-0 w-full rounded-none border-b-2 border-zinc-400 bg-neutral-300 px-8 py-4 shadow-sm">
      <div className="flex w-full items-center">
        <div className="flex flex-row items-center gap-3">
          <a href="#" aria-label="Homepage Link" className="flex items-center">
            <SlCalculator className="text-2xl text-black" />
            <span className="ml-3 text-2xl font-bold whitespace-nowrap text-black">
              CronbachCalculator
            </span>
          </a>
        </div>
        <div className="ml-auto">
          <a
            href="https://github.com/usergaia/cronbach-calc"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <FaGithub className="h-5 w-5 text-black" />
          </a>
        </div>
      </div>
    </nav>
  );
};
