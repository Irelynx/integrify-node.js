import { Router } from "express";
import { asyncHandler, validateRequestAsync } from "@/routes/middlewares";
import { User } from "./models";
import { signup, signin } from './handlers';

const router = Router();

router.post(
    '/signup',
    validateRequestAsync({ body: User }),
    asyncHandler(signup),
);

router.post(
    '/signin',
    validateRequestAsync({ body: User }),
    asyncHandler(signin),
);

export { router };
export default router;
