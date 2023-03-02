import z from 'zod';

export const User = z.object({
    id: z.never().optional(),
    email: z.string().email(),
    password: z.string().length(64).min(64),
    createdAt: z.never().optional(),
    updatedAt: z.never().optional(),
});
export type User = z.infer<typeof User>;

export interface SignUpResponse {
    ok: boolean
}

export interface SignInResponse {
    token: string
}