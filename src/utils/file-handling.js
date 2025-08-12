import * as XLSX from 'xlsx';
import { calculateCronbachAlpha } from './calcu.js';

export const getAlpha = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('File reading failed'));

    if (file.name.endsWith('.csv')) {
      reader.onload = (evt) => {
        const data = evt.target.result;
        const matrix = data
            .trim()
            .split('\n')
            .map(row => row.split(',').map(Number)); 


        const expectedCol = matrix[0] ? matrix[0].length : 0;

        if (!checkValidity(matrix, expectedCol)) {
            reject(new Error('Invalid data format'));
            return false;
        }

        const result = calculateCronbachAlpha(matrix);
        resolve({ alp: result, mat: matrix });
        console.log('Cronbach Alpha in file-handling.js (csv): ', result);

      };
      reader.readAsText(file);

    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      reader.onload = (evt) => {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: 'array' });   
        const sheetName = workbook.SheetNames[0];
        const matrix = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

        const expectedCol = matrix[0] ? matrix[0].length : 0;

        if (!checkValidity(matrix, expectedCol)) {
          reject(new Error('Invalid data format'));
          return;
        }

        const result = calculateCronbachAlpha(matrix);
        resolve({ alp: result, mat: matrix });
      };
      reader.readAsArrayBuffer(file);

    } else {
      reject(new Error('Unsupported file type'));
    }
  });
};

export const checkValidity = (matrix, expectedCol) => {

  // Check for inconsistent row lengths
  if (matrix.some((row, rowIndex) => {
    if (row.length !== expectedCol) {
      console.log(`Row ${rowIndex} does not match expected column count ${expectedCol}`);
      return true;
    }
    return false;
  })) {
    return false;
  }

  return true;
}