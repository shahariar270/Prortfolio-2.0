const jwt = require('jsonwebtoken');
const ApiResponse = require('../../utils/api_response');
const User = require('../../model/auth');


class auth_middleware {
    constructor() {
        this.secret = process.env.JWT_TOKEN;
        if (!this.secret) {
            throw new Error('FATAL: JWT_TOKEN environment variable is not set');
        }

        this.verify_token = this.verify_token.bind(this);
        this.verify_role = this.verify_role.bind(this);
    };

    verify_token = (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return ApiResponse.error(res, "Token missing", 401);
        }
        const token = authHeader.split(" ")[1];

        jwt.verify(token, this.secret, async (err, decoded) => {
            if (err) {
                return ApiResponse.error(res, "Invalid token", 403);
            }

            // A still-valid token doesn't mean the account is still allowed
            // in — it may have been disabled after this token was issued, so
            // re-check current status on every request.
            const account = await User.findById(decoded.id).select('is_active');
            if (!account || account.is_active === false) {
                return ApiResponse.error(res, "This account has been disabled", 401);
            }

            req.user = decoded;
            next();
        });
    }

    verify_role = (...allowedRoles) => {
        return (req, res, next) => {
            const userRole = req?.user?.user_role;
            if (!allowedRoles.includes(userRole)) {
                return ApiResponse.error(res, "Access denied", 403);
            }
            next();
        };
    }

}

module.exports = new auth_middleware;
