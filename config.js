// 1. Data Config
const myNumber = "919142543191";
const myUPI = "9142543191.wallet@phonepe";
const myName = "Abhinibesh Gupta";

// Default Pre-listed Tasks (March & April 2026)
const defaultTasks = [
    { id: 101, title: "NatNex Strategy Meet", date: "2026-03-10T10:00", done: false },
    { id: 102, title: "Drone Swarm Research", date: "2026-03-15T14:30", done: false },
    { id: 103, title: "Project Submission", date: "2026-04-10T23:59", done: false },
    { id: 104, title: "Venture Capital Call", date: "2026-04-22T11:00", done: false }
];

let myTasks = JSON.parse(localStorage.getItem('natnex_events')) || defaultTasks;
let viewDate = new Date();
const today = new Date();
today.setHours(0,0,0,0);

// 2. Initial Setup
document.getElementById('waBtn').href = `https://wa.me/${myNumber}`;
document.getElementById('phoneBtn').href = `tel:+${myNumber}`;
document.getElementById('mailBtn').href = `mailto:contact@natnex.in`;

const upiURL = `upi://pay?pa=${myUPI}&pn=${encodeURIComponent(myName)}&cu=INR`;
document.getElementById('upiBtn').onclick = () => {
    if (/iPhone|Android|iPad/i.test(navigator.userAgent)) {
        window.location.href = upiURL;
    } else { document.getElementById('qrModal').style.display = 'flex'; }
};

// 3. Calendar & Task Logic
function renderCalendar() {
    const container = document.getElementById('eventContainer');
    const monthDisplay = document.getElementById('monthDisplay');
    container.innerHTML = '';

    const m = viewDate.getMonth();
    const y = viewDate.getFullYear();
    monthDisplay.innerText = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    // Filter Logic: No past months, Hide past dates of current month
    let filtered = myTasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate.getMonth() === m && taskDate.getFullYear() === y && taskDate >= today;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    // May Exam Alert
    if (m === 4 && y === 2026) {
        container.innerHTML += `<div class="event-item nearest" style="border-left: 3px solid #ff4d4d">
            <div class="event-content"><div class="event-title">Semester Finals <span class="exam-tag">EXAMS</span></div>
            <div class="event-date">May 5 - May 25, 2026</div></div></div>`;
    }

    if (filtered.length === 0 && m !== 4) {
        container.innerHTML = `<p style="color:#444; font-size:0.8rem; padding:10px;">No events scheduled for this month.</p>`;
    }

    filtered.forEach((task, index) => {
        const isNearest = index === 0 && m === new Date().getMonth();
        const tDate = new Date(task.date);
        const div = document.createElement('div');
        div.className = `event-item ${isNearest ? 'nearest' : ''}`;
        div.innerHTML = `
            <input type="checkbox" class="event-checkbox" ${task.done ? 'checked' : ''} onchange="toggleStatus(${task.id})">
            <div class="event-content ${task.done ? 'completed-text' : ''}">
                <div class="event-title">${task.title}</div>
                <div class="event-date">${tDate.toDateString()} | ${tDate.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
            </div>
            <button class="delete-btn" onclick="deleteEvent(${task.id})"><i class="fas fa-trash-alt"></i></button>
        `;
        container.appendChild(div);
    });
}

// 4. Action Functions
window.toggleStatus = (id) => {
    if (confirm("Confirm task completion?")) {
        const task = myTasks.find(t => t.id === id);
        task.done = !task.done;
        save();
    } else { renderCalendar(); }
};

window.deleteEvent = (id) => {
    if (confirm("Permanently delete this event?")) {
        myTasks = myTasks.filter(t => t.id !== id);
        save();
    }
};

window.saveNewEvent = () => {
    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    if (title && date && time) {
        myTasks.push({ id: Date.now(), title, date: `${date}T${time}`, done: false });
        save();
        closeModal();
    } else { alert("Please fill all details!"); }
};

function save() {
    localStorage.setItem('natnex_events', JSON.stringify(myTasks));
    renderCalendar();
}

// Nav Listeners
document.getElementById('prevMonth').onclick = () => { viewDate.setMonth(viewDate.getMonth() - 1); renderCalendar(); };
document.getElementById('nextMonth').onclick = () => { viewDate.setMonth(viewDate.getMonth() + 1); renderCalendar(); };

// Modal Controls
window.openModal = () => { document.getElementById('addEventModal').style.display = 'flex'; };
window.closeModal = () => { document.getElementById('addEventModal').style.display = 'none'; };

// Contact Save
document.getElementById('saveContact').onclick = (e) => {
    e.preventDefault();
    const vcf = `BEGIN:VCARD\nVERSION:3.0\nFN:${myName}\nTEL;TYPE=CELL:+${myNumber}\nEND:VCARD`;
    const blob = new Blob([vcf], { type: "text/vcard" });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "Abhinibesh.vcf";
    a.click();
};

renderCalendar();
