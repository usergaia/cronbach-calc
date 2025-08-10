import * as XLSX from 'xlsx';
import { calculateCronbachAlpha } from './calcu.js';

export const getAlpha = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('File reading failed'));

    if (file.name.endsWith('.csv')) {
      reader.onload = (evt) => {
        const data = evt.target.result;
        const rows = data
          .trim()
          .split('\n')
          .slice(1) // skip header row for now
          .map(row => row.split(',').map(Number));
        const result = calculateCronbachAlpha(rows);
        resolve(result);
        console.log('Cronbach Alpha in file-handling.js (csv): ', result);
      };
      reader.readAsText(file);

    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      reader.onload = (evt) => {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: 'array' });   
        const sheetName = workbook.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
        const numericRows = rows
          .slice(1) // skip header row
          .filter(row => row.length > 1 && row.every(val => !isNaN(Number(val))))
          .map(row => row.map(val => Number(val)));
        const result = calculateCronbachAlpha(numericRows);
        resolve(result);
      };
      reader.readAsArrayBuffer(file);

    } else {
      reject(new Error('Unsupported file type'));
    }
  });
};
