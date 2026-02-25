const tripsEndpoint = 'http://localhost:3000/api/trips';
const optionsBase = {
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
}

/*
var fs = require('fs');
var trips = JSON.parse(fs.readFileSync('./data/trips.json',
'utf8'));
*/

/* GET travel view */
const travel = async function (req, res, next) {
  try {
    // Build API URL, optionally filtering by category from query
    const url = new URL(tripsEndpoint);
    if (req.query && req.query.category) {
      url.searchParams.append('category', req.query.category);
    }

    const opts = Object.assign({}, optionsBase);
    const apiRes = await fetch(url.toString(), opts);
    const json = await apiRes.json();

    let message = null;
    let trips = json;
    if (!(trips instanceof Array)) {
      message = 'API lookup error';
      trips = [];
    } else if (trips.length === 0) {
      message = 'No trips found';
    }

    res.render('travel', { title: 'Travlr Getaways', trips, message, selectedCategory: req.query.category || '' });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  travel,
};