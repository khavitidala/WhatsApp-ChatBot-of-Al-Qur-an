const { create, decryptMedia } = require('@open-wa/wa-automate')
const axios = require('axios')
const moment = require('moment')
const color = require('./lib/color')
const serverOption = {
  sessionId: 'Imperial',
  headless: true,
  qrRefreshS: 20,
  qrTimeout: 0,
  authTimeout: 0,
  autoRefresh: true,
  cacheEnabled: false,
  chromiumArgs: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--aggressive-cache-discard',
    '--disable-cache',
    '--disable-application-cache',
    '--disable-offline-load-stale-cache',
    '--disk-cache-size=0'
  ]
}
const opsys = process.platform
if (opsys === 'win32' || opsys === 'win64') {
  serverOption.executablePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
} else if (opsys === 'linux') {
  //serverOption.browserRevision = '737027' 
  serverOption.browserRevision = '800071'
} else if (opsys === 'darwin') {
  serverOption.executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
}

const startServer = async () => {
  create(serverOption)
    .then(client => {
      console.log('[SERVER] Server Started!')
      client.onStateChanged(state => {
        console.log('[Client State]', state)
        if (state === 'CONFLICT') client.forceRefocus()
      })

      client.onMessage((message) => {
        msgHandler(client, message)
      })
    })
}

async function msgHandler (client, message) {
  try {
    const { type, body, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, chatId, Contact, author } = message
    const { pushname } = sender
    const { formattedTitle } = chat
    const time = moment(t * 1000).format('DD/MM HH:mm:ss')
    const commands = ['/info surah', '/surah', '/tafsir', '/audio', '/menu', '/jadwal', '/random ayat', 'assalamualaikum', 'aslmalaikum', 'asalamualaikum']
    const cmds = commands.map(x => x + '\\b').join('|')
    const cmd = type === 'chat' ? body.match(new RegExp(cmds, 'gi')) : type === 'image' && caption ? caption.match(new RegExp(cmds, 'gi')) : ''

    if (cmd) {
      !isGroupMsg ? console.log(color('[EXEC]'), color(time, 'yellow'), color(cmd[0]), 'from', color(pushname)) : console.log(color('[EXEC]'), color(time, 'yellow'), color(cmd[0]), 'from', color(pushname), 'in', color(formattedTitle))
      const args = body.trim().split(' ')
      const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi)
      switch (cmd[0].toLowerCase()) {
        case '/menu':
        case '/help':
          client.sendText(from, `Bismillah.. Halo *${pushname}*\n\nBerikut adalah menu yang bisa dipakai,\n\n*_/info surah <nama surah>_*\nMenampilkan informasi lengkap mengenai surah tertentu. Contoh penggunan: /info surah al-baqarah\n\n*_/surah <nama surah> <ayat>_*\nMenampilkan ayat Al-Qur'an tertentu beserta terjemahannya dalam bahasa Indonesia. Contoh penggunaan : /surah al-fatihah 1\n*_/surah <nama surah> <ayat> en_*\nMenampilkan ayat Al-Qur'an tertentu beserta terjemahannya dalam bahasa Inggris. Contoh penggunaan : /surah al-fatihah 1 en\n\n*_/tafsir <nama surah> <ayat>_*\nMenampilkan ayat Al-Qur'an tertentu beserta terjemahan dan tafsirnya dalam bahasa Indonesia. Contoh penggunaan : /tafsir al-fatihah 1\n\n*_/audio <nama surah>_*\nMenampilkan tautan dari audio surah tertentu. Contoh penggunaan : /audio al-fatihah\n*_/audio <nama surah> <ayat>_*\nMengirim audio surah dan ayat tertentu beserta terjemahannya dalam bahasa Indonesia. Contoh penggunaan : /audio al-fatihah 1\n*_/audio <nama surah> <ayat> en_*\nMengirim audio surah dan ayat tertentu beserta terjemahannya dalam bahasa Inggris. Contoh penggunaan : /audio al-fatihah 1 en\n\n*_/jadwal <kota(jika termasuk kota)> <nama kab/kota> <waktu/tanggal DD-M-YYYY(optional)> [Fitur ini tidak bisa digunakan untuk sementara]_*\nMenampilkan jadwal shalat untuk daerah harian tertentu dalam waktu tertentu. Contoh penggunaan:\nJika ingin menampilkan jadwal shalat di Kabupaten Tasikmalaya hari ini cukup ketik /jadwal tasikmalaya\nJika ingin menampilkan jadwal shalat di Kota Tasikmalaya hari ini cukup ketik /jadwal kota tasikmalaya\nJika ingin menambahkan keterangan waktu di akhir ketikkan tanggal-bulan-tahun, contoh: /jadwal tasikmalaya 23-9-2020\n\n*_/random ayat_*\nMenampilkan ayat tertentu secara random beserta terjemahannya dalam bahasa Indonesia.\n*_/random ayat en_*\nMenampilkan ayat tertentu secara random beserta terjemahannya dalam bahasa Inggris. \n\nCatatan: Perintah diawali dengan prefiks garing (/). Pastikan juga ketika mengetik nama surah menggunakan tanda hubung (-)\n`)
          break
        case '/info surah':
          if (body.length > 12) {
            const response = await axios.get('https://api.quran.sutanlab.id/surah')
            const { data } = response.data
            var idx = data.findIndex(function(post, index) {
              if((post.name.transliteration.id.toLowerCase() == args[2].toLowerCase())||(post.name.transliteration.en.toLowerCase() == args[2].toLowerCase()))
                return true;
            });
            var pesan = ""
            pesan = pesan + "Nama : "+ data[idx].name.transliteration.id + "\n" + "Asma : " +data[idx].name.short+"\n"+"Arti : "+data[idx].name.translation.id+"\n"+"Jumlah ayat : "+data[idx].numberOfVerses+"\n"+"Nomor surah : "+data[idx].number+"\n"+"Jenis : "+data[idx].revelation.id+"\n"+"Keterangan : "+data[idx].tafsir.id
            client.sendText(from, pesan)
        }
          break
        case '/surah':
          if (body.length > 6) {
            const response = await axios.get('https://api.quran.sutanlab.id/surah')
            const { data } = response.data
            var idx = data.findIndex(function(post, index) {
              if((post.name.transliteration.id.toLowerCase() == args[1].toLowerCase())||(post.name.transliteration.en.toLowerCase() == args[1].toLowerCase()))
                return true;
            });
            nmr = data[idx].number
            if(!isNaN(nmr)) {
              const responsi2 = await axios.get('https://api.quran.sutanlab.id/surah/'+nmr+"/"+args[2])
              const {data} = responsi2.data
              var last = function last(array, n) {
                if (array == null) return void 0;
                if (n == null) return array[array.length - 1];
                return array.slice(Math.max(array.length - n, 0));
              };
              bhs = last(args)
              pesan = ""
              pesan = pesan + data.text.arab + "\n\n"
              if(bhs == "en") {
                pesan = pesan + data.translation.en
              } else {
                pesan = pesan + data.translation.id
              }
              pesan = pesan + "\n\n(Q.S. "+data.surah.name.transliteration.id+":"+args[2]+")"
              client.sendText(from, pesan)
            }
          }
          break
        case '/tafsir':
          if (body.length > 7) {
            const respons = await axios.get('https://api.quran.sutanlab.id/surah')
            const {data} = respons.data
            var idx = data.findIndex(function(post, index) {
              if((post.name.transliteration.id.toLowerCase() == args[1].toLowerCase())||(post.name.transliteration.en.toLowerCase() == args[1].toLowerCase()))
                return true;
            });
            nmr = data[idx].number
            if(!isNaN(nmr)) {
              const responsi = await axios.get('https://api.quran.sutanlab.id/surah/'+nmr+"/"+args[2])
              const {data} = responsi.data
              pesan = ""
              pesan = pesan + "Tafsir Q.S. "+data.surah.name.transliteration.id+":"+args[2]+"\n\n"
              pesan = pesan + data.text.arab + "\n\n"
              pesan = pesan + "_" + data.translation.id + "_" + "\n\n" +data.tafsir.id.long
              client.sendText(from, pesan)
          }
        }
          break
        case '/audio':
          ayat = "ayat"
          bhs = ""
          if (body.length > 6) {
            const response = await axios.get('https://api.quran.sutanlab.id/surah')
            const surah = response.data
            var idx = surah.data.findIndex(function(post, index) {
              if((post.name.transliteration.id.toLowerCase() == args[1].toLowerCase())||(post.name.transliteration.en.toLowerCase() == args[1].toLowerCase()))
                return true;
            });
            nmr = surah.data[idx].number
            if(!isNaN(nmr)) {
              if(args.length > 3) {
                ayat = args[2]
              }
              if (args.length == 3) {
                var last = function last(array, n) {
                  if (array == null) return void 0;
                  if (n == null) return array[array.length - 1];
                  return array.slice(Math.max(array.length - n, 0));
                };
                ayat = last(args)
              } 
              pesan = ""
              if(isNaN(ayat)) {
                const responsi2 = await axios.get('https://raw.githubusercontent.com/penggguna/QuranJSON/master/surah/'+nmr+'.json')
                const {name, name_translations, number_of_ayah, number_of_surah,  recitations} = responsi2.data
                pesan = pesan + "Audio Quran Surah ke-"+number_of_surah+" "+name+" ("+name_translations.ar+") "+ "dengan jumlah "+ number_of_ayah+" ayat\n"
                pesan = pesan + "Dilantunkan oleh "+recitations[0].name+" : "+recitations[0].audio_url+"\n"
                pesan = pesan + "Dilantunkan oleh "+recitations[1].name+" : "+recitations[1].audio_url+"\n"
                pesan = pesan + "Dilantunkan oleh "+recitations[2].name+" : "+recitations[2].audio_url+"\n"
                client.sendText(from, pesan)
              } else {
                const responsi2 = await axios.get('https://api.quran.sutanlab.id/surah/'+nmr+"/"+ayat)
                const {data} = responsi2.data
                var last = function last(array, n) {
                  if (array == null) return void 0;
                  if (n == null) return array[array.length - 1];
                  return array.slice(Math.max(array.length - n, 0));
                };
                bhs = last(args)
                pesan = ""
                pesan = pesan + data.text.arab + "\n\n"
                if(bhs == "en") {
                  pesan = pesan + data.translation.en
                } else {
                  pesan = pesan + data.translation.id
                }
                pesan = pesan + "\n\n(Q.S. "+data.surah.name.transliteration.id+":"+args[2]+")"
                await client.sendFileFromUrl(from, data.audio.secondary[0])
                await client.sendText(from, pesan)
              }
          }
          }
          break
        /*temporarily Deprecated
        case '/jadwal':
          if(body.length > 8) {
            kotanya = ""
            var last = function last(array, n) {
              if (array == null) return void 0;
              if (n == null) return array[array.length - 1];
              return array.slice(Math.max(array.length - n, 0));
            };
            waktu = last(args)
            if(args.length >= 2) {
              if((args[1] == "kota")) {
                for (let index = 2; index < args.length; index++) {
                  if(index < args.length - 1) {
                    kotanya = kotanya + args[index] + "+"
                  } else {
                    kotanya = kotanya + args[index]
                  }
                }
                const response = await axios.get('https://api.banghasan.com/sholat/format/json/kota/nama/'+kotanya)
                const { kota } = response.data
                var idx = kota.findIndex(function(post, index) {
                  if(post.nama.toLowerCase() == "kota"+" "+kotanya)
                    return true;
                });
                lokasi = kota[idx].id
                namalokasi = kota[idx].nama
              } else {
                if((waktu == "besok" || waktu == "enjing") || (waktu == "isuk" || waktu == "isukan") || (waktu == "kemarin" || waktu == "kemaren") || (waktu.includes('-') || waktu == "kamari")) {
                  for (let index = 1; index < args.length-1; index++) {
                    if(index < args.length - 2) {
                      kotanya = kotanya + args[index] + "+"
                    } else {
                      kotanya = kotanya + args[index]
                    }
                  }
                } else {
                  for (let index = 1; index < args.length; index++) {
                    if(index < args.length - 1) {
                      kotanya = kotanya + args[index] + "+"
                    } else {
                      kotanya = kotanya + args[index]
                    }
                  }
                }
                kotanya = kotanya.toLowerCase()
                const response = await axios.get('https://api.banghasan.com/sholat/format/json/kota/nama/'+kotanya)
                const { kota } = response.data
                var idx = kota.findIndex(function(post, index) {
                  if(post.nama.toLowerCase() == kotanya)
                    return true;
                });
                lokasi = kota[idx].id
                namalokasi = kota[idx].nama
              }
              timestamp = Date.now();
              date_ob = new Date(timestamp);
              date = date_ob.getDate();
              month = date_ob.getMonth() + 1;
              year = date_ob.getFullYear();
              var last = function last(array, n) {
                if (array == null) return void 0;
                if (n == null) return array[array.length - 1];
                return array.slice(Math.max(array.length - n, 0));
              };
              waktu = last(args)
              if((waktu == "besok" || waktu == "enjing") || (waktu == "isuk" || waktu == "isukan")) {
                date = parseInt(date) + 1
              } else if((waktu == "kemarin" || waktu == "kemaren") || waktu == "kamari") {
                date = parseInt(date) - 1
              } else if(waktu.includes('-')) {
                waktu = waktu.trim().split('-')
                date = waktu[0]
                month = waktu[1]
                year = waktu[2]
              }
              if(month < 10 ) {
                month = "0" + String(month)
              }
              if(date < 10 ) {
                date = "0" + String(date)
              }
              const respons = await axios.get('https://api.banghasan.com/sholat/format/json/jadwal/kota/'+lokasi+'/tanggal/'+year+'-'+month+'-'+date)
              const { jadwal } = respons.data
              pesan = "Jadwal Shalat " + namalokasi +"\n"+"Tanggal : "+jadwal.data.tanggal+"\n"+"imsak : "+jadwal.data.imsak+"\n"+"terbit : "+jadwal.data.terbit+"\n"+"subuh : "+jadwal.data.subuh+"\n"+"dhuha : "+jadwal.data.dhuha+"\n"+"dzuhur : "+jadwal.data.dzuhur+"\n"+"ashar : "+jadwal.data.ashar+"\n"+"maghrib : "+jadwal.data.maghrib+"\n"+"isya : "+jadwal.data.isya+"\n"
              await client.sendText(from, pesan)
            }
            
          }
          break
          */
        case '/random ayat':
          if (body.length > 6) {
            const response = await axios.get('https://api.quran.sutanlab.id/surah')
            const { data } = response.data
            nmr = Math.floor(Math.random() * 115);
            maks = data[nmr-1].numberOfVerses
            ayat = Math.floor(Math.random() * maks) + 1;
            if(!isNaN(nmr)) {
              const responsi2 = await axios.get('https://api.quran.sutanlab.id/surah/'+nmr+"/"+ayat)
              const {data} = responsi2.data
              var last = function last(array, n) {
                if (array == null) return void 0;
                if (n == null) return array[array.length - 1];
                return array.slice(Math.max(array.length - n, 0));
              };
              bhs = last(args)
              pesan = ""
              pesan = pesan + data.text.arab + "\n\n"
              if(bhs == "en") {
                pesan = pesan + data.translation.en
              } else {
                pesan = pesan + data.translation.id
              }
              pesan = pesan + "\n\n(Q.S. "+data.surah.name.transliteration.id+":"+ayat+")"
              client.sendText(from, pesan)
            }
          }
          break
          case 'assalamualaikum':
          case 'aslmalaikum': 
          case 'asalamualaikum':
            client.sendText(from, "Waalaikumussalam Warahmatullahi Wabarakatuh")
          break
        }
    } else {
      !isGroupMsg ? console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname)) : console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname), 'in', color(formattedTitle), color(chatId), color(author))
    }
  } catch (err) {
    console.log(color('[ERROR]', 'red'), err)
  }
}

process.on('Something went wrong', function (err) {
  console.log('Caught exception: ', err)
})

startServer()
