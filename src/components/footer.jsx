import { FaGithub } from "react-icons/fa";

export const Footer = () => {
    return (
        <footer className="text-white w-full mt-16">
            <div className="container mx-auto text-center text-black">
                <div className="flex items-center justify-center space-x-2">
                    <i>&copy; {new Date().getFullYear()} </i>
                    <i>
                    <a href="https://github.com/usergaia" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1">
                        <span>@usergaia</span>
                        <FaGithub className="h-5 w-5" /> 
                    </a>
                    </i>
                </div>
            </div>
        </footer>
    );
}