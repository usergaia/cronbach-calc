import * as XLSX from 'xlsx';
import { calculateCronbachAlpha } from './calcu.js';


export const getAlpha = (file) => {

    const reader = new FileReader();

    //untested
    if (file.name.endsWith('.csv')) {
      reader.onload = (evt) => {
        const data = evt.target.result;
        const rows = data.split('\n').map(row => row.split(',').map(Number));
        const result = calculateCronbachAlpha(rows);
        return result;
      };
      reader.readAsText(file);

    // draft
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      reader.onload = (evt) => {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });   
        const sheetName = workbook.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
        // Remove header and filter out empty rows
        const numericRows = rows
          .slice(1) // skip header row
          .filter(row => row.length > 1 && row.every(val => !isNaN(Number(val))))
          .map(row => row.map(val => Number(val)));
        const result = calculateCronbachAlpha(numericRows);
        return result;
      };
      reader.readAsArrayBuffer(file);
    } 
    
    else {
      return 'Unsupported file type';
    }
};