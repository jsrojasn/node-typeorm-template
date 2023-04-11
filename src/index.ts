import app from "./app";
import { AppDataSource } from "./db";

const PORT = process.env.PORT || 3000

async function main() {
    try {
        await AppDataSource.initialize();
        app.listen(PORT);
        console.log("Server on port", PORT);
    } catch (error) {
        console.error(error);
    }
}

main();