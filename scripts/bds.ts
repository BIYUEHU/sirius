import { log } from 'node:console';
import { config } from 'dotenv';
import { resolve } from 'node:path';
import sh from 'shelljs';

config();

if (process.env.START_BDS !== 'on') process.exit();

log('Starting Bedrock Dedicated Server...');
sh.exec(resolve(__dirname, '../', process.env.BDS_PATH ?? 'server', 'bedrock_server_mod.exe'));
