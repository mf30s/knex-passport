// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');


const environment = process.env.NODE_ENV || 'staging';
const configuration = require('../config/knexfile')[environment];
const database = require('knex')(configuration);


module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        database('users').where('id', id)
            .then((user) =>{
                done(null, user[0]);
            })
            .catch((err) =>{
                done(err,null);
            });
    });
    
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            connection.query("SELECT * FROM users WHERE email = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };

                    var insertQuery = "INSERT INTO users ( email, password ) values (?,?)";

                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.password],function(err, rows) {
                        newUserMysql.id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            
            //admin id

            //auth admin role check
            database('users')
            .join('user_roles','user_roles.user_id','users.id')
            .where('users.email',username)
            .andWhere('user_roles.role_id',1)
                .then((users) =>{
                    if(users.length < 1){
                        return done(null, false, req.flash('loginMessage', 'You have no admin role.'));
                    }else{
                        log_me_in();    
                    }
                    
                })
                .catch((users) =>{
                    return done(null, false, req.flash('loginMessage', 'You have no admin role.'));
                });

            function log_me_in(){
                database('users').where('email', username)
                .then((user) =>{
                    if(!user.length){
                        return done(null, false, req.flash('loginMessage', 'No user found.'));
                    }
                    if(!bcrypt.compareSync(password, user[0].encrypted_password)) {
                      return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    }else{
                      return done(null, user[0]);
                    }
                })
                .catch((err) =>{
                    return done(err);
                });
            }
        })
    );
};
