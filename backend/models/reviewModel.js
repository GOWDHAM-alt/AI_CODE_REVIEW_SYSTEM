// ✅ Fixed reviewModel.js — replace entire file with this:
const db = require('../config/testDB');

const saveReview = async (userId, language, code, review) => {
    const [result] = await db.execute(
        "INSERT INTO reviews (user_id, language, code, review) VALUES (?,?,?,?)",
        [userId, language, code, review]
    );
    return result;
};

const getReviewByUser = async (userId) => {
    const [rows] = await db.execute(
        "SELECT * FROM reviews WHERE user_id = ? ORDER BY created_at DESC",
        [userId]   // ✅ must be array
    );
    return rows;
};

const getReviewById = async (userId, reviewId) => {
    const [rows] = await db.execute(
        "SELECT * FROM reviews WHERE user_id = ? AND id = ?",
        [userId, reviewId]
    );
    return rows[0];
};

const deleteReview = async (reviewId, userId) => {
    const [result] = await db.execute(
        "DELETE FROM reviews WHERE id = ? AND user_id = ?",  // ✅ id not reviewId
        [reviewId, userId]
    );
    return result;
};

module.exports = { saveReview, getReviewByUser, getReviewById, deleteReview };