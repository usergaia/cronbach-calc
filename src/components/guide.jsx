import { IoIosInformationCircleOutline } from "react-icons/io";
import { FaThumbsUp } from "react-icons/fa";
import { FaThumbsDown } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { BiSolidErrorAlt } from "react-icons/bi";

export const Guide = () => {
  return (
    <div className="mr-10 w-1/3 self-auto rounded-lg bg-neutral-300 p-4 text-black shadow-xl/30">
      <div className="mb-4 flex items-center gap-2">
        <IoIosInformationCircleOutline className="text-2xl text-[#0183ce]" />
        <h1 className="text-left text-xl font-semibold text-[#0183ce]">
          How Does It Work?
        </h1>
      </div>
      <div className="mt-2 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-lg bg-[#0183ce] px-3 py-1 text-base font-bold text-white">
            1
          </div>
          <h3 className="text-left font-bold">Add Your Data</h3>
        </div>
        <ul className="ml-4 list-disc pl-5 text-left text-xs">
          <li>Manually enter data into the table.</li>
          <li>
            Upload a
            <span className="mx-0.5 inline-block rounded bg-gray-400 px-1.5 py-0.5 align-middle font-mono text-xs text-white">
              .csv
            </span>
            <span className="mx-0.5 inline-block rounded bg-gray-400 px-1.5 py-0.5 align-middle font-mono text-xs text-white">
              .xlsx
            </span>
            <span className="mx-0.5 inline-block rounded bg-gray-400 px-1.5 py-0.5 align-middle font-mono text-xs text-white">
              .xls
            </span>
            file.
          </li>
        </ul>

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-lg bg-[#0183ce] px-3 py-1 text-base font-bold text-white">
            2
          </div>
          <h3 className="text-left font-bold">Review & Confirm</h3>
        </div>
        <ul className="ml-4 list-disc pl-5 text-left text-xs">
          <li>
            Review the table for errors and make sure your data is correct.
          </li>
        </ul>

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-lg bg-[#0183ce] px-3 py-1 text-base font-bold text-white">
            3
          </div>
          <h3 className="text-left font-bold">Calculate</h3>
        </div>
        <ul className="ml-4 list-disc pl-5 text-left text-xs">
          <li>
            Click
            <span className="group relative mx-1 inline-flex h-6 cursor-default items-center justify-center overflow-hidden rounded bg-neutral-900 px-3 align-middle font-mono text-xs text-white select-none">
              <span className="absolute h-0 w-0 rounded-full bg-blue-500 transition-all duration-300 group-hover:h-10 group-hover:w-24"></span>
              <span className="relative">Calculate</span>
            </span>
            to process your data.
          </li>
        </ul>

        <div className="flex-grow border-t-2 border-gray-500 opacity-20 shadow-xl"></div>

        <div className="mt-4 space-y-4 text-left">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <FaThumbsUp className="text-2xl text-green-500" />
              <h2 className="font-mono text-lg text-green-700">Yay!</h2>
            </div>
            <ul className="list-disc pl-8 text-xs text-green-900">
              <li className="m-2 flex items-center gap-2">
                <FaCheck /> File must contain only a table of RAW numeric data
                of a subscale.
              </li>
              <li className="m-2 flex items-center gap-2">
                <FaCheck /> Each row in file upload must have a consistent
                number of columns.
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <FaThumbsDown className="text-2xl text-red-500" />
              <h2 className="font-mono text-lg text-red-700">Nay!</h2>
            </div>
            <ul className="list-disc pl-8 text-xs text-red-900">
              <li className="m-2 flex items-center gap-2">
                <BiSolidErrorAlt /> Go less than <b>2x2</b> table dimension.
              </li>
              <li className="m-2 flex items-center gap-2">
                <BiSolidErrorAlt /> Empty or Non-Numeric cells.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
