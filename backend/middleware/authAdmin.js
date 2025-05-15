const authAdmin = (req, res, next) => {
    try {
        console.log(req.user.role)
        if (req.user && req.user.role === 'admin') {
            return next();
        }
        return res.status(403).json({ message: 'Access denied' });
    }
    catch (error) {
        console.error('Error in authAdmin middleware:', error);
        return res.status(500).json({ message: 'Internal server error' });
        
    }
}

export default authAdmin;
