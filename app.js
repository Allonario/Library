import express from 'express'
import path from 'path'
import {fileURLToPath} from 'url';
import {dirname} from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT ?? 3000
const app = express()
let LIBRARY_DATA

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'public')))

fs.readFile('library_data.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Ошибка чтения файла:', err);
        return;
    }
    LIBRARY_DATA = JSON.parse(data);
    const bookList = LIBRARY_DATA;
});

app.get('/api/books_list', (req, res) => {
    const filteringParameter = req.query.filter
    res.json(filteringLibrary(filteringParameter))
})

app.post('/api/books_list', (req, res) => {
    const newBookData = {...req.body}
    const ID = newBookData['id']
    LIBRARY_DATA[ID] = JSON.stringify(newBookData)
    fs.writeFileSync('library_data.json', JSON.stringify(LIBRARY_DATA, null, 2));
    res.status(201).json(newBookData)
})

app.delete('/api/books_list/:id', (req, res) => {
    delete LIBRARY_DATA[req.params.id]
    fs.writeFileSync('library_data.json', JSON.stringify(LIBRARY_DATA, null, 2));
    res.status(201).json({message: 'Book was deleted'})
})

app.put('/api/books_list/:id', (req, res) => {
    LIBRARY_DATA[req.params.id] = JSON.stringify({...JSON.parse(LIBRARY_DATA[req.params.id]), ...req.body})
    fs.writeFileSync('library_data.json', JSON.stringify(LIBRARY_DATA, null, 2));
    res.status(201).json({message: 'Book was deleted'})
})

app.get('/book/:id', (req, res) => {
    res.render('book.ejs', {
        title: `${JSON.parse(LIBRARY_DATA[req.params.id]).bookName}`,
        authorName: `${JSON.parse(LIBRARY_DATA[req.params.id]).authorName}`,
        creationDate: `${JSON.parse(LIBRARY_DATA[req.params.id]).creationDate}`,
        available: `${JSON.parse(LIBRARY_DATA[req.params.id]).available}`,
        reader: `${JSON.parse(LIBRARY_DATA[req.params.id]).reader}`,
        returnDate: `${JSON.parse(LIBRARY_DATA[req.params.id]).returnDate}`
    })
})

app.get('/book_creator', (req, res) => {
    res.render('book_creator.ejs', {title: 'Book Creator'})
})

app.get('/', (req, res) => {
    res.render('index.ejs', {title : 'Book library'});
})

app.listen(PORT, () =>{
})


function filteringLibrary(filteringParameter) {
    let filteredLibrary = {}
    if (filteringParameter === 'overdue') {
        for (let id in LIBRARY_DATA) {
            let item = JSON.parse(LIBRARY_DATA[id])
            if (item['returnDate']) {
                let dateArray = item['returnDate'].split("-")
                if (new Date(parseInt(dateArray[0], 10),
                    parseInt(dateArray[1], 10) - 1,
                    parseInt(dateArray[2], 10)) < new Date()) {
                    filteredLibrary[id] = LIBRARY_DATA[id]
                }
            }
        }
    }
    else if (filteringParameter === 'available') {
        for (let id in LIBRARY_DATA) {
            let item = JSON.parse(LIBRARY_DATA[id])
            if (item['available']) {
                filteredLibrary[id] = LIBRARY_DATA[id]
            }
        }
    } else {
        filteredLibrary = LIBRARY_DATA
    }
    return filteredLibrary
}
