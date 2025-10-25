import fs from 'fs';
import { Workbook } from 'exceljs';

/**
 * Utility class for file operations
 * Handles reading from various file formats including Excel, text files, etc.
 */
export class FileUtils {
    /**
     * Read data from an Excel file
     * @param filepath - Path to the Excel file directory
     * @param fileName - Name of the Excel file
     * @param sheetName - Name of the worksheet
     * @param rowNum - Row number (1-based)
     * @param cellNum - Cell/Column number (1-based)
     * @returns The cell value as a string
     */
    static async readDataFromExcel(
        filepath: string,
        fileName: string,
        sheetName: string,
        rowNum: number,
        cellNum: number
    ): Promise<string> {
        try {
            const workbook = new Workbook();
            const fullPath = filepath.endsWith('/') ? filepath + fileName : `${filepath}/${fileName}`;
            await workbook.xlsx.readFile(fullPath);

            const sheet = workbook.getWorksheet(sheetName);

            if (!sheet) {
                throw new Error(`Sheet "${sheetName}" not found in ${fileName}`);
            }

            const cell = sheet.getRow(rowNum).getCell(cellNum);
            return cell.toString();
        } catch (error) {
            throw new Error(`Failed to read Excel file: ${error}`);
        }
    }

    /**
     * Read contents from a text file
     * @param filePath - Full path to the text file
     * @returns File contents as a string
     */
    static readTextFile(filePath: string): string {
        try {
            return fs.readFileSync(filePath, 'utf8');
        } catch (error) {
            throw new Error(`Failed to read text file at ${filePath}: ${error}`);
        }
    }

    /**
     * Read and parse JSON file
     * @param filePath - Full path to the JSON file
     * @returns Parsed JSON object
     */
    static readJsonFile<T>(filePath: string): T {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(content) as T;
        } catch (error) {
            throw new Error(`Failed to read JSON file at ${filePath}: ${error}`);
        }
    }

    /**
     * Check if file exists
     * @param filePath - Full path to the file
     * @returns true if file exists, false otherwise
     */
    static fileExists(filePath: string): boolean {
        return fs.existsSync(filePath);
    }

    /**
     * Write content to a file
     * @param filePath - Full path to the file
     * @param content - Content to write
     */
    static writeFile(filePath: string, content: string): void {
        try {
            fs.writeFileSync(filePath, content, 'utf8');
        } catch (error) {
            throw new Error(`Failed to write to file at ${filePath}: ${error}`);
        }
    }
}

