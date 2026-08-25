const express = require('express');
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }

    if (users.some(user => user.username === username)) {
        return res.status(400).json({message: "Username already exists"});
    }

    users.push({username: username, password: password});

    return res.status(201).json({message: "User successfully registered"});
});

// Get the book list available in the shop
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const response = await axios.get(`http://localhost:5000/books`);
        const book = response.data[isbn];

        return res.send(JSON.stringify(book, null, 4));
    } catch (error) {
        return res.status(500).json({
            message: "Error getting book details"
        });
    }
});
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.send(JSON.stringify(books[isbn], null, 4));
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        const response = await axios.get('http://localhost:5000/');

        const booksByAuthor = [];
        const keys = Object.keys(response.data);

        keys.forEach((isbn) => {
            if (response.data[isbn].author === author) {
                booksByAuthor.push(response.data[isbn]);
            }
        });

        return res.send(JSON.stringify(booksByAuthor, null, 4));

    } catch (error) {
        return res.status(500).json({
            message: "Error getting books"
        });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksByTitle = [];

    const keys = Object.keys(books);

    keys.forEach((isbn) => {
        if (books[isbn].title === title) {
            booksByTitle.push(books[isbn]);
        }
    });

    return res.send(JSON.stringify(booksByTitle, null, 4));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.send(JSON.stringify(books[isbn].reviews, null, 4));
});
module.exports.general = public_users;
