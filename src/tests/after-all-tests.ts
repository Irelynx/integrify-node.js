import 'tsconfig-paths/register';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.test.env') });

import { destroyMock } from './mockData';

export default async function () {
  console.log('cleaning up..');
  // cleanup
  await destroyMock();
}
