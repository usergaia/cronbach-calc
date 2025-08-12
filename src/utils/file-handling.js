import * as XLSX from "xlsx";
import { calculateCronbachAlpha } from "./calcu.js";

export const getAlpha = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("File reading failed"));

    if (file.name.endsWith(".csv")) {
      reader.onload = (evt) => {
        const data = evt.target.result;
        const matrix = data
          .trim()
          .split("\n")
          .map((row) => row.split(",").map(Number));

        const expectedCol = matrix[0] ? matrix[0].length : 0;
        // Reject if less than 2x2
        if (matrix.length < 2 || expectedCol < 2) {
          reject(new Error("File must have at least 2 rows and 2 columns"));
          return false;
        }
        if (!checkValidity(matrix, expectedCol)) {
          reject(new Error("Invalid data format"));
          return false;
        }

        const result = calculateCronbachAlpha(matrix);
        resolve({ alp: result, mat: matrix });
        console.log("Cronbach Alpha in file-handling.js (csv): ", result);

        // Reset file input value to allow uploading the same file consecutively
        if (window._fileInputRef) window._fileInputRef.value = "";
      };
      reader.readAsText(file);
    } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      reader.onload = (evt) => {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const matrix = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          header: 1,
        });

        const expectedCol = matrix[0] ? matrix[0].length : 0;
        // Reject if less than 2x2
        if (matrix.length < 2 || expectedCol < 2) {
          reject(new Error("File must have at least 2 rows and 2 columns"));
          return;
        }
        if (!checkValidity(matrix, expectedCol)) {
          reject(new Error("Invalid data format"));
          return;
        }

        const result = calculateCronbachAlpha(matrix);
        resolve({ alp: result, mat: matrix });

        // Reset file input value to allow uploading the same file consecutively
        if (window._fileInputRef) window._fileInputRef.value = "";
      };
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error("Unsupported file type"));
    }
  });
};

export const checkValidity = (matrix, expectedCol) => {
  // Check for minimum 2x2
  if (!Array.isArray(matrix) || matrix.length < 2 || expectedCol < 2) {
    return false;
  }
  // Check for inconsistent row lengths
  if (
    matrix.some((row, rowIndex) => {
      if (row.length !== expectedCol) {
        console.log(
          `Row ${rowIndex} does not match expected column count ${expectedCol}`,
        );
        return true;
      }
      return false;
    })
  ) {
    return false;
  }
  return true;
};
