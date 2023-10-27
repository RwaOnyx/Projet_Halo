export default (req, res) => {
    req.session.page = "jeux";
    res.render('jeux.ejs');
};