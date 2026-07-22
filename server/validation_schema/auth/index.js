const { z } = require('zod');

const loginSchema = z.object({
    email: z.string({
        required_error: "email is required field"
    }).email("invalid email"),

    password: z.string({
        required_error: "password is required field"
    }).min(6, "password must be at least 6 characters")
});

module.exports = { loginSchema };
