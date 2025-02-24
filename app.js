// app.js

document.addEventListener('DOMContentLoaded', () => {
    const surahList = document.getElementById('surah-list');
    const ayahDisplay = document.getElementById('ayah-display');
    const surahTitle = document.getElementById('surah-title');
    const ayahContainer = document.getElementById('ayah-container');
    const searchInput = document.getElementById('search');

    // Fetch Surah list
    async function fetchSurahs() {
        try {
            const response = await fetch('https://api.quran.com/api/v4/chapters?language=id');
            const data = await response.json();
            const chapters = data.chapters;

            chapters.forEach(chapter => {
                const surahItem = document.createElement('div');
                surahItem.classList.add('surah-item');
                surahItem.innerHTML = `
                    <p>${chapter.name_simple} (${chapter.name_arabic})</p>
                    <small>${chapter.translated_name.name}</small>
                `;
                surahItem.addEventListener('click', () => fetchAyahs(chapter.id, chapter.name_simple, chapter.name_arabic));
                surahList.appendChild(surahItem);
            });
        } catch (error) {
            console.error('Error fetching Surahs:', error);
        }
    }

    // Fetch Ayahs for a specific Surah
    async function fetchAyahs(surahId, surahNameSimple, surahNameArabic) {
        try {
            const response = await fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${surahId}&translations=33`);
            const data = await response.json();
            const verses = data.verses;

            ayahContainer.innerHTML = '';
            surahTitle.textContent = `${surahNameSimple} (${surahNameArabic})`;
            ayahDisplay.classList.remove('hidden');

            verses.forEach(verse => {
                const ayahDiv = document.createElement('div');
                ayahDiv.classList.add('ayah');
                ayahDiv.innerHTML = `
                    <div class="arabic">${verse.text_uthmani}</div>
                    <div class="translation">${verse.translations[0].text}</div>
                `;
                ayahContainer.appendChild(ayahDiv);
            });
        } catch (error) {
            console.error('Error fetching Ayahs:', error);
        }
    }

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const surahItems = document.querySelectorAll('.surah-item');

        surahItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(query)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Initialize the app by fetching Surahs
    fetchSurahs();
});
