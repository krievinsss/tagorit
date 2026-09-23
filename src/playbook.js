export const package399={
 price:399,
 pages:"Līdz 5 lapām/sadaļām",
 language:"1 valoda",
 includes:["Responsīvs dizains","Esošā satura pārnešana līdz 5 lapām","Kontaktforma","Pamata SEO","Publicēšana uz klienta esošā domēna","Esošā domēna pieslēgšana/migrācijas tehniskais darbs","2 apkopoti labojumu cikli"],
 excludes:["E-veikals / WooCommerce","Booking vai rezervāciju sistēma","Online maksājumi","Lietotāju konti un datubāzes","API un custom integrācijas","Sarežģīti kalkulatori","Profesionāls copywriting vai fotografēšana","Papildu valodas","Hostings, jaunas domēna izmaksas un maksas licences/spraudņi"],
 contentRule:"Esošais saturs tiek pārnests un noformatēts saprātīgā apjomā; pilnīga tekstu pārrakstīšana vai jauna satura izstrāde nav iekļauta.",
 timeline:"Orientējoši 3–7 darba dienas pēc priekšapmaksas un visu nepieciešamo materiālu saņemšanas."
};

export const businessRules={
 leadOwnership:"Lead pieder tam partnerim, kurš to pirmais korekti reģistrējis Tagorit. Dublikātu pārņemt nedrīkst.",
 inactivity:"Ja 14 dienas nav aktivitātes, Team Lead var pārņemt sava tiešā apakšpartnera lead, bet admins var to pārdalīt.",
 commission:"Sales Partner standarta komisija ir 50 € par klientu tikai pēc reāli saņemtas priekšapmaksas.",
 override:"Team Lead saņem 10 € tikai par sava tiešā apakšpartnera apmaksātu klientu. Par dziļākiem līmeņiem override nav.",
 payouts:"Komisijas tiek apkopotas un izmaksātas 1× mēnesī. Līdz izmaksai tās ir Pending.",
 refund:"Ja priekšapmaksa tiek pilnībā atmaksāta pirms darba sākšanas, neizmaksātā komisija kļūst Void; ja komisija jau izmaksāta, korekcija tiek veikta nākamajā izmaksā.",
 invoice:"Jebkurš klients pirms maksājuma tiek nodots Tomam. Rēķinu Toms izsūta manuāli; partneris pats rēķinus nesūta."
};

export const playbookTutorial=[
{
 id:"lead-hunting",stage:"1. Lead hunting",title:"Atrodi uzņēmumus, kuriem redesign tiešām var palīdzēt",
 summary:"Mērķis nav savākt pēc iespējas vairāk nejaušu kontaktu. Meklē uzņēmumus, kuriem ir redzama problēma un kuriem 399 € piedāvājums ir saprotams un reālistisks.",
 bullets:[
  "Prioritāte: aktīvs uzņēmums ar vecu, neērtu, lēnu vai mobilajā versijā problemātisku mājaslapu.",
  "Labs kandidāts ir uzņēmums, kura pakalpojums ir skaidrs un kam mājaslapa var palīdzēt saņemt vairāk zvanu, pieteikumu vai uzticības.",
  "Izvairies no mirušiem uzņēmumiem, projektiem bez kontaktinformācijas un uzņēmumiem, kuriem acīmredzami vajag lielu custom sistēmu.",
  "Pirms kontakta pārbaudi uzņēmuma mājaslapu un publiskos profilus, lai saprastu, vai uzņēmums joprojām darbojas."
 ],
 checklist:["Uzņēmums darbojas","Ir derīgs e-pasts vai telefons","Ir konkrēts iemesls redesignam","Tagorit nav dublikāta"],
 action:"Izveido klienta ierakstu Tagorit ar uzņēmuma nosaukumu, mājaslapu, kontaktu, pilsētu un īsu piezīmi, kas lapā ir vāji.",
 status:"NEW",
 avoid:["Nesūti nejaušus masveida copy-paste e-pastus.","Neizdomā problēmas, kuras neesi redzējis.","Neņem cita partnera klientu."]
},
{
 id:"audit",stage:"2. Ātrais audits",title:"Izvērtē esošo mājaslapu 5–10 minūtēs",
 summary:"Atrodi 2–5 konkrētas lietas, ko klients pats sapratīs un ko mockup var parādīt vizuāli.",
 bullets:[
  "Pirmais iespaids: vai 5 sekundēs ir skaidrs, ko uzņēmums dara un kā ar viņiem sazināties?",
  "Mobilā versija: vai teksts, pogas, navigācija un kontaktinformācija ir ērti lietojama telefonā?",
  "CTA: vai ir skaidras pogas — Zvanīt, Pieteikties, Saņemt piedāvājumu?",
  "Uzticība: atsauksmes, reāli foto, uzņēmuma apraksts, rekvizīti, kontakti.",
  "Vizuālais: pārāk daudz krāsu, novecojis fonts, pārblīvēts saturs, slikta informācijas hierarhija."
 ],
 checklist:["Pierakstīti 2–5 reāli uzlabojumi","Ir skaidrs galvenais CTA","Ir saprotams, ko redesign demonstrēs"],
 action:"Piezīmēs ieraksti īsu auditu, piemēram: 'Mobilajā nav skaidra CTA, novecojis hero, kontakti paslēpti footerī.'",
 status:"NEW",
 avoid:["Nesaki klientam, ka lapa ir 'briesmīga'.","Nesoli konkrētu pārdošanas vai SEO rezultātu."]
},
{
 id:"mockup",stage:"3. Mockup",title:"Uztaisi vizuālu piemēru, kas pārdod ideju",
 summary:"Mockup nav gala produkts. Tam jāparāda skaidrs pirms/pēc efekts un jāizskatās pietiekami reāli, lai klients saprastu virzienu.",
 bullets:[
  "Saglabā uzņēmuma būtību: logo, nozari, pakalpojumus un galveno kontaktu.",
  "Uztaisi tīru hero ar skaidru virsrakstu un vienu galveno CTA.",
  "Parādi 2–4 svarīgākās sadaļas: pakalpojumi, ieguvumi, atsauksmes, kontakti.",
  "Ja uzņēmumam ir specifiska funkcija, vari to vizuāli parādīt, bet nesoli, ka tā ietilpst 399 €, ja tas ir custom."
 ],
 checklist:["Mockup izskatās pēc konkrētā uzņēmuma","Nav izdomātas cenas/fakti","Kontaktinformācija nav sajaukta","Attēls pievienots klienta profilam"],
 action:"Pievieno mockup klienta profilā un nomaini statusu uz Mockup gatavs.",
 status:"MOCKUP READY",
 avoid:["Nelieto cita uzņēmuma logo vai atsauksmes.","Neizdomā neesošus sertifikātus, partnerus vai pieredzes gadus."]
},
{
 id:"first-contact",stage:"4. Pirmā uzruna",title:"Raksti īsi, konkrēti un bez spama sajūtas",
 summary:"Pirmajā ziņā mērķis nav noslēgt visu projektu. Mērķis ir panākt, lai cilvēks apskata mockup un atbild.",
 bullets:[
  "Pirmajā teikumā parādi, ka tiešām apskatīji tieši viņu uzņēmumu.",
  "Nosauc vienu konkrētu iemeslu, ko pamanīji.",
  "Pasaki, ka uztaisīji redesign piemēru.",
  "Cena 399 € var būt norādīta uzreiz, lai filtrētu neatbilstošu budžetu.",
  "Noslēdz mierīgi — bez spiediena."
 ],
 checklist:["Personalizēts konteksts","Pievienots mockup/link","Nav drukas kļūdu","Statuss pēc nosūtīšanas nomainīts"],
 action:"Reģistrē e-pastu saziņas vēsturē, statusu uz Sazināts un follow-up pēc 3–4 dienām.",
 status:"CONTACTED",
 avoid:["Neraksti 'garantējam vairāk klientu'.","Nesūti vairākas ziņas vienā dienā.","Nestrīdies, ja cilvēks atsaka."]
},
{
 id:"followup",stage:"5. Follow-up",title:"Atgādini, bet nespamo",
 summary:"Viena vai divas pieklājīgas follow-up ziņas ir normālas. Pēc tam sarunu aizver.",
 bullets:[
  "Follow-up #1 pēc aptuveni 3–4 darba dienām.",
  "Ja nav atbildes, follow-up #2 vari sūtīt vēl pēc 5–7 dienām.",
  "Otrajā follow-up vari skaidri pateikt: ja nav aktuāli, viss kārtībā.",
  "Ja cilvēks skaidri pasaka 'neinteresē', vairs neraksti."
 ],
 checklist:["Klients nav atbildējis citā kanālā","Nav nosūtīti vairāki follow-up vienā dienā","Atjaunināts next follow-up"],
 action:"Ja pēc 2 follow-up nav reakcijas un ir telefona numurs, pārej uz vienu kvalitatīvu telefona zvanu. Ja numura nav vai pēc zvana nav kontakta, vari aizvērt kā 'No response'.",
 status:"CONTACTED",
 avoid:["Nesūti katru dienu.","Neizmanto vainas sajūtu vai agresīvu tekstu.","Pēc vairākiem e-pastiem nezvani atkārtoti katru dienu."]
},
{
 id:"phone-call",stage:"6. Telefona zvans",title:"Pēc e-pastiem vari izdarīt vienu kvalitatīvu zvanu",
 summary:"Zvans ir pēdējais outreach slānis, nevis agresīva vajāšana. Tā mērķis ir īsi atgādināt par nosūtīto redesign piemēru, noskaidrot, vai cilvēks to redzēja, un saprast, vai vispār ir interese.",
 bullets:[
  "Pirms zvana atver klienta profilu un pārlasi, ko nosūtīji, uzņēmuma nosaukumu, mājaslapu un konkrēto problēmu, ko pamanīji.",
  "Sāc ar savu vārdu, īsu kontekstu un pajautā, vai cilvēkam ir 30 sekundes. Nesāc ar garu pārdošanas monologu.",
  "Piemini, ka iepriekš nosūtīji e-pastu ar konkrētam uzņēmumam sagatavotu mājaslapas redesign piemēru.",
  "Galvenais jautājums: vai viņi to redzēja un vai mājaslapas modernizācija viņiem vispār šobrīd ir aktuāla.",
  "Ja saka 'atsūtiet e-pastā', nepārdod pa telefonu — pārbaudi pareizo e-pastu un nosūti īsu ziņu atkārtoti.",
  "Ja ir interese, noskaidro tikai svarīgāko: vai runa ir par esošās lapas modernizāciju un vai vajag kādas papildu funkcijas.",
  "Ja sākas tehniski jautājumi, custom funkcijas, atlaides vai rēķins — apsoli tikai to, ka nodosi Tomam.",
  "Ja cilvēks skaidri atsaka, pateicies un zvanu beidz. Atkārtoti vairs nezvani."
 ],
 checklist:["Atvērts klienta profils","Zini, kuru e-pastu/mockup nosūtīji","Zini uzņēmuma nosaukumu un galveno argumentu","Pēc zvana pierakstīts rezultāts CRM"],
 action:"Interese → REPLIED/INTERESTED. Tehnisks vai gatavs klients → READY FOR TOM. Skaidrs atteikums → LOST. Neatbildēja → pieraksti zvana mēģinājumu; neveido bezgalīgu zvanu ciklu.",
 status:"CONTACTED",
 avoid:["Neizliecies, ka zvans ir par kaut ko citu.","Nesāc strīdēties, ja cilvēks saka, ka nav ieinteresēts.","Nezvani atkārtoti vairākas reizes dienā.","Neprasi maksājumu vai nesūti rēķinu — to dara Toms."]
},
{
 id:"qualification",stage:"7. Kvalificē interesi",title:"Saprot, vai tas ir standarta 399 € projekts vai custom",
 summary:"Pozitīva atbilde vēl nav darījums. Tavs uzdevums ir savākt pietiekami daudz informācijas, lai saprastu, vai vari turpināt pats vai jānodod Tomam.",
 bullets:[
  "Noskaidro: vai esošais saturs paliek, vai ir logo/bildes, cik valodas, vai ir īpašas funkcijas.",
  "Ja prasības paliek vienkāršas — vari turpināt ar standarta 399 € piedāvājumu.",
  "Ja parādās e-veikals, booking, maksājumi, lietotāju profili, API, datubāzes vai custom kalkulatori — nodod Tomam.",
  "Pieraksti visu klienta profilā, lai handoff nav jāstāsta no nulles."
 ],
 checklist:["Saprotams aptuvenais scope","Pierakstītas prasības","Nav apsolīta custom cena","Statuss atjaunināts"],
 action:"Standarta interese → INTERESTED. Custom/tehniska saruna → READY FOR TOM.",
 status:"INTERESTED",
 avoid:["Nesoli custom funkciju 399 € cenā.","Nesoli custom termiņu bez Toma apstiprinājuma."]
},
{
 id:"price",stage:"8. Cena un iebildumi",title:"Skaidro 399 € paketi un netaisi patvaļīgas atlaides",
 summary:"Cena jāpasniedz kā skaidrs paketes apjoms. Partnera darbs ir izskaidrot piedāvājumu, nevis improvizēt ar cenām.",
 bullets:[
  "399 € = standarta uzņēmuma mājaslapas modernizācija līdz 5 lapām/sadaļām un 1 valodā.",
  "Standartā: responsīvs dizains, esošā satura pārnešana, kontaktforma, pamata SEO, publicēšana uz esošā domēna un 2 labojumu cikli.",
  "Hostings, papildu valodas, maksas licences un custom funkcijas tiek rēķinātas atsevišķi.",
  "Ja klients grib atlaidi vai citu cenu, nesoli — nodod Tomam."
 ],
 checklist:["Klients saprot, kas ir iekļauts","Nav apsolītas papildfunkcijas","Atlaide nav dota bez saskaņošanas"],
 action:"Ja klients piekrīt piedāvājumam, aizpildi handoff kopsavilkumu un atzīmē READY FOR TOM. Toms pats nosūtīs rēķinu. Ja scope/cena ir nestandarta, arī nodod Tomam.",
 status:"INTERESTED",
 avoid:["Nesoli atlaidi bez atļaujas.","Neatklāj citu klientu cenas vai iekšējos nosacījumus."]
},
{
 id:"handoff",stage:"9. Handoff",title:"Jebkurš klients pirms maksājuma nonāk pie Toma",
 summary:"Neatkarīgi no tā, vai tas ir standarta 399 € projekts vai custom darbs, pirms rēķina un priekšapmaksas klients obligāti tiek nodots Tomam.",
 bullets:[
  "Pirms handoff klienta profilā jābūt kontaktam, skaidram prasību/sarunas kopsavilkumam un laukam, ko tieši klientam esi apsolījis.",
  "Ja nekas papildus nav solīts, ieraksti tieši: 'Nekas papildus nav solīts'.",
  "Standarta klientam Toms pārbauda scope un manuāli nosūta rēķinu.",
  "Custom klientam Toms vajadzības gadījumā vispirms sarunā Google Meet, tad sagatavo cenu/rēķinu.",
  "Partneris pats rēķinu nesūta un pēc handoff nemaina nosacījumus bez Toma."
 ],
 checklist:["Ir prasību kopsavilkums","Ir kontaktinformācija","Ir zināms, ko klients grib","Nav pretrunīgu solījumu"],
 action:"Nomaini statusu uz Gatavs pārņemšanai. No šī brīža Toms pārņem rēķinu un maksājuma procesu; tu seko rezultātam un iesaisties tikai tad, ja Toms to palūdz.",
 status:"READY FOR TOM",
 avoid:["Nenodod klientu bez konteksta.","Neatzīmē READY FOR TOM uz katru vienkāršu jautājumu."]
},
{
 id:"deposit",stage:"10. Priekšapmaksa = STOP",title:"Kad priekšapmaksa saņemta, tavs darbs ar klientu ir pabeigts",
 summary:"Komisija un veiksmīgs darījums tiek fiksēts tikai tad, kad Toms ir manuāli nosūtījis rēķinu un reāli saņēmis priekšapmaksu. Pēc tam viss projekta darbs ir tikai Toma pusē.",
 bullets:[
  "Pozitīva sarakste nav komisija — vajadzīga reāli saņemta priekšapmaksa.",
  "Toms vispirms atzīmē Rēķins nosūtīts, un tikai pēc reālas naudas saņemšanas — DEPOSIT PAID.",
  "No šī brīža materiālus, izstrādi, labojumus, gala apmaksu, publicēšanu un uzturēšanu vada Toms.",
  "Partnerim pēc priekšapmaksas nav jāvada klients un nav jāuzņemas projekta vadītāja loma.",
  "Sales Partner komisija ir 50 €; Team Lead saņem 10 € override tikai par sava tiešā apakšpartnera apmaksātu klientu.",
  "Komisijas tiek apkopotas izmaksai vienu reizi mēnesī."
 ],
 checklist:["Priekšapmaksa tiešām saņemta/apstiprināta","CRM pieraksti ir pilni","Toms redz klienta kontekstu","Tu vairs nesoli projekta detaļas klientam"],
 action:"Pēc DEPOSIT PAID tavs darbs ar šo klientu ir pabeigts. Turpmāk seko tikai savai komisijai sistēmā.",
 status:"DEPOSIT PAID",
 avoid:["Nevāc materiālus klientam pēc priekšapmaksas, ja Toms to nav īpaši lūdzis.","Nevadi labojumus vai launch.","Neapsoli termiņus, papildfunkcijas vai uzturēšanu Toma vietā."]
}
];

export const salesSituations=[
{cat:"Interese",title:"Klients: “Jā, izskatās interesanti”",what:"Pozitīva atbilde, bet vēl nav skaidrs scope.",do:["Pateicies par atbildi.","Uzdod 3–4 īsus jautājumus par saturu, valodām un funkcijām.","Ja standarta scope — turpini ar 399 € paketi.","Ja custom — READY FOR TOM."],dont:["Neuzreiz prasi apmaksu bez prasību saprašanas.","Nesāc tehnisku konsultāciju, ja nezini atbildi."],status:"INTERESTED"},
{cat:"Cena",title:"Klients: “Cik tas maksā?”",what:"Klients grib ātru, skaidru atbildi.",do:["Ja standarta lapa — pasaki 399 € un kas ietilpst.","Ja prasības nav zināmas, pasaki 'ja paliekam pie standarta varianta'.","Custom funkcijām nepiedāvā minējumu."],dont:["Neraksti cenu diapazonu custom projektam no galvas.","Nesāc attaisnot cenu."],status:"INTERESTED"},
{cat:"Cena",title:"Klients: “Par dārgu”",what:"Nav automātiski jāmet atlaide.",do:["Pajautā, vai problēma ir budžets vai tas, ka nav skaidra vērtība.","Vari piedāvāt samazinātu scope, piemēram, vienas lapas variantu, ja admins to apstiprina.","Saglabā profesionālu toni."],dont:["Nemet cenu uz 250 € tikai, lai dabūtu klientu.","Nestrīdies par to, cik 'patiesībā maksā mājaslapas'."],status:"INTERESTED"},
{cat:"Cena",title:"Klients: “Var lētāk?”",what:"Atlaide nav partnera lēmums.",do:["Pasaki, ka 399 € ir fiksētā standarta paketes cena.","Ja vajag zemāku budžetu, var samazināt scope.","Ja klients grib nestandarta cenu — nodod Tomam."],dont:["Nesoli atlaidi bez admina atļaujas.","Nemainīt cenu privāti ārpus sistēmas."],status:"INTERESTED"},
{cat:"Atteikums",title:"Klients: “Nav aktuāli”",what:"Normāls atteikums.",do:["Pateicies par atbildi.","Ja tonis ir pozitīvs, vari pateikt, ka var sazināties vēlāk.","Atzīmē LOST vai piezīmē 'not now' atkarībā no konteksta."],dont:["Nemēģini pārliecināt 5 ziņās.","Nejautā agresīvi 'kāpēc?'."],status:"LOST"},
{cat:"Atteikums",title:"Klients: “Mums jau ir savs cilvēks/aģentūra”",what:"Neuzbrūc esošajam pakalpojuma sniedzējam.",do:["Pasaki, ka saproti.","Vari pieminēt, ka mockup droši var paturēt idejām.","Noslēdz sarunu pieklājīgi."],dont:["Nesaki, ka viņu esošais izstrādātājs ir slikts.","Nemēģini pārvilināt ar nepatiesiem apgalvojumiem."],status:"LOST"},
{cat:"Atbilde",title:"Klients prasa portfolio",what:"Viņš pārbauda uzticamību.",do:["Nosūti tikai reālus piemērus, kurus drīkst rādīt.","Īsi paskaidro, kas konkrētajā projektā darīts.","Ja portfolio vēl mazs, fokusējies uz konkrēto mockup un procesu."],dont:["Neuzdod svešus darbus par saviem.","Neizdomā klientu atsauksmes."],status:"REPLIED"},
{cat:"Atbilde",title:"Klients prasa, kas jūs esat",what:"Bieži normāla uzticamības pārbaude.",do:["Īsi paskaidro Tagorit modeli un ka tehnisko izstrādi realizē Toms.","Ja vajag rekvizītus/rēķina informāciju, nodod adminam.","Neraksti romānu."],dont:["Neizdomā komandas izmēru vai birojus.","Neslēp, ka tā ir maza komanda, ja tas tiek jautāts."],status:"REPLIED"},
{cat:"Termiņš",title:"Klients: “Cik ātri varat?”",what:"Standarta projektam var dot orientieri, custom — nē.",do:["Standarta lapai saki 3–7 darba dienas pēc materiālu un priekšapmaksas saņemšanas.","Norādi, ka termiņš atkarīgs no materiāliem un labojumiem.","Custom → Toms."],dont:["Nesoli 'rīt būs gatavs', ja nav saskaņots.","Nedod custom termiņu no galvas."],status:"INTERESTED"},
{cat:"Custom",title:"Klients grib e-veikalu",what:"Tas ir ārpus standarta 399 € paketes.",do:["Pasaki, ka var realizēt.","Noskaidro aptuveno produktu skaitu, maksājumus, piegādi, valodas.","Atzīmē READY FOR TOM."],dont:["Nesaki, ka WooCommerce/e-veikals ietilpst 399 €.","Nedod precīzu cenu bez tehniskas izvērtēšanas."],status:"READY FOR TOM"},
{cat:"Custom",title:"Klients grib booking/pierakstu sistēmu",what:"Jānoskaidro, vai tā ir integrācija vai custom funkcija.",do:["Noskaidro, vai viņiem jau ir booking platforma.","Ja vajag integrēt esošu link/widget, pieraksti to.","Ja jātaisa sistēma no nulles — READY FOR TOM."],dont:["Nesoli custom booking par standarta cenu."],status:"READY FOR TOM"},
{cat:"Custom",title:"Klients grib online maksājumus",what:"Payment integrācija ir tehnisks scope.",do:["Noskaidro, ko tieši klienti pērks/maksās.","Pieraksti vēlamo maksājumu pakalpojumu, ja zināms.","Nodod Tomam."],dont:["Neprasi klientam bankas paroles.","Nesoli konkrētu gateway, kamēr nav izvērtēts."],status:"READY FOR TOM"},
{cat:"Custom",title:"Klients grib vairākas valodas",what:"Var būt vienkārši vai sarežģīti atkarībā no satura.",do:["Noskaidro valodas un vai tulkojumi jau ir gatavi.","Pieraksti aptuveno lapu/satura apjomu.","Ja neliela standarta lapa — gaidi Toma apstiprinājumu scope."],dont:["Nesoli neierobežotu tulkošanu.","Neuzņemies profesionāla tulkotāja lomu."],status:"INTERESTED"},
{cat:"Custom",title:"Klients grib API, CRM, datubāzi vai lietotāju kontus",what:"Tas jau ir custom web app darbs.",do:["Īsi pieraksti, ko sistēmai jāspēj izdarīt.","Neiedziļinies arhitektūrā ar klientu, ja tas nav tavs uzdevums.","READY FOR TOM."],dont:["Nesaki 'tas ir vienkārši'.","Nesoli cenu vai termiņu."],status:"READY FOR TOM"},
{cat:"Komunikācija",title:"Klients grib sazvanīties",what:"Ja runa ir par vienkāršu standarta lapu, vari kvalificēt; tehniskas prasības nodod.",do:["Sarunā konkrētu laiku.","Pirms zvana pārlasi klienta profilu.","Ja zvans kļūst tehnisks/custom — pieslēdz Tomu."],dont:["Neej zvanā nesagatavojies.","Nesoli to, ko pēc tam izstrāde nevar izpildīt."],status:"INTERESTED"},
{cat:"Komunikācija",title:"Klients neatbild pēc pozitīvas intereses",what:"Šis nav tas pats, kas cold follow-up.",do:["Pēc 2–3 darba dienām īsi pajautā, vai nepieciešama vēl kāda informācija.","Ja nav reakcijas vēl 5–7 dienas, nosūti pēdējo mierīgo follow-up.","Atstāj skaidru piezīmi CRM."],dont:["Neraksti katru dienu.","Neuzskati to par apmaksātu darījumu."],status:"INTERESTED"},
{cat:"Zvans",title:"Uzņēmums neatbild uz zvanu",what:"Viens neatbildēts zvans nav signāls zvanīt atkārtoti ik pēc stundas.",do:["Pieraksti zvana mēģinājumu CRM.","Ja ir balss pasts un vari atstāt īsu profesionālu ziņu, dari to vienu reizi.","Ja jau bijuši 2 follow-up e-pasti, neveido garu zvanu sēriju."],dont:["Nezvani 3–5 reizes vienā dienā.","Neizmanto vairākus numurus, lai panāktu atbildi."],status:"CONTACTED"},
{cat:"Zvans",title:"Atbild administrators vai sekretāre",what:"Mērķis ir nonākt pie cilvēka, kurš atbild par uzņēmuma mājaslapu, nevis mēģināt pārdot sekretārei.",do:["Īsi pasaki savu vārdu un ka nosūtīji konkrētam uzņēmumam mājaslapas redesign piemēru.","Pajautā, kurš pie viņiem atbild par mājaslapu vai mārketingu.","Ja lūdz atsūtīt e-pastu, pārbaudi pareizo adresi un pateicies."],dont:["Nemēģini apmānīt, ka zvans ir steidzams vai personīgs.","Nespied izpaust privātus kontaktus."],status:"CONTACTED"},
{cat:"Zvans",title:"Klients saka: “Atsūtiet man e-pastā”",what:"Tas nav atteikums, bet arī nav gatavs darījums.",do:["Pārbaudi, uz kuru e-pastu sūtīt.","Pasaki, ka pārsūtīsi īso redesign piemēru un 399 € standarta paketes informāciju.","Pēc zvana uzreiz nosūti e-pastu un pieraksti to CRM."],dont:["Neturpini 10 minūšu pitch, ja cilvēks skaidri lūdz e-pastu.","Neatzīmē INTERESTED tikai tāpēc, ka piekrita saņemt e-pastu."],status:"CONTACTED"},
{cat:"Zvans",title:"Klients saka: “Jā, redzēju, izskatās interesanti”",what:"Šeit vari pāriet no cold outreach uz kvalificēšanu.",do:["Pajautā, vai viņi grib modernizēt esošo lapu vai vajag arī jaunas funkcijas.","Īsi izskaidro 399 € standarta paketi.","Ja klientam reāli ir interese virzīties tālāk, pieraksti sarunas kopsavilkumu."],dont:["Neprasi kartes datus vai maksājumu.","Nesūti rēķinu pats."],status:"INTERESTED"},
{cat:"Zvans",title:"Klients pa telefonu uzreiz prasa cenu",what:"Atbildi īsi un nosacīti, nevis sāc minēt custom cenu.",do:["Pasaki: standarta uzņēmuma mājaslapas modernizācija ir 399 €.","Īsi nosauc galveno scope: līdz 5 lapām, 1 valoda, responsīvs dizains, kontaktforma, pamata SEO, publicēšana, 2 labojumu cikli.","Ja vajag papildfunkcijas, saki, ka cenu precizēs Toms."],dont:["Nesoli custom funkcijas 399 € cenā.","Nekaulējies pa telefonu bez saskaņošanas."],status:"INTERESTED"},
{cat:"Zvans",title:"Klients saka: “Man tagad nav laika”",what:"Respektē situāciju un padari nākamo soli ļoti vieglu.",do:["Pajautā, vai ērtāk ir nosūtīt īsu e-pastu un vairs netraucēt ar zvanu.","Ja viņš pats nosauc konkrētu laiku, pieraksti callback.","Ja konkrēta laika nav, atstāj komunikāciju e-pastā."],dont:["Neturpini pitch pēc tam, kad cilvēks pateicis, ka nevar runāt.","Neuzstāj uz callback laiku."],status:"CONTACTED"},
{cat:"Zvans",title:"Klients skaidri saka: “Neinteresē”",what:"Tas ir skaidrs STOP signāls.",do:["Pateicies par laiku.","Atzīmē LOST ar iemeslu.","Vairs neveic follow-up vai atkārtotus zvanus par šo piedāvājumu."],dont:["Nemēģini 'salauzt iebildumu' pēc skaidra atteikuma.","Neprasi, kāpēc viņš negrib, ja cilvēks nevēlas turpināt sarunu."],status:"LOST"},
{cat:"Process",title:"Klients grib sākt, bet nav materiālu",what:"Darījumu var nofiksēt, bet izstrāde iestrēgs bez satura.",do:["Nosūti vienu strukturētu materiālu sarakstu.","Pajautā, ko drīkst pārnest no esošās lapas.","Ja vajag copywriting/foto, atzīmē to kā papildus vajadzību."],dont:["Nesāc minēt faktus uzņēmuma vietā.","Nevelc ārā saturu no nejaušiem avotiem bez pārbaudes."],status:"DEPOSIT PAID"},
{cat:"Process",title:"Klients sūta labojumus pa vienam WhatsApp",what:"Jāsavāc vienā ciklā.",do:["Pieklājīgi palūdz visus aktuālos labojumus apvienot vienā ziņā.","Paskaidro, ka tā var ātrāk un precīzāk visu izdarīt.","Pieraksti, kurš cikls tas ir."],dont:["Nesāc skaitīt katru komatu kā atsevišķu ciklu.","Neļauj scope izplūst bezgalīgi."],status:"IN DEVELOPMENT"},
{cat:"Process",title:"Klients labojumos prasa jaunu funkciju",what:"Jauna funkcija nav parasts labojums.",do:["Atdali vizuālu/satura labojumu no jauna scope.","Pasaki, ka to var izdarīt, bet šī daļa jānovērtē atsevišķi.","Nodod Tomam, ja funkcija tehniska."],dont:["Neiekļauj custom funkciju bez maksas tikai tāpēc, ka klients to nosauca par labojumu."],status:"IN DEVELOPMENT"},
{cat:"Maksājumi",title:"Klients kavē atlikuma maksājumu",what:"Publicēšana nav jāsteidz pirms nosacījumu izpildes.",do:["Mierīgi atgādini, ka gala versija ir apstiprināta un publicēšana notiek pēc atlikuma apmaksas.","Ja ir neskaidrība par rēķinu, nodod adminam."],dont:["Nedraudi.","Nepublicē gala versiju, ja vien Toms nav devis citu norādi."],status:"IN DEVELOPMENT"},
{cat:"After-sale",title:"Klients pēc launch grib mazu teksta izmaiņu",what:"Var būt maintenance vai vienreizējs sīkdarbs.",do:["Ja ir aktīva uzturēšana un izmaiņa ietilpst limitā — pieraksti un nodod.","Ja uzturēšanas nav, noskaidro apjomu un nodod adminam."],dont:["Nesoli bezmaksas izmaiņas uz nenoteiktu laiku."],status:"WON"},
{cat:"After-sale",title:"Klients prasa, ko dod 30 €/mēn. uzturēšana",what:"Pārdod mieru un tehnisko pieskatīšanu, nevis 'neierobežotu darbu'.",do:["Skaidro backup, atjauninājumus, pamata drošības un pieejamības pieskatīšanu, nelielas izmaiņas definētā limitā.","Pasaki, ka lielas jaunas funkcijas tiek rēķinātas atsevišķi."],dont:["Nesaki 'par 30 € darīsim visu'."],status:"WON"},
{cat:"Riski",title:"Klients ir rupjš/agresīvs",what:"Nav jāuzvar strīdā.",do:["Saglabā mierīgu un īsu komunikāciju.","Ja saruna kļūst nepieņemama, pārtrauc un informē adminu.","Saglabā kontekstu CRM."],dont:["Neatbildi ar rupjību.","Nedraud un nepublicē saraksti publiski."],status:"REPLIED"},
{cat:"Riski",title:"Klients prasa darīt kaut ko aizdomīgu vai nelikumīgu",what:"Partneris neko neapstiprina uz vietas.",do:["Pasaki, ka vajag tehniski/juridiski izvērtēt prasību.","Nodod Tomam/adminam ar pilnu kontekstu."],dont:["Neapsoli realizāciju.","Neiesaki veidus, kā apiet noteikumus vai platformu ierobežojumus."],status:"READY FOR TOM"},
{cat:"Riski",title:"Atrodi, ka kolēģis jau kontaktējis to pašu uzņēmumu",what:"Dublikāts paliek pie pirmā reģistrētā partnera, ja adminam nav cita lēmuma.",do:["Nepārņem komunikāciju.","Paziņo Team Lead/adminam, ja ir neskaidrs gadījums."],dont:["Neraksti klientam no otra konta.","Nekopē kontaktu uz savu sarakstu."],status:"NEW"}
];

export const salesScripts=[
{cat:"Cold outreach",title:"Pirmais e-pasts — universālais",subject:"Maza ideja Jūsu mājaslapai",when:"Kad ir sagatavots personalizēts mockup.",text:`Sveiki!

Apskatījos Jūsu mājaslapu un pamanīju, ka dažas lietas varētu padarīt mūsdienīgākas un ērtākas, īpaši mobilajā versijā.

Intereses pēc uztaisīju arī nelielu redesign piemēru, kā Jūsu lapa varētu izskatīties tīrāk un profesionālāk:

[MOCKUP / DEMO LINKS]

Ja virziens patīk, šādu uzņēmuma mājaslapas modernizāciju varam pilnībā sagatavot un palaist par fiksētu cenu — 399 €.

Standarta paketē ietilpst responsīvs dizains, esošā satura pārnešana, kontaktforma, pamata SEO, publicēšana un 2 labojumu cikli.

Ja šobrīd nav aktuāli, viss kārtībā. :)`,next:"Statuss CONTACTED, follow-up pēc 3–4 darba dienām."},
{cat:"Cold outreach",title:"Pirmais e-pasts — īsais variants",subject:"Ideja Jūsu mājaslapai",when:"Ja uzņēmuma īpašniekam, visticamāk, vajag ļoti īsu ziņu.",text:`Sveiki!

Apskatījos Jūsu mājaslapu un uztaisīju nelielu redesign piemēru, kā to varētu padarīt modernāku un ērtāku telefonā.

[MOCKUP]

Ja virziens patīk, standarta uzņēmuma mājaslapas modernizācija ir 399 €.

Ja vēlaties, varu īsi izstāstīt, kas tieši cenā ietilpst.`,next:"Ja atbild — REPLIED/INTERESTED."},
{cat:"Cold outreach",title:"Pirmais e-pasts — nav savas mājaslapas",subject:"Mājaslapas ideja Jūsu uzņēmumam",when:"Uzņēmums ir aktīvs, bet mājaslapas nav.",text:`Sveiki!

Apskatījos Jūsu uzņēmumu un pamanīju, ka šobrīd klientiem nav īsti vienas skaidras vietas, kur apskatīt pakalpojumus, kontaktus un svarīgāko informāciju.

Uztaisīju nelielu piemēru, kā vienkārša un moderna mājaslapa Jūsu uzņēmumam varētu izskatīties:

[MOCKUP]

Šādu standarta uzņēmuma mājaslapu varam sagatavot par 399 €.

Ja virziens šķiet interesants, droši dodiet ziņu.`,next:"CONTACTED."},
{cat:"Follow-up",title:"Follow-up #1 pēc 3–4 dienām",subject:"Par mājaslapas piemēru",when:"Nav saņemta nekāda atbilde.",text:`Sveiki!

Tikai pacelšu iepriekšējo ziņu augstāk — vai sanāca apskatīt nosūtīto mājaslapas piemēru?

Ja ir interese, varu īsi izstāstīt, kā notiek pats izstrādes process un kas ietilpst 399 € paketē.

Paldies!`,next:"Ja klusums — vēl viens pēdējais follow-up pēc 5–7 dienām."},
{cat:"Follow-up",title:"Follow-up #2 — pēdējais",subject:"Par nosūtīto mājaslapas variantu",when:"Pēc pirmā follow-up vēl nav atbildes.",text:`Sveiki!

Pēdējo reizi uzrakstīšu par nosūtīto mājaslapas redesign piemēru.

Ja šobrīd mājaslapas uzlabošana nav aktuāla, viss kārtībā — vairs netraucēšu.

Ja tomēr gribat kādreiz pie šī atgriezties, droši saglabājiet manu kontaktu.

Lai veiksmīga diena!`,next:"Ja neatbild — LOST vai CONTACTED ar 'no response'."},
{cat:"Zvans",title:"Cold call pēc e-pastiem — pamata atklāšana",subject:"Telefona zvans",when:"Pēc cold e-pasta un 1–2 follow-up, ja nav atbildes un ir publiski pieejams uzņēmuma telefons.",text:`Sveiki! Te [VĀRDS].

Es Jums pirms kāda laika nosūtīju e-pastu ar nelielu mājaslapas redesign piemēru tieši Jūsu uzņēmumam.

Vai Jums ir kādas 30 sekundes? Gribēju tikai saprast, vai sanāca to redzēt un vai mājaslapas uzlabošana Jums vispār šobrīd ir aktuāla?`,next:"Ja redzēja un interesē → kvalificē. Ja lūdz e-pastu → pārsūti. Ja skaidri atsaka → LOST."},
{cat:"Zvans",title:"Ja atbild sekretāre / administrators",subject:"Telefona zvans",when:"Zvanu paceļ cilvēks, kurš, visticamāk, nepieņem lēmumu par mājaslapu.",text:`Sveiki! Te [VĀRDS].

Es Jūsu uzņēmumam nosūtīju nelielu mājaslapas redesign piemēru un gribēju īsi noskaidrot, kurš pie Jums parasti atbild par mājaslapu vai mārketinga jautājumiem.

Man nav nekas steidzams — vienkārši gribētu, lai piemērs nonāk pie pareizā cilvēka.`,next:"Ja iedod kopējo e-pastu vai vārdu — pieraksti CRM. Neprasi privātus kontaktus."},
{cat:"Zvans",title:"“Atsūtiet e-pastā”",subject:"Telefona zvans",when:"Cilvēks negrib runāt, bet piekrīt saņemt informāciju.",text:`Protams, nekādu problēmu.

Tikai pārbaudīšu — vai [E-PASTS] ir pareizā adrese?

Es tūlīt pārsūtīšu īso redesign piemēru un informāciju par standarta 399 € variantu. Tad varēsiet mierīgi apskatīties, kad ir laiks.`,next:"Nosūti e-pastu uzreiz pēc zvana. Statuss paliek CONTACTED, kamēr nav reālas intereses."},
{cat:"Zvans",title:"Klients ir ieinteresēts",subject:"Telefona zvans",when:"Cilvēks ir redzējis mockup un grib saprast nākamo soli.",text:`Super.

Lai saprastu, vai paliekam pie standarta 399 € varianta — Jūs gribat galvenokārt modernizēt esošo mājaslapu, vai ir arī kāda jauna funkcija, ko noteikti vajag?

Standarta variantā ir līdz 5 lapām, 1 valoda, responsīvs dizains, esošā satura pārnešana, kontaktforma, pamata SEO, publicēšana un 2 labojumu cikli.

Ja vajag ko specifiskāku, es visu pierakstīšu un nodošu Tomam, kurš precizēs tehnisko pusi.`,next:"Pieraksti prasības. Standarts → INTERESTED; custom/gatavs turpināt → READY FOR TOM."},
{cat:"Zvans",title:"Klients prasa rēķinu vai grib maksāt",subject:"Telefona zvans",when:"Klients pa telefonu saka, ka ir gatavs sākt.",text:`Super, tad es visu sarunas kopsavilkumu tūlīt nodošu Tomam.

Viņš pārbaudīs, ka viss scope ir korekts, un pats nosūtīs Jums rēķinu un maksājuma informāciju.

Es no savas puses pierakstīšu visu, ko šobrīd sarunājām, lai Jums nekas nav jāstāsta no jauna.`,next:"Aizpildi handoffSummary + promises un READY FOR TOM. Partneris rēķinu nesūta."},
{cat:"Zvans",title:"Klientam nav laika runāt",subject:"Telefona zvans",when:"Cilvēks paceļ, bet saka, ka ir aizņemts.",text:`Protams, saprotu.

Es tad nevilkšu garumā. Jums jau e-pastā ir nosūtīts redesign piemērs.

Vai labāk, lai es vienkārši pārsūtu to vēlreiz un Jūs apskatāties, kad ir laiks?`,next:"Ja pats piedāvā konkrētu callback laiku — pieraksti. Citādi turpini e-pastā."},
{cat:"Zvans",title:"Pieklājīgs STOP pēc atteikuma",subject:"Telefona zvans",when:"Klients skaidri pasaka, ka nav ieinteresēts.",text:`Skaidrs, paldies, ka pateicāt.

Tad noteikti vairāk netraucēšu par šo piedāvājumu.

Lai veiksmīga diena!`,next:"LOST. Vairs neveic follow-up par šo piedāvājumu."},
{cat:"Interese",title:"Klients atbild: “Interesē”",subject:"Re: mājaslapas piemērs",when:"Pirmais pozitīvais reply.",text:`Sveiki!

Super, prieks dzirdēt.

Lai varu saprast, vai paliekam pie standarta varianta, man pietiktu ar dažām lietām:

- vai gribat tikai esošās mājaslapas modernizāciju vai arī kādas jaunas funkcijas;
- vai esošais saturs paliek;
- vai ir pieejams logo un bildes;
- vai nepieciešama viena vai vairākas valodas.

Ja paliekam pie vienkāršas uzņēmuma mājaslapas modernizācijas, cena ir fiksēta — 399 €.

Ja ērtāk, varam arī sarunāt īsu zvanu.`,next:"INTERESTED; custom prasības → READY FOR TOM."},
{cat:"Interese",title:"Klients prasa tikai cenu",subject:"Re: mājaslapas izstrāde",when:"Klients raksta 'cik maksā?'.",text:`Ja paliekam pie tā, ko šobrīd redzam konceptā — moderna responsīva uzņēmuma mājaslapa, esošā satura pārnešana, kontaktforma, pamata SEO, publicēšana un 2 labojumu cikli — cena ir 399 €.

Ja nepieciešams e-veikals, booking, maksājumi vai cita custom funkcionalitāte, to novērtējam atsevišķi pēc prasībām.`,next:"INTERESTED."},
{cat:"Cena",title:"“Vai var lētāk?”",subject:"Re: cena",when:"Klients mēģina kaulēties par standarta paketi.",text:`399 € ir fiksētā cena standarta paketei.

Ja vajag iekļauties zemākā budžetā, varam paskatīties, vai iespējams samazināt darba apjomu, piemēram, uztaisīt vienkāršāku vienas lapas variantu.

Ja pastāstīsiet, kāds ir aptuvenais budžets un kas tieši ir svarīgākais, varu to nodot izstrādātājam izvērtēšanai.`,next:"Nestandarta cena → admin/Toms."},
{cat:"Cena",title:"“399 € ir par dārgu”",subject:"Re: mājaslapas piedāvājums",when:"Klients saka, ka cena ir par augstu.",text:`Saprotu.

399 € ir mūsu standarta paketes cena, kur jau ietilpst gan dizaina pielāgošana, responsīvā versija, esošā satura pārnešana, kontaktforma, pamata SEO, publicēšana un 2 labojumu cikli.

Ja galvenais ierobežojums ir budžets, varam paskatīties, vai projektu iespējams samazināt līdz vienkāršākam apjomam, nevis griezt nost kvalitāti no tā paša darba.`,next:"Ja ir konkrēts budžets, nodod adminam."},
{cat:"Custom",title:"Custom funkcijas",subject:"Par papildu funkcionalitāti",when:"E-veikals, booking, maksājumi, API, konti, datubāze utt.",text:`Jā, tādas iespējas arī piedāvājam.

Šeit jau vajadzētu precīzāk saprast nepieciešamo funkcionalitāti, tāpēc piedāvāju sarunāt īsu Google Meet ar mūsu izstrādātāju Tomu, kur varēsim iziet cauri prasībām un pateikt precīzu cenu un termiņu.

Es viņam pirms sarunas nodošu visu, ko jau esam pārrunājuši.`,next:"READY FOR TOM."},
{cat:"Custom",title:"E-veikala pieprasījums",subject:"Par e-veikala funkcionalitāti",when:"Klients grib produktu katalogu/pirkšanu.",text:`To noteikti var realizēt.

Lai Toms var sagatavoties sarunai, atsūtiet, lūdzu, aptuveni:
- cik produktu būs sākumā;
- vai vajag online maksājumus;
- vai vajag Omniva/DPD vai citu piegādi;
- cik valodās;
- vai produkti jau ir sagatavoti ar bildēm/aprakstiem.

Pēc tam visērtāk būtu īss Google Meet, jo e-veikals jau ir ārpus standarta 399 € mājaslapas paketes.`,next:"READY FOR TOM."},
{cat:"Custom",title:"Booking/pieraksts",subject:"Par pieraksta funkciju",when:"Klients grib rezervācijas.",text:`Jā, pieraksta funkciju varam pieslēgt vai izstrādāt.

Lai saprastu vienkāršāko risinājumu, vajadzētu zināt, vai Jums jau ir kāda pieraksta sistēma, piemēram, Calendly vai nozares platforma, vai arī nepieciešams pilnīgi savs risinājums.

Šo daļu vislabāk īsi izrunāt ar Tomu, jo cena būs atkarīga no tā, cik daudz funkcionalitātes vajag.`,next:"READY FOR TOM."},
{cat:"Custom",title:"Vairākas valodas",subject:"Par mājaslapas valodām",when:"Klients grib LV/EN/RU u.c.",text:`Jā, vairākas valodas varam realizēt.

Atsūtiet, lūdzu:
- kādas valodas vajadzīgas;
- vai tulkojumi jau ir gatavi;
- vai visās valodās būs vienāds saturs.

Tad varēsim pateikt, vai tas iekļaujas vienkāršā variantā vai jāpieliek papildu darbs.`,next:"Pieraksti prasības; vajadzības gadījumā admin review."},
{cat:"Uzticība",title:"Portfolio pieprasījums",subject:"Daži darbu piemēri",when:"Klients grib redzēt iepriekšējos darbus.",text:`Protams.

Te ir daži reāli projektu piemēri:

[PORTFOLIO LINK 1]
[PORTFOLIO LINK 2]
[PORTFOLIO LINK 3]

Konkrēti Jūsu gadījumā nosūtītais mockup ir domāts kā virziena piemērs — gala versiju pielāgojam Jūsu saturam, bildēm un vajadzībām.`,next:"Izmanto tikai apstiprinātus portfolio linkus."},
{cat:"Uzticība",title:"“Kas jūs esat?”",subject:"Par mums",when:"Klients grib saprast, kas stāv aiz piedāvājuma.",text:`Es darbojos Tagorit pārdošanas komandā un palīdzu uzņēmumiem ar sākotnējo mājaslapas izvērtēšanu un redesign konceptiem.

Pašu tehnisko izstrādi un projekta realizāciju vada Toms, mūsu izstrādātājs.

Ja gribat, varu savienot Jūs ar viņu arī īsā Google Meet, lai varat izrunāt tehnisko pusi pirms lēmuma.`,next:"Nesagudro papildu faktus par uzņēmumu/komandu."},
{cat:"Termiņš",title:"“Cik ātri būs gatavs?”",subject:"Par izstrādes termiņu",when:"Standarta projekta termiņa jautājums.",text:`Ja visi materiāli ir pieejami un nav sarežģītu papildfunkciju, standarta mājaslapai parasti rēķinām aptuveni 3–7 darba dienas no priekšapmaksas un materiālu saņemšanas.

Ja projektā ir papildu funkcionalitāte, termiņu Toms precizēs pēc prasību izvērtēšanas.`,next:"INTERESTED vai READY FOR TOM."},
{cat:"Zvans",title:"Piedāvājums sazvanīties",subject:"Īss zvans par mājaslapu",when:"Klients grib izrunāt detaļas.",text:`Droši, varam sazvanīties.

Ja paliekam pie standarta mājaslapas, pietiktu ar 10–15 minūtēm, lai saprastu saturu un galvenās vajadzības.

Ja ir e-veikals, booking, maksājumi vai cita specifiska funkcionalitāte, pievienosim arī Tomu, lai uzreiz var atbildēt uz tehniskajiem jautājumiem.

Atsūtiet, lūdzu, 2–3 laikus, kas Jums der.`,next:"Pieraksti sarunāto laiku CRM."},
{cat:"Zvans",title:"Handoff pirms Google Meet",subject:"Par mūsu sarunu",when:"Pirms nodod klientu Tomam.",text:`Paldies par informāciju.

Es visu, ko pārrunājām, nodošu Tomam — viņš ir mūsu izstrādes pusē un realizē projektus tehniski.

Google Meet laikā varēsiet precīzi iziet cauri funkcionalitātei, un pēc tam varēsim pateikt korektu cenu un termiņu.`,next:"READY FOR TOM."},
{cat:"Priekšapmaksa",title:"Vienošanās apstiprinājums",subject:"Mājaslapas izstrādes apstiprinājums",when:"Klients ir gatavs sākt standarta projektu.",text:`Sveiki!

Apstiprinu vienošanos:
- mājaslapas modernizācija;
- responsīvs dizains;
- esošā satura pārnešana;
- kontaktforma;
- pamata SEO;
- publicēšana uz esošā domēna;
- 2 labojumu cikli.

Kopējā cena: 399 €.

Darba sākšanai — 50% priekšapmaksa, atlikums pēc gala versijas apstiprināšanas pirms publicēšanas.

Tiklīdz priekšapmaksa saņemta un ir atsūtīti nepieciešamie materiāli, sākam darbu.`,next:"Statusu DEPOSIT PAID liec tikai pēc maksājuma saņemšanas."},
{cat:"Priekšapmaksa",title:"Kāpēc vajag priekšapmaksu?",subject:"Par priekšapmaksu",when:"Klients šaubās par 50%.",text:`Strādājam ar 50% priekšapmaksu, jo pēc apstiprināšanas rezervējam laiku projektam un sākam darbu pie konkrēti Jūsu uzņēmumam pielāgotas versijas.

Atlikums ir tikai pēc tam, kad gala variants ir apstiprināts, pirms publicēšanas uz Jūsu domēna.`,next:"Ja ir īpaši maksājumu nosacījumi — admin."},
{cat:"Materiāli",title:"Materiālu pieprasījums",subject:"Kas nepieciešams mājaslapas izstrādei",when:"Pēc vienošanās/priekšapmaksas.",text:`Lai varam sākt bez liekas gaidīšanas, atsūtiet, lūdzu:

- logo labākajā pieejamajā kvalitātē;
- uzņēmuma kontaktinformāciju un darba laiku;
- pakalpojumu sarakstu;
- tekstus, ja vēlaties izmantot ko citu nekā esošajā lapā;
- bildes, kuras noteikti jāizmanto;
- sociālo tīklu saites;
- nepieciešamās valodas.

Ja daļu satura drīkst pārnest no esošās mājaslapas, vienkārši apstipriniet to.`,next:"IN DEVELOPMENT."},
{cat:"Labojumi",title:"Labojumu cikls",subject:"Par mājaslapas labojumiem",when:"Klients sāk sūtīt feedback.",text:`Super, paldies!

Lūdzu, salieciet visus aktuālos labojumus vienā ziņā vai dokumentā, lai varam tos iziet cauri vienā reizē un nekas nepazūd sarakstē.

Standarta cenā ir iekļauti 2 šādi labojumu cikli.`,next:"Pieraksti, kurš cikls tas ir."},
{cat:"Labojumi",title:"Jauna funkcija labojumu laikā",subject:"Par papildu funkciju",when:"Klients labojumos pievieno jaunu scope.",text:`To noteikti var izdarīt.

Šī gan jau ir jauna funkcionalitāte ārpus sākotnēji saskaņotā mājaslapas apjoma, tāpēc šo daļu vajadzētu novērtēt atsevišķi.

Es nodošu prasību Tomam, un viņš pateiks, kāds būtu papildus darbs un cena.`,next:"READY FOR TOM vai paliek IN DEVELOPMENT ar admin review."},
{cat:"Launch",title:"Gala versija gatava",subject:"Mājaslapas gala versija",when:"Pirms atlikuma/publicēšanas.",text:`Gala versija ir gatava.

Lūdzu, apskatiet to vēlreiz uz datora un telefona. Ja no Jūsu puses viss ir apstiprināts, atliek atlikuma apmaksa un pēc tās publicējam lapu uz Jūsu domēna.

Ja ir vēl kāds pēdējais labojums esošā scope ietvaros, atsūtiet to vienā ziņā.`,next:"Pēc apstiprinājuma un atlikuma → launch."},
{cat:"Launch",title:"Pēc publicēšanas",subject:"Mājaslapa ir publicēta",when:"Uzreiz pēc veiksmīga launch.",text:`Sveiki!

Mājaslapa ir publicēta un pieejama uz Jūsu domēna.

Lūdzu, kad ir brīvs brīdis, pārbaudiet galveno kontaktformu un svarīgākās sadaļas arī no sava telefona.

Ja kaut kas tehniski nestrādā kā paredzēts, droši dodiet ziņu.`,next:"Statuss WON."},
{cat:"Maintenance",title:"Uzturēšanas piedāvājums — 30 €/mēn.",subject:"Par mājaslapas uzturēšanu",when:"Pēc veiksmīgas publicēšanas.",text:`Ja vēlaties, varam mājaslapu arī turpmāk tehniski pieskatīt.

Uzturēšana ir 30 €/mēn. un paredzēta tam, lai nav pašiem jādomā par tehniskajiem atjauninājumiem, backup, pamata drošības/pieejamības pārbaudēm un nelielām satura izmaiņām.

Lielākas jaunas funkcijas vai redesign darbi tiek rēķināti atsevišķi.

Ja tas Jums ir aktuāli, varu pieslēgt uzturēšanu pēc mājaslapas palaišanas.`,next:"After-sale upsell."},
{cat:"Atteikums",title:"Pieklājīga atbilde uz “nav aktuāli”",subject:"Re: mājaslapas piemērs",when:"Klients atsaka.",text:`Skaidrs, paldies, ka devāt ziņu!

Mockup droši varat paturēt idejām. Ja kādreiz vēlāk mājaslapas modernizācija kļūst aktuāla, droši uzrakstiet.

Lai veiksmīga diena!`,next:"LOST."},
{cat:"Atteikums",title:"“Mums jau ir savs izstrādātājs”",subject:"Re: mājaslapas piemērs",when:"Klientam jau ir savs cilvēks.",text:`Skaidrs, paldies par atbildi!

Tad noteikti netraucēšu. Nosūtīto konceptu droši varat izmantot kā ideju, ja ar savu izstrādātāju kādreiz pārskatāt mājaslapas dizainu.

Lai veicas ar darbiem!`,next:"LOST."},
{cat:"Follow-up",title:"Pēc pozitīvas intereses klients pazūd",subject:"Vai vēl aktuāli?",when:"Iepriekš bija interese, bet 2–3 dienas klusums.",text:`Sveiki!

Gribēju tikai pārbaudīt, vai mājaslapas jautājums vēl ir aktuāls un vai no manas puses vajadzīga vēl kāda informācija.

Ja šobrīd vienkārši nav laika pie tā ķerties, viss kārtībā — varam atgriezties vēlāk.`,next:"Ja atkārtoti klusums, pēdējais follow-up."},
{cat:"Rēķins",title:"Klients prasa rēķinu/rekvizītus",subject:"Par rēķinu",when:"Finanšu/juridiska informācija jānodod adminam.",text:`Jā, protams.

Rēķina un rekvizītu daļu noformē mūsu admin/izstrādes puse. Es nodošu Jūsu informāciju Tomam, lai var sagatavot korekto dokumentāciju un maksājuma informāciju.`,next:"Nodod adminam; neizdomā rekvizītus."}
];
