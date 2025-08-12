import { IoIosInformationCircleOutline } from "react-icons/io";
import { FaThumbsUp } from "react-icons/fa";
import { FaThumbsDown } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { BiSolidErrorAlt } from "react-icons/bi";

export const Guide = () => {
    return (
        <div className="w-1/3 bg-neutral-300 p-4 mr-10 text-black rounded-lg self-auto shadow-xl/30">
            <div className="flex items-center gap-2 mb-4">
                <IoIosInformationCircleOutline className="text-2xl text-[#0183ce]" />
                <h1 className="text-xl font-semibold text-left text-[#0183ce]">How Does It Work?</h1>
            </div>
            <div className="space-y-3 mt-2">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-[#0183ce] text-white font-bold py-1 px-3 text-base flex items-center justify-center">1</div>
                    <h3 className="text-left font-bold">Add Your Data</h3>
                </div>
                <ul className="list-disc pl-5 text-left ml-4 text-xs">
                    <li>Manually enter data into the table.</li>
                    <li>
                        Upload a
                        <span className="inline-block bg-gray-400 text-white font-mono text-xs px-1.5 py-0.5 rounded mx-0.5 align-middle">.csv</span>
                        <span className="inline-block bg-gray-400 text-white font-mono text-xs px-1.5 py-0.5 rounded mx-0.5 align-middle">.xlsx</span>
                        <span className="inline-block bg-gray-400 text-white font-mono text-xs px-1.5 py-0.5 rounded mx-0.5 align-middle">.xls</span>
                        file.
                    </li>
                </ul>

                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-[#0183ce] text-white font-bold py-1 px-3 text-base flex items-center justify-center">2</div>
                    <h3 className="text-left font-bold">Review & Confirm</h3>
                </div>
                <ul className="list-disc pl-5 text-left ml-4 text-xs">
                    <li>Review the table for errors and make sure your data is correct.</li>
                </ul>

                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-[#0183ce] text-white font-bold py-1 px-3 text-base flex items-center justify-center">3</div>
                    <h3 className="text-left font-bold">Calculate</h3>
                </div>
                <ul className="list-disc pl-5 text-left ml-4 text-xs">
                    <li>
                        Click
                        <span className="group relative inline-flex h-6 items-center justify-center overflow-hidden rounded bg-neutral-900 px-3 font-mono text-xs text-white mx-1 align-middle select-none cursor-default">
                            <span className="absolute h-0 w-0 rounded-full bg-blue-500 transition-all duration-300 group-hover:h-10 group-hover:w-24"></span>
                            <span className="relative">Calculate</span>
                        </span>
                        to process your data.
                    </li>
                </ul>

                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-[#0183ce] text-white font-bold py-1 px-3 text-base flex items-center justify-center">4</div>
                    <span className="text-left italic">Download (Optional)</span>
                </div>
                <ul className="list-disc pl-5 text-left ml-4 text-xs">
                    <li> Download the results.</li>
                </ul>

                <div className="flex-grow border-t-2 border-gray-500 shadow-xl opacity-20"></div>

                <div className="text-left space-y-4 mt-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <FaThumbsUp className="text-green-500 text-2xl" />
                            <h2 className="text-lg font-bold text-green-700">Yay!</h2>
                        </div>
                        <ul className="list-disc pl-8 text-xs text-green-900">
                            <li>Table must have at least 2 rows and 2 columns.</li>
                            <li>All cells must be filled with numbers (no blanks or text).</li>
                            <li>Each row in file upload must have the same number of columns.   </li>
                        </ul>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <FaThumbsDown className="text-red-500 text-2xl" />
                            <h2 className="text-lg font-bold text-red-700">Nay!</h2>
                        </div>
                        <ul className="list-disc pl-8 text-xs text-red-900">
                            <li>Not double-checking your data before calculating.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
