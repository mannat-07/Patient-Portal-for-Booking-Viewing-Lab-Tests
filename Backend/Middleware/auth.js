const jwt = require('jsonwebtoken');
const Patient = require('../Models/patientSchema');

const verifyToken = async (req, res, next) => {
    const token = req.cookies.token ||
        (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.patient = { id: decoded.id };

        // Check if user is an admin
        const patient = await Patient.findById(decoded.id);
        if (!patient) {
            return res.status(401).json({ message: 'Invalid patient' });
        }

        // You can determine admin status based on email or a dedicated role field
        // For this implementation, we'll check against an admin email in .env
        req.isAdmin = patient.email === process.env.ADMIN_EMAIL;

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = verifyToken;
