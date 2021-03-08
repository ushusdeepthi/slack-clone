module.exports={
     ensureAuthenticated: (req, resp, next) => {
        if (req.isAuthenticated()) {
            return next()
        } else {
            req.flash('error_msg', 'Please login to view this resource')
            resp.redirect('/users/login')
        }
    }
}