

const taskList = document.querySelector('#task-list');

fetch('/api/tasks')
    .then(response => response.json())
    .then(tasks => {
        //const taskList = document.querySelector('#task-list');
        tasks.forEach(task => {
            //const li = document.createElement('li');
            //li.textContent = `${task.title} - Completed: ${task.completed}`;

            //toggle button
            // const toggleBtn = document.createElement('button');
            // toggleBtn.textContent = 'Toggle ✅/❌';
            // toggleBtn.style.marginLeft = '10px';
            // toggleBtn.addEventListener('click', () => {
            //     fetch(`/api/tasks/${task.id}`, {method: 'PUT'})
            //         .then(res => res.json())
            //         .then(data => {
            //             //the thing returned is the task object being toggled
            //             //data has two key value pairs: success, updated
            //             li.textContent = `${data.updated.title} - Completed: ${data.updated.completed}`;
            //             li.append(toggleBtn);
            //             li.append(deleteBtn);
            //         })
            // })

            // //delete button
            // const deleteBtn = document.createElement('button');
            // deleteBtn.textContent = 'Delete 🗑️';
            // deleteBtn.style.marginLeft = '5px';
            // deleteBtn.addEventListener('click', () => {
            //     fetch(`/api/tasks/${task.id}`, {method: "DELETE"})
            //         .then(res => res.json()) //the response from the server is the deleted object 
            //         .then(data => {
            //             if (data.success) {
            //                 li.remove();
            //             }
            //         });
            // });

            // li.append(toggleBtn);
            // li.append(deleteBtn);
            const taskLi = render_task(task);

            taskList.append(taskLi);
        })
    })
    .catch(error => {
        console.error('Error fetching tasks:', error);
    });


//this is to add task via POST request
//first get the form object by id
//add event listener to the form on event 'submit'
//upon submit 


document.querySelector('#task-form').addEventListener('submit', function(e) {
    e.preventDefault(); //prevent default behaviour of submmiting a form
    const taskInput = document.querySelector('#task-input'); //get the input object where the input value of user will be stored
    const newTask = {title: taskInput.value, completed: false}; //create a new task object with title and boolean value of completed

    fetch('/api/tasks', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newTask)//converts JS object to JSON string for transmission
    })//second parameter of fetch is an object of configs
    .then(res => res.json())//the response is raw json of the list of tasks and then we cast to JSON object
    .then(savedTask => { //the reponse from the server is just the new task
        //const taskList = document.querySelector('#task-list');
        //const li = document.createElement('li');
        //li.textContent = `${savedTask.title} - Completed: ${savedTask.completed}`;
        const newLi = render_task(savedTask);
        taskList.append(newLi); //add new task into the list
        taskInput.value = '';//reset input value to empty string
    })
    .catch(err => console.error('Error adding task:', err));//always remember to catch error

});

//add nodemon: a development tool that automatically restarts your Node.js server
//whenever you make changes to your backend files (without the need to restard the server)'

function render_task(task) {
    //this function creates text content and also delete and toggle buttons for each task
    const span = document.createElement('span');
    span.textContent = `${task.title} - Completed: ${task.completed}`;
    const li = document.createElement('li')
    li.append(span);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete 🗑️';
    deleteBtn.style.marginLeft = '5px';
    deleteBtn.addEventListener('click', () => {
        fetch(`/api/tasks/${task.id}`, {method: "DELETE"})
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    li.remove();
                }
            });
    });

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Toggle ✅/❌';
    toggleBtn.style.marginLeft = '10px';
    toggleBtn.addEventListener('click', () => {
        fetch(`/api/tasks/${task.id}`, {method: "PUT"})
            .then(res => res.json())
            .then(data => {
                span.textContent = `${data.updated.title} - Completed: ${data.updated.completed}`;
            })
    })

    
    li.append(toggleBtn);
    li.append(deleteBtn);

    return li;
}

