import * as XLSX from "xlsx";
import { calculateCronbachAlpha } from "./calcu.js";

export const getAlpha = (file) => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }
    if (file.size > MAX_SIZE) {
      reject(new Error("File size exceeds 5MB limit"));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("File reading failed"));

    if (file.name.endsWith(".csv")) {
      reader.onload = (evt) => {
        const data = evt.target.result;

        // ignore empty lines, trim, handle extra whitespace
        const matrix = data
          .split(/\r?\n/)
          .map((row) => row.trim())
          .filter((row) => row.length > 0)
          .map((row) =>
            row.split(",").map((cell) => {
              const val = cell.trim();

              // try to parse as number, fallback to original if NaN
              const num = Number(val);
              return isNaN(num) ? val : num;
            }),
          );

        const expectedCol = matrix[0] ? matrix[0].length : 0;
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
    matrix.some((row) => {
      if (row.length !== expectedCol) {
        return true;
      }
      return false;
    })
  ) {
    return false;
  }
  return true;
};
