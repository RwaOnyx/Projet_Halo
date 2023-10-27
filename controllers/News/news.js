export default (req, res) => {
    req.session.page = "news";
    res.render('news.ejs');
};