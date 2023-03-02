import { Router } from "express";
import { validateAuth } from "@/routes/auth";
import { asyncHandler, validateRequestAsync } from "@/routes/middlewares";

import { createOne, deleteOne, getAll, updateOne } from "./handlers";
import { NewTodoBody, TodoParams, TodoQuery } from "./models";

const router = Router();

router.get(
    '/',
    validateAuth,
    validateRequestAsync({ query: TodoQuery }),
    asyncHandler(getAll),
);

router.post(
    '/',
    validateAuth,
    validateRequestAsync({ body: NewTodoBody }),
    asyncHandler(createOne),
);

router.delete(
    '/:id',
    validateAuth,
    validateRequestAsync({ params: TodoParams }),
    asyncHandler(deleteOne),
);

router.put(
    '/:id',
    validateAuth,
    validateRequestAsync({ params: TodoParams, body: NewTodoBody }),
    asyncHandler(updateOne),
);

export { router };
export default router;
