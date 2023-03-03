import { Router } from "express";
import { asyncHandler, validateRequestAsync } from "@/routes/middlewares";
import { User } from "./models";
import { signup, signin, changePassword } from './handlers';
import { validateAuth } from "@/routes/auth";

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

router.put(
    '/changePassword',
    validateAuth,
    validateRequestAsync({ body: User }),
    asyncHandler(changePassword),
)

export { router };
export default router;
