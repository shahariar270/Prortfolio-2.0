const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../model/auth');
const { loginSchema } = require('../../validation_schema/auth');
const ApiResponse = require('../../utils/api_response');
const jwt_token = process.env.JWT_TOKEN;
if (!jwt_token) {
    throw new Error('FATAL: JWT_TOKEN environment variable is not set');
}

// No public register endpoint: this is a single-admin panel, the account is
// created with `npm run seed:admin` instead.

module.exports = {
    login_controller: async (req, res) => {
        try {
            const validate = loginSchema.safeParse(req.body);
            if (!validate.success) {
                return ApiResponse.error(res, validate.error.issues[0].message, 400);
            }

            const { email, password } = req.body;

            const user = await User.findOne({
                email: email.toLowerCase()
            }).select("+password");

            if (!user) {
                return ApiResponse.error(res, "Your Request Email User not Found", 404);
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return ApiResponse.error(res, "Password Wrong", 401);
            }

            if (user.is_active === false) {
                return ApiResponse.error(res, "This account has been disabled. Contact support for help.", 403);
            }

            const token = jwt.sign(
                { id: user._id, user_name: user.user_name, user_role: user.user_role },
                jwt_token,
                { expiresIn: "1h" }
            );

            return ApiResponse.success(res, "Login successfully", { token });

        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    },
    profile_controller: async (req, res) => {
        try {
            const userId = req.user.id;
            const userData = await User.findById(userId);

            return ApiResponse.success(res, 'User Get Successfully', userData);

        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        }
    }
}
