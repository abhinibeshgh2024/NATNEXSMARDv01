// 1. Personal & Payment Config
const myNumber = "919142543191";
const myUPI = "9142543191.wallet@phonepe";
const myName = "Abhinibesh Gupta";

// 2. Initial Setup
document.getElementById('waBtn').href = `https://wa.me/${myNumber}`;
document.getElementById('phoneBtn').href = `tel:+${myNumber}`;
document.getElementById('mailBtn').href = `mailto:contact@natnex.in`;

const upiURL = `upi://pay?pa=${myUPI}&pn=${encodeURIComponent(myName)}&cu=INR`;
const upiBtn = document.getElementById('upiBtn');

upiBtn.addEventListener('click', (e) => {
    if (/iPhone|Android|iPad/i.test(navigator.userAgent)) {
        window.location.href = upiURL;
    } else {
        document.getElementById('qrModal').style.display = 'flex';
    }
    if (navigator.vibrate) navigator.vibrate(60);
});

// 3. Smart Calendar Logic
let viewDate = new Date();
const today = new Date();
today.setHours(0,0,0,0);

// Random Academic & Office Tasks
const allEvents = [
    { title: "NatNex Strategy Call", day: 5, type: "Office" },
    { title: "Drone Swarm Research", day: 12, type: "Academic" },
    { title: "Webinar: IoT Futures", day: 18, type: "Webinar" },
    { title: "Project Submission", day: 25, type: "Academic" },
    { title: "Online Meeting: Dev Team", day: 2, type: "Office" }
];

function renderCalendar() {
    const container = document.getElementById('eventContainer');
    const monthDisplay = document.getElementById('monthDisplay');
    container.innerHTML = '';

    const m = viewDate.getMonth();
    const y = viewDate.getFullYear();
    monthDisplay.innerText = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    // Filter out past dates and sort
    let monthlyEvents = JSON.parse(JSON.stringify(allEvents));
    
    // Add May Exam Tag Logic (May is index 4)
    if (m === 4) {
        monthlyEvents.push({ title: "Semester Finals", day: 5, type: "Exam", tag: true });
    }

    let filtered = monthlyEvents.filter(ev => {
        const evDate = new Date(y, m, ev.day);
        return evDate >= today; // Dissapear past dates
    }).sort((a, b) => a.day - b.day);

    if (filtered.length === 0) {
        container.innerHTML = `<p style="color:#555; font-size:0.8rem;">No tasks scheduled.</p>`;
        return;
    }

    filtered.forEach((ev, index) => {
        const isNearest = index === 0 && m === today.getMonth();
        const evDate = new Date(y, m, ev.day);
        const item = document.createElement('div');
        item.className = `event-item ${isNearest ? 'nearest' : ''}`;
        
        // Show Exam tag only for specific date range in May
        let tag = (m === 4 && ev.day >= 5 && ev.day <= 25) ? `<span class="exam-tag">EXAMS</span>` : '';

        item.innerHTML = `
            <div class="event-title">${ev.title}${tag}</div>
            <div class="event-date">${evDate.toDateString()}</div>
        `;
        container.appendChild(item);
    });
}

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
