import { promises as fs } from 'fs';
import path from 'path'
import Papa from "papaparse";
import PlayerSelector from './PlayerSelector';

export default async function Page() {
    async function loadJsonFile(filePath: string) {
        const fileContent = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContent)
    }

    async function loadCsvFile(filePath: string) {
        const _fileContent = await fs.readFile(filePath, "utf8");
        const fileContent = _fileContent.replace(/^\uFEFF/, "");

        return Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
        }).data;
    }

    const idMap = await loadCsvFile(path.join(process.cwd(), "public", "processed", "PUBLIC__club_id_map.csv"))
    const playersBio = await loadJsonFile(path.join(process.cwd(), "public", "processed", "PUBLIC__bio.json"))
    const game_database = await loadCsvFile(path.join(process.cwd(), "public", "processed", "PUBLIC__match_history.csv"))

    return <PlayerSelector idMap = {idMap} playersBio = {playersBio} game_database = {game_database}/>;
}