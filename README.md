# LeadForge CRM

Vienkāršs React/Vite mini-CRM mājaslapu pārdošanas leadu pārvaldībai.

## Funkcijas
- Uzņēmumu pievienošana, rediģēšana un dzēšana
- Lead score 0–100
- Statusu pipeline
- Kontakti, mājaslapa un demo saite
- Potenciālā darījuma vērtība
- Pēdējais kontakts un nākamais follow-up
- Problēmu un piezīmju reģistrēšana
- Dashboard statistika
- Meklēšana un filtri
- JSON backup eksports/imports
- LocalStorage datu glabāšana

## Lokāla palaišana
```bash
npm install
npm run dev
```

## Vercel
1. Ieliec projektu GitHub repozitorijā.
2. Vercel izvēlies **Add New → Project** un importē repozitoriju.
3. Framework parasti tiks atpazīts kā **Vite**.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy.

Nav nepieciešami environment variables.

## Svarīgi
Pašlaik dati glabājas browser LocalStorage. Tas ir ideāli MVP un vienas ierīces lietošanai, bet dati nav sinhronizēti starp datoriem. Nākamajai versijai ieteicams pieslēgt Neon/Supabase/Postgres un autentifikāciju.
