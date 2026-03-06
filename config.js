// Personal Config
const myNumber = "919142543191";
const myUPI = "9142543191.wallet@phonepe";
const myName = "Abhinibesh Gupta";

// Profile setup
document.getElementById('waBtn').href = `https://wa.me/${myNumber}`;
document.getElementById('phoneBtn').href = `tel:+${myNumber}`;
document.getElementById('mailBtn').href = `mailto:contact@natnex.in`;

// UPI logic
document.getElementById('upiBtn').onclick = () => {
    const upiURL = `upi://pay?pa=${myUPI}&pn=${encodeURIComponent(myName)}&cu=INR`;
    window.location.href = upiURL;
};

// --- DYNAMIC TO-DO LOGIC ---
// Initialize: Blank for unique devices, Loads existing for returning users
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

    // Filter events for this month + remove passed events
    let filtered = myTasks.filter(task => {
        const tDate = new Date(task.date);
        return tDate.getMonth() === m && tDate.getFullYear() === y && tDate >= today;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    if (filtered.length === 0) {
        container.innerHTML = `<p style="color:#444; font-size:0.8rem; padding:10px;">No events scheduled.</p>`;
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

// Global functions for Modal & Logic
window.openModal = () => document.getElementById('addEventModal').style.display = 'flex';
window.closeModal = () => document.getElementById('addEventModal').style.display = 'none';

window.saveNewEvent = () => {
    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    if (title && date && time) {
        myTasks.push({ id: Date.now(), title, date: `${date}T${time}`, done: false });
        save();
        closeModal();
        document.getElementById('eventTitle').value = '';
    } else { alert("Details missing!"); }
};

window.toggleStatus = (id) => {
    if (confirm("Confirm status change?")) {
        const task = myTasks.find(t => t.id === id);
        task.done = !task.done;
        save();
    } else { renderCalendar(); }
};

window.deleteEvent = (id) => {
    if (confirm("Delete this event?")) {
        myTasks = myTasks.filter(t => t.id !== id);
        save();
    }
};

function save() {
    localStorage.setItem('user_events', JSON.stringify(myTasks));
    renderCalendar();
}

// Navigation
document.getElementById('prevMonth').onclick = () => { viewDate.setMonth(viewDate.getMonth() - 1); renderCalendar(); };
document.getElementById('nextMonth').onclick = () => { viewDate.setMonth(viewDate.getMonth() + 1); renderCalendar(); };

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
