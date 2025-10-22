import { FaGithub } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="mt-8 w-full pb-4 text-white md:mt-16">
      <div className="container mx-auto px-4 text-center text-black">
        <div className="mono flex items-center justify-center space-x-2 text-sm text-gray-500 md:text-base">
          <i>&copy; {new Date().getFullYear()} </i>
          <i>
            <a
              href="https://github.com/usergaia"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1"
            >
              <div className="flex items-center space-x-1 hover:text-blue-700">
                <span>@usergaia</span>
                <FaGithub className="h-4 w-4 md:h-5 md:w-5" />
              </div>
            </a>
          </i>
        </div>
      </div>
    </footer>
  );
};
