// custom middleware yo

// redirecte innlogga folk fra bestemte routes
// sette inn i routen du vil få folk vekk fra
function requiresLoggedOut (req, res, next) {
    if (req.session && req.session.userId) {
        return res.redirect('/profile');
    }
    return next();
}

function requiresLogin (req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error('You must be logged in to view this, dog.');
        err.status = 401;
        return next(err);
    }
}

module.exports.requiresLoggedOut = requiresLoggedOut;
module.exports.requiresLogin = requiresLogin;