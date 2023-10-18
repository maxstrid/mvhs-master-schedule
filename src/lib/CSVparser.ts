import * as fs from "fs";
import * as path from "path";
import { parse } from 'csv-parse';

let freshmanClasses: string[] = [];
let sophmoreClasses: string[] = [];
let juniorClasses: string[] = [];
let seniorClasses: string[] = [];

fs.createReadStream("../../classList.csv")
    .pipe(parse({delimiter: ",", from_line:}))