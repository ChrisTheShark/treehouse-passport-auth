'use strict';
const express = require('express'),
    router = express.Router(),
    passport = require('passport');

// GET auth/login/github
router.get('/login/github', passport.authenticate('github'));

// GET auth/github/callback
router.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/'
}), (req, res) => {
    // Successful authenication, Redirect to profile page.
    res.redirect('/');
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
