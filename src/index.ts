import 'dotenv/config';
import server from './app';

async function main() {
    const HOST = process.env.LISTEN_HOST || '::';
    const PORT = Number(process.env.LISTEN_PORT) || 8080;
    server.listen(PORT, HOST, () => {
        console.log(`Listening: http://[${HOST}]:${PORT}`);
    });
}

main();
