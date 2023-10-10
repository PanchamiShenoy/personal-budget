const express = require('express');
const cors = require('cors');
const fs = require('fs');
const mongoose = require("mongoose")
const bodyParser = require('body-parser');
const model = require("./schema")

let url = 'mongodb://localhost:27017/budgetData';
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const budget = {
    budget: [
    {
        title: 'Eat out',
        budget: 30
    },
    {
        title: 'Rent',
        budget: 300
    },
    {
        title: 'Groceries',
        budget: 100
    },

]}

app.get('/budget', (req, res) => {
    fs.readFile('budgetData.json', 'utf8', (error, data) => {
      if (error) {
        console.error(err);
      }
      const budgetData = JSON.parse(data);
      res.json(budgetData);
    });
  });

  app.get('/budgetDB', (req, res) => {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        console.log("Connected to the database");
        model.find({})
          .then((data) => {
            console.log(data);
            res.json(data);
            mongoose.connection.close();
          })
          .catch((connectionError) => {
            console.log(connectionError);
            res.status(500).json({ error: 'Error fetching data from the database' });
          });
  
      })
      .catch((connectionError) => {
        console.log(connectionError);
        res.status(500).json({ error: 'Database connection error' });
      });
  });
  
  app.post('/addData', async (req, res) => {
    try {
      const requiredFields = ['title', 'budget', 'color'];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      const newData = new model({
        title: req.body.title,
        budget: req.body.budget,
        color: req.body.color,
      });
      await newData.save();

      res.status(201).json(newData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  
app.listen(port, () => {
    console.log(`example app listening at http://localhost:${port}`);
});


