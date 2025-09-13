import { FaGithub } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="mt-16 w-full text-white">
      <div className="container mx-auto text-center text-black">
        <div className="mono flex items-center justify-center space-x-2 text-gray-500">
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
                <FaGithub className="h-5 w-5" />
              </div>
            </a>
          </i>
        </div>
      </div>
    </footer>
  );
};
