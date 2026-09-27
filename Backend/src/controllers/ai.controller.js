const aiService = require("../services/ai.service")


module.exports.getReview = async (req, res) => {

    const code = req.body.code;

    if (!code) {
        return res.status(400).send("Prompt is required");
    }

    try {
        const response = await aiService(code);
        res.send(response);
    } catch (error) {
        let msg = error.message || "Failed to generate review.";
        try {
            const parsed = typeof msg === 'string' ? JSON.parse(msg) : msg;
            if (parsed?.error?.message) {
                msg = parsed.error.message;
            }
        } catch (e) {
            // retain msg string
        }
        console.error("AI Service Error:", msg);
        res.status(500).send(msg);
    }

}