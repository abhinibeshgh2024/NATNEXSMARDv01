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
