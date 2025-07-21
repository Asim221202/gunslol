const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Profil verileri
const profiles = {
  scrxpie: {
    name: 'Scrxpie',
    photo: 'https://i.imgur.com/qMw0pi0.gif',
    links: [
      { name: 'TikTok', url: 'https://tiktok.com/@iixaryl' },
      { name: 'Instagram', url: 'https://instagram.com/ixarylx' },
      { name: 'Discord', url: 'https://discord.gg/theotherside' },
    ],
  },
  // İstersen başka profiller ekleyebilirsin
};

// Statik dosyaları public klasöründen sun
app.use(express.static(path.join(__dirname, 'public')));

// Ana sayfa için index.html dosyasını gönder
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Dinamik profil sayfası
app.get('/:username', (req, res) => {
  const user = profiles[req.params.username];
  if (!user) return res.status(404).send('Profil bulunamadı');

  const linksHtml = user.links
    .map(link => `<a href="${link.url}" target="_blank">${link.name}</a>`)
    .join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>guns.lol/${user.name.toLowerCase()}</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <div class="container">
        <img src="${user.photo}" alt="Profil Foto" class="avatar" />
        <h1>@${user.name.toLowerCase()}</h1>
        <p>Hoş geldin! Aşağıda linklerim var:</p>
        <div class="links">${linksHtml}</div>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
