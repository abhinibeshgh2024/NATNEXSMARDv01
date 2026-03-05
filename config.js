// 1. Personal Details (Aapka Unique Wallet ID)
const _p1 = "91425";
const _p2 = "43191";
const myNumber = "91" + _p1 + _p2;

// Aapka PhonePe Wallet specific UPI ID
const myUPI = "9142543191.wallet@phonepe"; 
const myName = "Abhinibesh Gupta";
const myEmail = "contact@natnex.in";

// 2. UPI Deep Link (Universal Format)
// pa = Payee Address (UPI ID)
// pn = Payee Name
// cu = Currency
// am = Amount (Khali rakha hai taaki user khud type kare)
const upiURL = `upi://pay?pa=${myUPI}&pn=${encodeURIComponent(myName)}&cu=INR`;

// 3. Dynamic Link Updates
document.getElementById('waBtn').href = `https://wa.me/${myNumber}`;
document.getElementById('phoneBtn').href = `tel:+${myNumber}`;
document.getElementById('mailBtn').href = `mailto:${myEmail}`;

// 4. UPI Button Logic (Mobile + Laptop Check)
const upiBtn = document.getElementById('upiBtn');
upiBtn.addEventListener('click', function(e) {
    const isMobile = /iPhone|Android|iPad/i.test(navigator.userAgent);

    if (isMobile) {
        // Mobile par direct app khulega jisme amount type karne ka option aayega
        window.location.href = upiURL;
    } else {
        // Laptop par wahi QR modal dikhayega
        e.preventDefault();
        document.getElementById('qrModal').style.display = 'flex';
    }

    if (window.navigator.vibrate) window.navigator.vibrate(60);
});

// 5. Contact Saving Logic
document.getElementById('saveContact').addEventListener('click', function(e) {
    e.preventDefault();
    const vcard = "BEGIN:VCARD\nVERSION:3.0\nFN:Abhinibesh Gupta\nORG:NatNex Technologies\nTEL;TYPE=CELL:+" + myNumber + "\nEND:VCARD";
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'Abhinibesh_Gupta.vcf');
    a.click();
    
    if (window.navigator.vibrate) window.navigator.vibrate(50);
});
// Calendar & To-Do Logic
document.addEventListener('DOMContentLoaded', () => {
    const dateDisplay = document.getElementById('currentDate');
    const todoContainer = document.getElementById('todoContainer');
    const addBtn = document.getElementById('addTaskBtn');

    // 1. Aaj ki date dikhao
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    dateDisplay.innerText = new Date().toLocaleDateString('en-US', options);

    // 2. LocalStorage se tasks load karo
    let tasks = JSON.parse(localStorage.getItem('natnex_tasks')) || [];

    function renderTasks() {
        todoContainer.innerHTML = '';
        tasks.forEach((task, index) => {
            const div = document.createElement('div');
            div.className = `todo-item ${task.done ? 'completed' : ''}`;
            div.innerHTML = `
                <span onclick="toggleTask(${index})">${task.text}</span>
                <i class="fas fa-trash-alt" onclick="deleteTask(${index})"></i>
            `;
            todoContainer.appendChild(div);
        });
    }

    // 3. Add Task Function
    addBtn.onclick = () => {
        const text = prompt("Enter your task for today:");
        if (text) {
            tasks.push({ text: text, done: false });
            saveAndRender();
        }
    };

    // 4. Toggle & Delete Functions
    window.toggleTask = (index) => {
        tasks[index].done = !tasks[index].done;
        saveAndRender();
    };

    window.deleteTask = (index) => {
        tasks.splice(index, 1);
        saveAndRender();
    };

    function saveAndRender() {
        localStorage.setItem('natnex_tasks', JSON.stringify(tasks));
        renderTasks();
    }

    renderTasks();
});
