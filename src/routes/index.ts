import { Router } from 'express';

export const APIPrefix = '/api';

import api from './api';

const router = Router();

router.use(APIPrefix, api);

router.get('/test', (req, res) => {
    res.status(200).json({
        hello: "world",
    });
});

export { router };
export default router;
