var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true, // må være unik i databasen
        required: true, // kreves
        trim: true // fjerner whitespace før eller etter
    },
    name: {
        type: String,
        required: true, // kreves
        trim: true // fjerner whitespace før eller etter
    },
    favoriteBook: {
        type: String,
        required: true, // kreves
        trim: true // fjerner whitespace før eller etter
    }, 
    password: {
        type: String,
        required: true, // kreves
    }
});

// authenticate input mot databasedokumentet
UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({email: email})
        .exec(function (error, user) { // kjør søk
            if (error) {
                return callback(error);
            } else if ( !user ) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password, function(error, result) { // plaintext mot hash
                if (result === true) { // jepp, passord er samme
                    return callback(null, user); // null er ingen errors
                } else { // niks, ikke match
                    return callback();
                }
            });
        });
}

// hashe passord før lagres i database
UserSchema.pre('save', function (next) {
    var user = this; 
    bcrypt.hash(user.password, 10, function (err, hash) { // kjør 10 ganger
        if (err) {
            return next(err);
        }
        user.password = hash; // bytte plaintext med hash
        next();
    });
});

var User = mongoose.model('User', UserSchema);
module.exports = User;