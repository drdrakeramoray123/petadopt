function createUserSession(req, user, action) {
    req.session.uid = user._id.toString();
    req.session.isAdmin = user.isAdmin;
    req.session.save(action);
}

function destroyUserAuthSession(req) {
    req.session.uid = null;
    req.session.isAdmin = null;
    req.session.isAuth = null;
}

module.exports = {
    createUserSession,
    destroyUserAuthSession,
};
