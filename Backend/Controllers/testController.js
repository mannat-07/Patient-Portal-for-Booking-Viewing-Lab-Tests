const Test = require('../Models/testSchema');

exports.getAllTests = async (req, res) => {
    try {
        const tests = await Test.find().sort({ name: 1 }); // Sort by name alphabetically

        res.json({
            success: true,
            message: 'Tests retrieved successfully',
            tests
        });
    } catch (error) {
        console.error('Get tests error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve tests',
            error: error.message || 'Server error while fetching tests'
        });
    }
};

exports.getTestById = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);

        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Test not found',
                error: 'The requested test does not exist'
            });
        }

        res.json({
            success: true,
            message: 'Test retrieved successfully',
            test
        });
    } catch (error) {
        console.error('Get test error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve test',
            error: error.message || 'Server error while fetching test'
        });
    }
};