// Personal Info
const myNumber = "919142543191";
const myEmail = "nexpploro@gmail.com";
const myName = "Abhinibesh Gupta";

// Profile Button Links
document.getElementById('waBtn').href = `https://wa.me/${myNumber}`;
document.getElementById('phoneBtn').href = `tel:+${myNumber}`;
document.getElementById('mailBtn').href = `mailto:${myEmail}`;

// --- APPOINTMENT SYSTEM ---
const aptModal = document.getElementById('aptModal');
document.getElementById('aptBtn').onclick = () => aptModal.style.display = 'flex';
window.closeAptModal = () => aptModal.style.display = 'none';

window.sendAptEmail = () => {
    const name = document.getElementById('aptName').value;
    const title = document.getElementById('aptTitle').value;
    const date = document.getElementById('aptDate').value;
    const time = document.getElementById('aptTime').value;
    const desc = document.getElementById('aptDesc').value;

    if (name && title && date && time) {
        const subject = encodeURIComponent(`Appointment Request: ${title}`);
        
        // AI Logic Style Pre-written Body
        const body = encodeURIComponent(
            `Hello Abhinibesh,\n\n` +
            `I would like to request an appointment. Here are the details:\n\n` +
            `👤 Name: ${name}\n` +
            `📅 Date: ${date}\n` +
            `⏰ Time: ${time}\n` +
            `📝 Purpose: ${title}\n\n` +
            `Description:\n${desc}\n\n` +
            `Please let me know if this slot works for you.\n\n` +
            `Sent via SMARD Card.`
        );

        window.location.href = `mailto:${myEmail}?subject=${subject}&body=${body}`;
        closeAptModal();
    } else {
        alert("Please fill in your Name, Title, Date and Time.");
    }
};

// --- DYNAMIC TO-DO LOGIC (Unique Devices) ---
let myTasks = JSON.parse(localStorage.getItem('user_events')) || [];
let viewDate = new Date();
const today = new Date();
today.setHours(0,0,0,0);

function renderCalendar() {
    const container = document.getElementById('eventContainer');
    const monthDisplay = document.getElementById('monthDisplay');
    container.innerHTML = '';

    const m = viewDate.getMonth();
    const y = viewDate.getFullYear();
    monthDisplay.innerText = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    let filtered = myTasks.filter(task => {
        const tDate = new Date(task.date);
        return tDate.getMonth() === m && tDate.getFullYear() === y && tDate >= today;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    if (filtered.length === 0) {
        container.innerHTML = `<p style="color:#444; font-size:0.8rem; padding:10px;">No personal tasks scheduled.</p>`;
    }

    filtered.forEach((task) => {
        const tDate = new Date(task.date);
        const div = document.createElement('div');
        div.className = `event-item`;
        div.innerHTML = `
            <div class="event-content">
                <div class="event-title">${task.title}</div>
                <div class="event-date">${tDate.toDateString()} | ${tDate.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
            </div>
            <button class="delete-btn" onclick="deleteTodo(${task.id})"><i class="fas fa-trash-alt"></i></button>
        `;
        container.appendChild(div);
    });
}

window.openTodoModal = () => document.getElementById('todoModal').style.display = 'flex';
window.closeTodoModal = () => document.getElementById('todoModal').style.display = 'none';

window.saveNewTodo = () => {
    const title = document.getElementById('todoTitle').value;
    const date = document.getElementById('todoDate').value;
    const time = document.getElementById('todoTime').value;
    if (title && date && time) {
        myTasks.push({ id: Date.now(), title, date: `${date}T${time}` });
        localStorage.setItem('user_events', JSON.stringify(myTasks));
        renderCalendar();
        closeTodoModal();
        document.getElementById('todoTitle').value = '';
    }
};

window.deleteTodo = (id) => {
    if (confirm("Delete this task?")) {
        myTasks = myTasks.filter(t => t.id !== id);
        localStorage.setItem('user_events', JSON.stringify(myTasks));
        renderCalendar();
    }
};

// Nav Listeners
document.getElementById('prevMonth').onclick = () => { viewDate.setMonth(viewDate.getMonth() - 1); renderCalendar(); };
document.getElementById('nextMonth').onclick = () => { viewDate.setMonth(viewDate.getMonth() + 1); renderCalendar(); };

// Contact Save
document.getElementById('saveContact').onclick = (e) => {
    e.preventDefault();
    const vcf = `BEGIN:VCARD\nVERSION:3.0\nFN:${myName}\nTEL;TYPE=CELL:+${myNumber}\nEND:VCARD`;
    const blob = new Blob([vcf], { type: "text/vcard" });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "Abhinibesh.vcf"; a.click();
};

renderCalendar();
