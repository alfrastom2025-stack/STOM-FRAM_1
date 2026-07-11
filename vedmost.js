// Google Sheets konfiguratsiyasi
// Diqqat: O'ziningizning Google Sheet ID va API Key ma'lumotlaringizni kiriting!
const SHEET_ID = 'JADVALINGIZNING_UZUN_ID_KODI'; 
const API_KEY = 'SIZNING_GOOGLE_API_KALITINGIZ';
// D11 dan M36 gacha bo'lgan talabalar hududini o'qiymiz
const RANGE = 'Sheet1!D11:M37'; 

// Sahifa yuklanganda avtomat ishga tushadi
document.addEventListener("DOMContentLoaded", () => {
    loadVedmostFromSheets();
});

async function loadVedmostFromSheets() {
    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`);
        if (!response.ok) throw new Error("Tarmoq xatosi yoki API kalit noto'g'ri");
        
        const data = await response.json();
        const rows = data.values;

        if (!rows || rows.length === 0) {
            console.warn("Jadvaldan ma'lumot topilmadi.");
            return;
        }

        // Ma'lumotlarni HTML jadvalga render qilish
        renderDynamicTable(rows);

    } catch (error) {
        console.error("Google Sheets'dan ma'lumot yuklashda xatolik:", error);
    }
}

function renderDynamicTable(rows) {
    const tableBody = document.querySelector(".vm tbody") || document.querySelector(".vm");
    if (!tableBody) return;

    // Sarlavhadan pastki qismini tozalash (eski statik ma'lumotlarni o'chirish)
    const headerRow = tableBody.querySelector(".hm") || tableBody.rows[0];
    tableBody.innerHTML = '';
    if (headerRow) tableBody.appendChild(headerRow);

    rows.forEach(row => {
        // Massiv indekslari Google Sheets ustunlariga mos keladi:
        // row[0] -> D (№), row[1] -> E (F.I.Sh), row[2] -> F (ID), row[3] -> G (Guruh)
        // row[4] -> H (Ruxsat), row[5] -> I (JN 100), row[8] -> L (Umumiy ball), row[9] -> M (Baho)
        
        const no = row[0] || '';
        const fish = row[1] || '';
        const id = row[2] || '';
        const guruh = row[3] || '';
        const ruxsat = row[4] || '';
        const jnBall = row[5] || '0';
        const umumiylBall = row[8] || '0';
        const baho = row[9] || '0';

        // Agar satr bo'sh bo'lsa tashlab ketamiz
        if (!fish) return;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${no}</td>
            <td style="text-align: left; padding-left: 8px;">
                <strong>${fish}</strong> <br>
                <small style="color: #6B6A64;">ID: ${id} | ${guruh}</small>
            </td>
            <td>${jnBall}</td>
            <td>${umumiylBall}</td>
            <td style="font-weight: bold; color: ${baho == '0' ? '#A32D2D' : '#185FA5'}">${baho}</td>
        `;
        tableBody.appendChild(tr);
    });

    console.log("Vedmost Google Sheets bilan dinamik yangilandi.");
}
