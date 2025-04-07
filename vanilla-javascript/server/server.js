//express is a minimal and flexible web application framework for Node.js
//here we import the express module
const express = require('express');
//this step creates a new express app instance
//the app object now represents your entire web server and allows you to define routes, middleware, etc
//think of app as the server controller
const app = express()
const port = 3000; //3000 for now

app.use(express.static('../client'));

//health check route
app.get('/api/health', (req, res) => {
    res.json({status: 'Server is running!'});
});

//mock data for tasks
const tasks = [
    { id: 1, title: "Finish project README", completed: false },
    { id: 2, title: "Create basic frontend UI", completed: true },
    { id: 3, title: "Implement first API route", completed: false }
];

app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

app.use(express.json()); // this is a middleware that tells Express:
//For incoming requests with Content-Type: application/json, automatically parse the body into a real JavaScript object and store it in req.body
//thereforem we can later have const newTask = req.body; and newTask.id which accesses the attributes of the Json object received

app.post('/api/tasks', (req, res) => {
    //the req object contains the body fed into body as the second argument of fetch in client side
    const newTask = req.body;
    newTask.id = tasks.length + 1; //set id of new task in tasks list
    tasks.push(newTask);
    res.json(newTask); //send back the new task to client side
})

//Now we add the delete function (delete route)
app.delete('/api/tasks/:id', (req, res) => {
    //req has params id to delete
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId); //find the index of the first element that passed the condition
    //returns -1 if not found
    if (taskIndex !== -1) {
        const deletedTask = tasks.splice(taskIndex, 1)[0]; //splice removes the task and return an array with the removed items
        //since we are removing only 1 item, we get the item at index 0 of the returned array
        res.json({success: true, deleted: deletedTask});
    } else {
        res.status(404).json({success: false, message:"Task not found"});
    }

});

//next we toggle completed
app.put('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(task => task.id === taskId);
    if(task) {
        task.completed = !task.completed;
        res.json({success: true, updated: task});
    } else {
        res.status(404).json({success: false, message: "Task not found"});
    }
});


app.listen(port, ()=> {
    console.log(`Server is running on http://localhost:${port}`);
});

