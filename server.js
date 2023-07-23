// server.js (Express.js example)
const express = require('express');
const credentials = require('./credentials.json');
const admin = require('firebase-admin');


const app = express();


admin.initializeApp({
  credential: admin.credential.cert(credentials),
  databaseURL: "https://hrms-e4806-default-rtdb.firebaseio.com"
});

// Enable CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(express.json());

// Create a user - endpoint
app.post('/createUser', async (req, res) => {
  const { email, password, displayName } = req.body;

  try {
    admin.auth().createUser({
      email: email,
      emailVerified: true,
      password: password
    })
    .then((userRecord) => {
      res.status(200).json({ message: 'User created successfully',userRecord });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to create user',error });
    });
    
  } catch (error) {
    res.status(500).json({error: 'Error creating new user:', error });
  }
});

// Edit a user - endpoint
app.post('/editUser', async (req, res) => {
  const { email, uid } = req.body;

  try {
    admin.auth().updateUser(uid,{
      email: email,
      emailVerified: false
    })
    .then((userRecord) => {
      res.status(200).json({ message: 'User updated successfully',userRecord });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to update user',error });
    });
    
  } catch (error) {
    res.status(500).json({error: 'Error updating user:', error });
  }
});

// Delete a user - endpoint
app.post('/deleteUser', async (req, res) => {
  const { uid } = req.body;

  try {
    admin.auth().deleteUser(uid)
    .then((userRecord) => {
      res.status(200).json({ message: 'User deleted successfully',userRecord });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to delete user',error });
    });
    
  } catch (error) {
    res.status(500).json({error: 'Error deleting user:', error });
  }
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server on port ${port}`);
});

