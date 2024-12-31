let express = require('express');
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

let PORT = 3000;

let app = express();
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './db/database.sqlite',
    driver: sqlite3.Database,
  });
})();

//Q1 : Fetch all Restaurants
async function fetchAllRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);

  return { restaurants: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    let results = await fetchAllRestaurants();
    if (results.restaurants.length === 0) {
      res.status(404).json({ message: 'No Restaurants Found.' });
    }
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching restaurants' });
  }
});

//Q2 : Fetch restaurants by id
async function fetchAllRestaurantsById(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.get(query, [id]);
  return { restaurants: response };
}
app.get('/restaurants/details/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let results = await fetchAllRestaurantsById(id);
    if (results.restaurants === undefined) {
      res.status(404).json({ message: 'No Restaurants Found.' });
    }
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Q3 : Get Restaurants By Cuisines
async function fetchAllRestaurantsByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}
app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
    let cuisine = req.params.cuisine;
    let results = await fetchAllRestaurantsByCuisine(cuisine);
    if (results.restaurants.length === 0) {
      res.status(404).json({ message: 'No Restaurants Found by ' + cuisine });
    }
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching restaurants' });
  }
});

// Q4: Get Restaurants By Filters
async function getRestaurantByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg=? AND hasOutdoorSeating=? AND isLuxury=?';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}
app.get('/restaurants/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let hasOutdoorSeating = req.query.hasOutdoorSeating;
    let isLuxury = req.query.isLuxury;
    let results = await getRestaurantByFilter(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );
    if (results.restaurants.length === 0) {
      res.status(404).json({ message: 'No restaurants found' });
    }
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Q5 : Get Restaurants Sorted By rating
async function sortRestaurantsByRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);
  return { restaurants: response };
}
app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let results = await sortRestaurantsByRating();
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No Restaurants found' });
    }
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});

// Q6 : Get All Dishes.
async function fetchAllDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);

  return { dishes: response };
}
app.get('/dishes', async (req, res) => {
  try {
    let results = await fetchAllDishes();
    if (results.dishes.length === 0) {
      res.status(404).json({ message: 'No dishes Found.' });
    }
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching dishes' });
  }
});

// Q7: Get Dish by ID.
async function fetchAllDishesById(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.all(query, [id]);

  return { dishes: response };
}
app.get('/dishes/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    let results = await fetchAllDishesById(id);
    if (results.dishes.length === 0) {
      res.status(404).json({ message: 'No dish Found by ID : ' + id });
    }
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching dishes' });
  }
});

// Q8: Get dishes By Filters
async function getDishesByFilter(isVeg) {
  const query = 'SELECT * FROM dishes WHERE isVeg = ?';
  const response = await db.all(query, [isVeg]);
  return { dishes: response };
}

app.get('/dishes/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let result = await getDishesByFilter(isVeg);
    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found.' });
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Q9 : Get Dishes Sorted By Price
async function dishesSortByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price';
  let response = await db.all(query, []);
  return { dishes: response };
}
// check this here
app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let results = await dishesSortByPrice();

    if (results.dishes.length === 0) {
      return res.status(404).json({ Message: 'No dishes found' });
    }

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});

app.listen(PORT, () => console.log('Server running in port 3000'));
