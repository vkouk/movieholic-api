const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    const userId = mongoose.Types.ObjectId(id);
    User.findById(userId).then(user => {
        done(null, user);
    });
});

passport.use('local-login',
    new LocalStrategy( { usernameField: 'email', },
        (email, password, done) => {
            User.findOne({ email }, (err, user) => {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }

                user.comparePassword(password, (err, isMatch) => {
                    if (err) { return done(err); }
                    if (!isMatch) { return done(null, false); }

                    return done(null, user);
                });
            });
        }
    )
);

passport.use('local-register',
    new LocalStrategy( { usernameField: 'email', },
        async (email, password, done) => {
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return done(null, existingUser);
            }

            const user = await new User({ email, password }).save();
            done(null, user);
        }
    )
);
