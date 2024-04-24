const feedbackList = document.getElementById('feedbackList');
const taskList = document.getElementById('taskList');
const staffList = document.getElementById('staffList');
const commentArea = document.getElementById('commentArea');
let comment = document.getElementById('comment');
const buttonArea = document.getElementById('buttonArea');

function filterFeedbacksByReceiver(filteredFeedbacks, staffName) {
    return filteredFeedbacks.filter(feedback => feedback.receiver === staffName);
} 

function filterFeedbacksByStaff(feedbacks, staffName) {
    return feedbacks.filter(feedback => feedback.staff.includes(staffName));
}

// Example usage:
const staffName = "Jaedon"; //chosen staff as user for testing
let allFeedbacks = [
    {
        "task": "Task 1",
        "sender": "Shaneel",
        "comment": "Do ABC",
        "receiver": "Jaedon",
        "staff": ["Jaedon", "Shaneel", "Taruna"]
    },
    {
        "task": "Task 2",
        "sender": "Taruna",
        "comment": "Do DEF",
        "receiver": "Shaneel",
        "staff": ["Jaedon", "Shaneel", "Keren"]
    },
    {
        "task": "Task 3",
        "sender": "Shaneel",
        "comment": "Do GHI",
        "receiver": "Taruna",
        "staff": ["Shaneel", "Angie", "Taruna"]
    }
];//JSON array with all feedbacks, simulating database

//Displaying of receiving feedback

let filteredByReceiver = filterFeedbacksByReceiver(allFeedbacks, staffName); //feedbacks adressed to the user
let feedbacks = filterFeedbacksByStaff(allFeedbacks, staffName); //feedbacks where the user is part of the task
console.log(feedbacks);
console.log(filteredByReceiver);

renderFeedback(); // displays all the feedback to the user

function renderFeedback() {
    feedbackList.innerHTML = '';
    filteredByReceiver.forEach((feedback, index) => {
        const eachFeedback = document.createElement('block');
        eachFeedback.classList.add('feedback-card');
        eachFeedback.innerHTML = `
            <p><strong>Task:</strong> ${feedback.task}</p>
            <p><strong>Sender:</strong> ${feedback.sender}</p>
            <p><strong>Comment:</strong> ${feedback.comment}</p>
        `;
        feedbackList.appendChild(eachFeedback);
    });
}

//Displaying of sending feedback

function getAllTasks(feedbacks) {
    const tasks = feedbacks.map(feedback => feedback.task);
    // Remove duplicates by converting to a Set and then back to an array
    return [...new Set(tasks)];
}


const allTasks = getAllTasks(feedbacks); //array of all tasks amongst feedback where the user is part of the task
console.log(allTasks);
rendertasks(); //displays tasks that can be selected to choose which task pertains to the feedback sent by the user 

function rendertasks() {
    allTasks.forEach((task, index) => {
        const eachTask = document.createElement('li');
        eachTask.classList.add('task-entry');
        eachTask.innerHTML = `
            <button class="btn-task" data-index="${index}">${task}</button>
        `;
        taskList.appendChild(eachTask);
    });
}

function getAllStaff(feedbacks) {
    // Merge all staff arrays into a single array
    const allStaff = feedbacks.reduce((acc, feedback) => {
        return acc.concat(feedback.staff);
    }, []);

    // Remove duplicates by converting to a Set and then back to an array
    return [...new Set(allStaff)];
} //function to get array of all staff from array of feedback

let allStaff; //stores staff that will be displayed as options to choose after choosing a task

function renderStaff() {
    allStaff.forEach((staff, index) => {
        if(staff !== staffName)
        {
            const staffMember = document.createElement('li');
            staffMember.classList.add('staff-entry');
            staffMember.innerHTML = `
                <button class="btn-staff" data-index="${index}">${staff}</button>
            `;
            staffList.appendChild(staffMember);
        }
    });
}

let taskChosen; //stores task chosen used when adding new feedback to allFeedbacks, simulating database
taskList.addEventListener('click', event => {
    if (event.target.classList.contains('btn-task')) {
        staffList.innerHTML = '';
        buttonArea.innerHTML = '';
        const index = event.target.dataset.index;
        allStaff = feedbacks[index].staff; //choses staff array from feedback object according to task chosen, so only appropriate staff is displayed
        console.log(allStaff);
        renderStaff(); // displays staff according to task chosen as options to choose, determining the receiver of your feedback sent
        taskChosen = feedbacks[index].task;
        console.log(taskChosen);
    }
});

function renderButton() {
    const sendButton = document.createElement('block');
    sendButton.classList.add('button-container');
    sendButton.innerHTML = `
        <button class="btn-send">Send</button>
    `;
    buttonArea.appendChild(sendButton);
}

let staffChosen; //stores staff chosen who the comment is sent. Used to add new feedback object to allFeedbacks
staffList.addEventListener('click', event => {
    if (event.target.classList.contains('btn-staff')) {
        buttonArea.innerHTML = ''; 
        const index = event.target.dataset.index;
        renderButton(); //displays send button after choosing staff member that feedbac will be sent to
        staffChosen = allStaff[index];
        console.log(staffChosen);
    }
});

function addFeedback(feedbacks, task, sender, comment, receiver, staff) {
    const newFeedback = {
        task: task,
        sender: sender,
        comment: comment,
        receiver: receiver,
        staff: staff
    };
    feedbacks.push(newFeedback); //adds object to JSON array
    return feedbacks; //returns original JSON array with new added feedback object
}

buttonArea.addEventListener('click', event => {
    if (event.target.classList.contains('btn-send')) {
        buttonArea.innerHTML = '';
        allFeedbacks = addFeedback(allFeedbacks, taskChosen, staffName, comment.value, staffChosen, allStaff); //updates original feedback object array simulating database with new added feedback from user
        console.log(allFeedbacks);
        comment.value = ""; //sets feedback box back to default display after sending feedback
    }
});