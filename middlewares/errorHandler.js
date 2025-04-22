function errorHandler(error, req, res, next) {
    if (error.code) {
        switch (error.code) {
            case 400:
                return res.status(400).json({ message: error.message });
            default:
                return res.status(500).json({ message: "Internal server error" });
        }
    } else if (error.name == "MidtransError") {
        return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
}

module.exports = errorHandler;
