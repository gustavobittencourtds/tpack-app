// src/types/csv-parser.d.ts
declare module 'csv-parser' {
  import { Transform } from 'stream';

  interface CsvParserOptions {
    separator?: string;
    newline?: string;
    quote?: string;
    escape?: string;
    headers?: string[] | boolean;
    skipLines?: number;
    maxRowBytes?: number;
    strict?: boolean;
  }

  function csvParser(options?: CsvParserOptions): Transform;

  export = csvParser;
}
