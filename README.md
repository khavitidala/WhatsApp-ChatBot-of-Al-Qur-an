# WhatsApp ChatBot of Al-Qur'an
Ini merupakan ChatBot yang merespons keyword tertentu pada platform WhatsApp. Bot ini hanyalah refactor dari bot saya yang lain https://github.com/khavitidala/totsuka dengan modifikasi sedemikian rupa.

## Fitur
Untuk saat ini, fitur yang terdapat dalam bot ini adalah:
1) Menampilkan informasi lengkap mengenai surah tertentu. 
2) Menampilkan ayat Al-Qur'an tertentu beserta terjemahannya dalam bahasa Indonesia. 
3) Menampilkan ayat Al-Qur'an tertentu beserta terjemahannya dalam bahasa Inggris. 4) Menampilkan ayat Al-Qur'an tertentu beserta terjemahan dan tafsirnya dalam bahasa Indonesia.
5) Menampilkan tautan dari audio surah tertentu. 
6) Mengirim audio surah dan ayat tertentu.
7) Menampilkan jadwal shalat (Temporarily deprecated)
7) Menampilkan random ayat

## Cara Instalasi
## Pastikan sudah terinstal NodeJs v12.
```bash
sudo apt update -y
sudo apt upgrade -y
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt install nodejs -y
sudo apt install git
```

### Klon dulu projeknya
```bash
> git clone https://github.com/khavitidala/WhatsApp-ChatBot-of-Al-Qur-an.git
```
### Install dulu dependensi yang dibutuhkan
Pastikan ada di folder tempat kamu klonkan.

```bash
> npm i
```

### Penggunaan

```bash
> npm start
```

### Troubleshooting
https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md

### Fix Error On Linux
```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
dpkg -i google-chrome-stable_current_amd64.deb
```


### Ucapan Terima Kasih yang Tak terhingga kepada
1. Open-Wa : https://github.com/open-wa/wa-automate-nodejs.git
2. Quran-api by sutanlab : https://github.com/sutanlab/quran-api
3. Al-Qur'an ID API by bachors : https://github.com/bachors/Al-Quran-ID-API
4. QuranJSON by penggguna : https://github.com/penggguna/QuranJSON
5. API Fatimah Bot : https://api.banghasan.com/
