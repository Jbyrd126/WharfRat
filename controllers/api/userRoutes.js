const router = require('express').Router();
const  User = require('../../models/User');

router.post('/login', async (req, res) => {
  
  try {
    
    // Find the user who matches the posted e-mail address
    const userData = await User.findOne({ where: { email: req.body.email } });
     console.log(userData);
    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    // Verify the posted password with the password store in the database
    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    // Create session variables based on the logged in user
      req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/signup', async (req, res) => {
  console.log(req.body);
  try {
    console.log('Signin up');
    // Find the user who matches the posted e-mail address
    const userData = await User.create(req.body);

    if (!userData) {
      res
        .status(400)
        .json({ message: ' please try again' });
      return;
    }
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'Welcome!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    // Remove the session variables
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});


router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const user = await User.findByPk(userId);
    console.log(`Data one with ID ${userId} retrieved`);
    res.json(user);
  } catch (err) {
    console.error(`There was an error retrieving data one with ID ${req.params.id}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

