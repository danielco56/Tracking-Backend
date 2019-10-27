module.exports = authorizeAdmin;

function authorizeAdmin(req, res, next) {
  if (req.body.role !== "Admin") {
    return res.status(401).json({ message: "Unauthorized user" });
  }
  next();
}
