const index = (req, res) => {
  res.render('index', { title: 'Travlr Getaways' });
}

const reservations = (req, res) => {
  if (!res.locals.user) {
    return res.redirect('http://localhost:4200/login');
  }
  res.render('reservations', { title: 'Reservations - Travlr Getaways' });
}

const checkout = (req, res) => {
  res.render('checkout', { title: 'Checkout - Travlr Getaways' });
}

const logout = (req, res) => {
  res.clearCookie('travlr-token', { path: '/' });
  res.redirect('/');
}

module.exports = { index, reservations, checkout, logout };