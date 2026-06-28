// Find the elements on the page
const todayDate = document.getElementById("today-date");
const greeting = document.getElementById("greeting");
const bedtimeMessage = document.getElementById("bedtime-message");

// Get the current date and time
const now = new Date();
const hour = now.getHours();

// Display today's date
const dateOptions = {
    weekday: "long",
    month: "long",
    day: "numeric"
};

todayDate.textContent = now.toLocaleDateString("en-US", dateOptions);

// Display the greeting
if (hour < 12) {
    greeting.textContent = "Good morning, Alexis 🌅";
} else if (hour < 17) {
    greeting.textContent = "Good afternoon, Alexis ☀️";
} else if (hour < 20) {
    greeting.textContent = "Good evening, Alexis ⛅️";
    } else if (hour < 23) {
    greeting.textContent = "It's almost bedtime, Alexis 🌙 (11:00 PM).";
} else {
    greeting.textContent = "Good night, Alexis 🌌";
}

// Structure checklist
const structureTasks = document.querySelectorAll(".structure-task");
const structureMessage = document.getElementById("structure-message");

const todayKey = new Date().toDateString();
const savedDate = localStorage.getItem("structure-date");

// If it's a new day, clear yesterday's checkboxes
if (savedDate !== todayKey) {
    localStorage.setItem("structure-date", todayKey);

    structureTasks.forEach(function(task, index) {
        task.checked = false;
        localStorage.setItem("structure-task-" + index, "false");
    });
} else {
    structureTasks.forEach(function(task, index) {
        const savedValue = localStorage.getItem("structure-task-" + index);
        task.checked = savedValue === "true";
    });
}

function updateStructureMessage() {
    let checked = 0;

    structureTasks.forEach(function(task) {
        if (task.checked) {
            checked++;
        }
    });

    if (checked === 0) {
        structureMessage.textContent = "Remember to take care of yourself.";
    } else if (checked === structureTasks.length) {
        structureMessage.textContent = "That's all for today!";
    } else {
        structureMessage.textContent = checked + "/" + structureTasks.length;
    }
}

structureTasks.forEach(function(task, index) {
    task.addEventListener("change", function() {
        localStorage.setItem("structure-task-" + index, task.checked);
        updateStructureMessage();
    });
});

updateStructureMessage();

// Items: Plans + Priorities

const itemType = document.getElementById("item-type");
const itemDate = document.getElementById("item-date");

const itemInput = document.getElementById("reminder-input");
const addItemButton = document.getElementById("add-reminder");
const itemList = document.getElementById("reminder-list");
const myPlans = document.getElementById("my-plans");
const prioritiesLine = document.getElementById("priorities-line");

let items = JSON.parse(localStorage.getItem("alexisOS-items")) || [];

function saveItems() {
    localStorage.setItem("alexisOS-items", JSON.stringify(items));
}

function getTodayString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;
}

function updateHome() {
    const today = getTodayString();

    const todaysPlans = items.filter(function(item) {
        return item.type === "plan" && item.date === today && !item.done;
    });

    const priorities = items.filter(function(item) {
        return item.type === "priority" && !item.done;
    });

    if (todaysPlans.length === 0) {
        myPlans.textContent = "No plans today.";
    } else {
        myPlans.innerHTML = "<ul>" +
            todaysPlans.map(function(item) {
                return "<li>" + item.text + "</li>";
            }).join("") +
            "</ul>";
    }

    if (priorities.length === 0) {
        prioritiesLine.innerHTML =
            "<strong>Today's priorities:</strong> You're all caught up.";
    } else {
        prioritiesLine.innerHTML =
            "<strong>Today's priorities:</strong><ul>" +
            priorities.map(function(item) {
                return "<li>" + item.text + "</li>";
            }).join("") +
            "</ul>";
    }
}

function renderItems() {
    itemList.innerHTML = "";

    items.forEach(function(item, index) {
        const listItem = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.done;

        const label = document.createElement("span");
        label.textContent = " " + item.text + " (" + item.type + ") ";

        const removeButton = document.createElement("button");
        removeButton.textContent = "🗑️";

        checkbox.addEventListener("change", function() {
            items[index].done = checkbox.checked;
            saveItems();
            renderItems();
        });

        removeButton.addEventListener("click", function() {
            items.splice(index, 1);
            saveItems();
            renderItems();
        });

        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        listItem.appendChild(removeButton);

        itemList.appendChild(listItem);
    });

    updateHome();
}

addItemButton.addEventListener("click", function() {
    const text = itemInput.value.trim();
    const type = itemType.value;
    const date = itemDate.value;

    if (text === "") {
        return;
    }

    if (type === "plan" && date === "") {
        return;
    }

    items.push({
        text: text,
        type: type,
        date: date,
        done: false
    });

    saveItems();
    renderItems();

    itemInput.value = "";
    itemDate.value = "";
    itemType.value = "priority";
});
renderItems();