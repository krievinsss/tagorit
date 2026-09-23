export const AGREEMENT_VERSION = "1.0";

export const agreementSections = [
  {
    title: "1. Vienošanās mērķis",
    paragraphs: [
      "Dalībnieks piedalās Tagorit klientu piesaistes un pārdošanas sadarbības procesā. Šī vienošanās nosaka konfidencialitātes, klientu datu izmantošanas, sadarbības un iekšējās informācijas aizsardzības principus."
    ]
  },
  {
    title: "2. Konfidenciālā informācija",
    paragraphs: [
      "Par konfidenciālu uzskatāma visa nepubliskā informācija, kas Dalībniekam kļūst pieejama Tagorit sistēmā vai sadarbības laikā, tostarp klientu un potenciālo klientu dati, kontaktinformācija, sarakstes, cenu un komisiju nosacījumi, mockup un dizaina materiāli, pārdošanas skripti, darba instrukcijas, iekšējais workflow, komandas rezultāti, tehniskā informācija un cita informācija, kas pēc savas būtības nav paredzēta publiskai izpaušanai.",
      "Dalībnieks apņemas šo informāciju neizpaust trešajām personām, nekopēt ārpus darba vajadzībām un neizmantot citam mērķim, kā vien uzdevumu veikšanai Tagorit sadarbības ietvaros."
    ]
  },
  {
    title: "3. Klientu un potenciālo klientu izmantošana",
    paragraphs: [
      "Klients vai potenciālais klients, kas ir reģistrēts Tagorit sistēmā vai ar kuru kontakts izveidots sadarbības ietvaros, nedrīkst tikt pārņemts personīgai uzņēmējdarbībai, nodots citam uzņēmumam vai izmantots konkurējoša pakalpojuma piedāvāšanai bez rakstiskas administratora atļaujas.",
      "Dalībnieks nedrīkst apiet Tagorit sistēmu, slēdzot privātu darījumu ar sistēmā reģistrētu klientu vai novirzot šo klientu trešajai personai."
    ]
  },
  {
    title: "4. Datu aizsardzība un piekļuve",
    paragraphs: [
      "Sistēmā pieejamos personas un uzņēmumu datus drīkst izmantot tikai konkrētā darba uzdevuma veikšanai. Dalībnieks nedrīkst masveidā eksportēt klientu datubāzi, veidot privātas klientu datu kopijas, koplietot savu kontu vai piekļuves datus ar citām personām.",
      "Pārtraucot sadarbību, Dalībnieks apņemas dzēst visas ārpus Tagorit sistēmas saglabātās klientu datu un iekšējās informācijas kopijas, ja tādas bijušas nepieciešamas darba veikšanai."
    ]
  },
  {
    title: "5. Komisijas un atlīdzība",
    paragraphs: [
      "Dalībnieka komisijas un citu atlīdzību apmērus nosaka administrators un tie tiek atspoguļoti Tagorit sistēmā. Komisija tiek uzskatīta par nopelnītu tikai tad, kad klienta darījums ir sasniedzis sistēmā noteikto apmaksas posmu.",
      "Team Lead statusa gadījumā administrators var noteikt papildu komisiju par tiešā pakļautībā esoša partnera noslēgtu un apmaksātu darījumu. Fiktīvi, atcelti vai neapmaksāti darījumi komisiju nerada."
    ]
  },
  {
    title: "6. Sadarbības robežas",
    paragraphs: [
      "Šī vienošanās neaizliedz Dalībniekam ārpus Tagorit veikt citus likumīgus darbus vai sniegt pakalpojumus, taču aizliedz izmantot Tagorit klientu bāzi, komercnoslēpumu, iekšējos materiālus, kontaktus un infrastruktūru savas vai trešās personas konkurējošas darbības labā."
    ]
  },
  {
    title: "7. Sadarbības izbeigšana",
    paragraphs: [
      "Sadarbību var pārtraukt jebkura puse. Pēc sadarbības beigām Dalībnieka piekļuve sistēmai var tikt nekavējoties deaktivizēta. Konfidencialitātes, klientu neizmantošanas un datu aizsardzības pienākumi turpina būt spēkā arī pēc sadarbības beigām."
    ]
  },
  {
    title: "8. Atbildība",
    paragraphs: [
      "Par apzinātu klientu datu nodošanu trešajām personām, Tagorit klienta pārņemšanu personīgai vai trešās personas uzņēmējdarbībai vai būtiska komercnoslēpuma apzinātu izpaušanu var tikt piemērots līgumsods līdz 500 EUR par katru būtisku pārkāpumu, ciktāl tas ir samērīgs ar pārkāpuma raksturu un piemērojams saskaņā ar spēkā esošajiem normatīvajiem aktiem.",
      "Līgumsods neatceļ pienākumu pārtraukt pārkāpumu un, ja normatīvie akti to pieļauj, atlīdzināt pierādītus zaudējumus."
    ]
  },
  {
    title: "9. Apstiprinājums",
    paragraphs: [
      "Apstiprinot šo vienošanos digitāli vai parakstot tās papīra eksemplāru, Dalībnieks apliecina, ka ir iepazinies ar noteikumiem, tos saprot un apņemas ievērot."
    ]
  }
];

export function agreementText(member = {}) {
  const header = [
    "TAGORIT SADARBĪBAS UN KONFIDENCIALITĀTES VIENOŠANĀS",
    "Versija: " + AGREEMENT_VERSION,
    "",
    "Dalībnieks: " + (member.name || "____________________________"),
    "E-pasts: " + (member.email || "____________________________"),
    "Loma: " + (member.role === "team_lead" ? "Team Lead" : member.role === "sales" ? "Sales Partner" : "________________"),
    ""
  ].join("\n");
  const body = agreementSections.map(s => s.title + "\n" + s.paragraphs.join("\n\n")).join("\n\n");
  return header + body + "\n\nDatums: ____________________\n\nDalībnieka paraksts: ______________________________\n\nAdministratora paraksts: __________________________";
}

export function printableAgreementHtml(member = {}) {
  const safe = (v="") => String(v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const sections = agreementSections.map(s => '<section><h2>'+safe(s.title)+'</h2>'+s.paragraphs.map(p=>'<p>'+safe(p)+'</p>').join('')+'</section>').join('');
  return '<!doctype html><html><head><meta charset="utf-8"><title>Tagorit vienošanās</title><style>@page{size:A4;margin:18mm}body{font-family:Arial,sans-serif;color:#111;font-size:11pt;line-height:1.5}h1{font-size:18pt;margin:0 0 4px}h2{font-size:12pt;margin:18px 0 6px}p{margin:0 0 8px}.meta{border:1px solid #bbb;padding:12px;margin:18px 0}.sign{margin-top:34px;display:grid;grid-template-columns:1fr 1fr;gap:32px}.line{border-top:1px solid #333;padding-top:5px;margin-top:44px}.note{font-size:9pt;color:#555;margin-top:20px}</style></head><body><h1>TAGORIT SADARBĪBAS UN KONFIDENCIALITĀTES VIENOŠANĀS</h1><div>Versija '+safe(AGREEMENT_VERSION)+'</div><div class="meta"><b>Dalībnieks:</b> '+safe(member.name||"____________________________")+'<br><b>E-pasts:</b> '+safe(member.email||"____________________________")+'<br><b>Loma:</b> '+safe(member.role==="team_lead"?"Team Lead":member.role==="sales"?"Sales Partner":"________________")+'</div>'+sections+'<div class="sign"><div><div class="line">Dalībnieka vārds, uzvārds un paraksts</div></div><div><div class="line">Administratora vārds, uzvārds un paraksts</div></div></div><div class="sign"><div><div class="line">Datums</div></div><div><div class="line">Vieta</div></div></div><script>window.onload=()=>setTimeout(()=>window.print(),250)<\/script></body></html>';
}
