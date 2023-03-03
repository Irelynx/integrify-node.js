import { Router } from 'express';

import { APIPrefix as APIPrefix_root } from '../../';

const mountSuffix = '/v1';
const APIPrefix = APIPrefix_root + mountSuffix;

import todos from './todos';
import users from './users';

const router = Router();

router.use('/', users);
router.use('/todos', todos);

export {
  router,
  APIPrefix,
  mountSuffix,
};
export default router;
