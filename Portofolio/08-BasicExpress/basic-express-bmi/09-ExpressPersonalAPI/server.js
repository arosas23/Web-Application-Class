const express = require('express'); 
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //For Postman


let names = [];
let tasks = [];

// Route to display the form and lists (principal)
app.get('/', (req, res) => {
    res.render('index', { names: names, tasks: tasks, lastName: null, error: null });
});

// GET /greet - Add a name and show wazzup
app.get('/greet', (req, res, next) => {
    const name = req.query.name;
    const index = req.query.index;

    if (typeof name !== 'undefined') {
        const newName = String(name).trim(); //change it to text and delete the spaces
        if (newName.length > 0) {
            names.push(newName);
            console.log(`Added name: ${newName}`);
            return res.render('index', { names: names, tasks: tasks, lastName: newName, error: null });
        } else {
            return res.render('index', { names: names, tasks: tasks, lastName: null, error: 'Empty name' });
        }
    }

    if (typeof index !== 'undefined') {
        const idx = parseInt(index, 10); //change an integer
        if (isNaN(idx) || idx < 0 || idx >= names.length) {
            return res.render('index', { names: names, tasks: tasks, lastName: null, error: 'Person not found' })
        } else {
            const theName = names[idx];
            return res.render('wazzup', { name: theName });
        }
    }

    res.redirect('/');
});

//Put a route in the name
app.put('/greet/:name', (req, res) => {
    const nm = String(req.params.name).trim();
    if (nm.length > 0) {
        names.push(nm);
        return res.json({ success: true, names: names });
    } else {
        return res.status(400).json({ success: false, error: 'Empty name' });
    }
});

// Add a tasks in the form
app.post('/task', (req, res) => {
    const taskText = (req.body.task || '').toString().trim();
    if (taskText.length > 0) {
        tasks.push({ text: taskText });
    }
    res.redirect('/');
});

//Delete the task
app.post('/task/delete', (req, res) => {
    const idx = parseInt(req.body.index, 10); 
    if (!isNaN(idx) && idx >= 0 && idx < tasks.length) {
        tasks.splice(idx, 1);
    }
    res.redirect('/');
});

// Move the task up or down
app.post('/task/move', (req, res) => {
    const idx = parseInt(req.body.index, 10);
    const direction = req.body.direction;
    if (!isNaN(idx) && idx >= 0 && idx < tasks.length) {
        if (direction === 'up' && idx > 0) {
            const temp = tasks[idx - 1];
            tasks[idx - 1] = tasks[idx];
            tasks[idx] = temp;
        } else if (direction === 'down' && idx < tasks.length - 1) {
            const temp = tasks[idx + 1];
            tasks[idx + 1] = tasks[idx];
            tasks[idx] = temp;
        }
    }
    res.redirect('/');
});

// Get the tasks in JSON - for Postman
app.get('/tasks', (req, res) => {
    res.json({ tasks: tasks });
});

// Error
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('index', { names: names, tasks: tasks, lastName: null, error: err.message });
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});