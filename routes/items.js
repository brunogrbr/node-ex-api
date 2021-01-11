// import required essentials
const { json } = require('express');
const express = require('express');
// create new router
const router = express.Router();

const fs = require('fs');
const { parse } = require('path');
const { stringify } = require('querystring');

// create a JSON data array
let dataT = fs.readFileSync('books.json');
let data = JSON.parse(dataT);
var obj = JSON.stringify(data);

// this end-point of an API returns JSON data array
router.get('/', function (req, res) {
    //res.send(data)
    res.status(200).json(data);
});

// this end-point returns an object from a data array find by id
// we get `id` from URL end-points
router.get('/:isbn', function (req, res) {
    // find an object from `data` array match by `id`
    let found = data.books.find(function (item) {
        return item.isbn === parseInt(req.params.isbn);
    });
    // if object found return an object else return 404 not-found
    if (found) {
        res.status(200).json(found);
    } else {
        res.sendStatus(404);
    }
});

//create
router.post('/', function(req, res){
    let booksIsbn = data.books.map(books => books.isbn);
    let booksAuthor = data.books.map(books => books.author);

    let newIsbn = booksIsbn.length > 0 ? Math.max.apply(Math, booksIsbn) +1 : 1;

    let newBook = {
        isbn: newIsbn,
        title: req.body.title,
        subtitle: req.body.subtitle,
        author: req.body.author,
        published: req.body.published,
        publisher: req.body.publisher,
        pages: req.body.pages,
        description: req.body.description,
        website: req.body.website
    }
    data.books.push(newBook);
    fs.writeFileSync('books.json', obj);
    res.status(201).json(newBook);

})

//UPDATE
router.put('/:isbn', function (req, res){
    let found = data.books.find(function (item) {
        return item.isbn === parseInt(req.params.isbn);
    })

    if(found){
        let updated = {
            isbn: found.isbn,
            title: req.body.title,
            subtitle: req.body.subtitle,
            author: req.body.author,
            published: req.body.published,
            publisher: req.body.publisher,
            pages: req.body.pages,
            description: req.body.description,
            website: req.body.website
        };
        let targetIndex = data.books.indexOf(found);

        upd = data.books.splice(targetIndex, 1, updated);
        fs.writeFileSync('books.json', obj);

        res.sendStatus(204);    
    }else{
        res.sendStatus(404);    
    }
});

router.delete('/:isbn', function (req, res){
    let found = data.books.find(function (item){
        return item.isbn === parseInt(req.params.isbn);
    });
    if (found) {
        // if item found then find index at which the item is
        // stored in the `data` array
        let targetIndex = data.indexOf(found);

        // splice means delete item from `data` array using index
        data.splice(targetIndex, 1);
    }

    // return with status 204
    // success status response code 204 indicates
    // that the request has succeeded
    fs.writeFileSync('books.json', obj);
    res.sendStatus(204);
});


module.exports = router;