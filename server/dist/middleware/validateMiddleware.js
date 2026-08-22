export const validateBody = (validator) => {
    return (req, res, next) => {
        const error = validator(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error });
        }
        next();
    };
};
export const validateParams = (validator) => {
    return (req, res, next) => {
        const error = validator(req.params);
        if (error) {
            return res.status(400).json({ success: false, message: error });
        }
        next();
    };
};
