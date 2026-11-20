# Scaletta della demo – Cosenza attrattiva · Connect

Durata consigliata: **15–20 minuti**. Proiettare lo smartphone (AirPlay / scrcpy) o usare Chrome desktop
in modalità dispositivo (375 px). L'URL è quello stampato da `make up`
(oggi `https://cosenzaattrattiva.test:8443`).

## Prima della demo (10 minuti prima)

1. `make up` e verifica del lucchetto valido nel browser.
2. Se si usa uno smartphone: CA mkcert installata e DNS impostato (README → *Test da smartphone*);
   **oppure** tunnel pubblico per evitare configurazioni sul telefono del cliente.
3. Apri una volta "Il re nel fiume" (racconto) e il castello in Street View: la cache rende la demo più fluida.
4. Svuota il Passaporto (pagina Passaporto → *Azzera passaporto*) per mostrarlo dal primo timbro.
5. Volume alto: la narrazione vocale fa parte dell'effetto.

## 1. L'apertura (2 min) – *"una città che si racconta"*

- **Home**: foto a tutto schermo del centro storico, il marchio ufficiale *Cosenza attrattiva*.
- Messaggio: non un elenco di POI, ma **sette storie** da vivere. Scorri le card in evidenza.
- Tocca il filtro **Fede** → la griglia si ricompone. Torna su **Tutti**.
- Cambia lingua **EN** in alto: tutto il prodotto, contenuti compresi, è bilingue. Torna a IT.

## 2. Il racconto (4 min) – *scrollytelling* "Il re nel fiume"

- Apri **Il re nel fiume** → mostra durata, km, difficoltà, la mappa del percorso reale.
- **Leggi il racconto**: la mappa occupa la metà superiore, il testo scorre sotto.
- Scorri lentamente: a ogni capitolo la camera **vola** sulla tappa; il percorso fatto diventa pieno,
  quello da fare resta tratteggiato.
- Al capitolo della confluenza: **Ascolta** → la narrazione parte (voce sintetica, sostituibile con
  audio professionale senza cambiare nulla).
- **Vista 3D** (in alto) → **Avvia il volo**: volo cinematografico fotorealistico tra le tappe
  (Google Photorealistic 3D Tiles). È il momento "Earth Voyager".

## 3. Il luogo (3 min) – Castello Svevo

- Da un capitolo: **Scheda del luogo** del Castello.
- Galleria, racconto, curiosità, orari e accessibilità (contesto PA: informazioni utili e oneste).
- **Ieri e oggi**: trascina lo slider tra l'incisione del 1897 e la foto attuale.
- **Street View**: panorama sulla salita al castello con **punti luminosi** che aprono i dettagli.
- **Realtà aumentata**: su smartphone inquadra la città, le etichette dei luoghi appaiono nella loro
  direzione con la distanza; sul castello si apre la **linea del tempo** dal 356 a.C. al restauro.
  Su desktop: trascina per ruotare la vista bussola.

## 4. La passeggiata (4 min) – senza essere a Cosenza

- Itinerario **Fede di pietra** → **Inizia la passeggiata** → **Avvia con posizione simulata**.
- Spiega la privacy: la posizione resta sul telefono, mai inviata al server.
- Apri **DEMO · Simulatore di posizione** → **Percorri l'itinerario** a 15×.
- In alto: prossima tappa, distanza, freccia della **bussola** (su smartphone ruota con il telefono).
- All'arrivo al Duomo: **vibrazione**, card del capitolo, **narrazione automatica**, **timbro** animato.
- Porta la velocità a **40×** e lascia arrivare tutte le tappe: all'ultima compare il **sigillo**
  dell'itinerario completato (servono tutti i timbri, quindi non saltare tappe).

## 5. Passaporto e offline (2 min)

- **Passaporto**: i timbri raccolti, i sigilli per itinerario con l'avanzamento.
- Su un itinerario: **Scarica per l'offline** → poi modalità aereo: racconto, foto e mappa
  funzionano senza rete (utile in centro storico, dove il segnale è debole).
- Installazione come app: "Aggiungi a schermata Home" (PWA, icona del marchio).

## 6. Chiusura (2 min) – dove può andare il progetto

- **Chiedi a Cosenza** (menu): oggi risponde citando i testi degli itinerari; è già predisposto per un
  assistente conversazionale con le fonti del Comune.
- Contenuti gestiti come dati: nuovi itinerari, lingue (DE, FR…) e audio professionali si aggiungono
  senza sviluppo. Coerente con il masterplan: pilastro **Connect**, integrazione con **Crea**
  (botteghe) e **Vive** (commercio, eventi) come tappe e itinerari tematici.
- Accessibilità WCAG 2.1 AA, Lighthouse ≥ 90, nessun tracciamento: requisiti PA rispettati.

## Piano B

| Problema | Soluzione |
|---|---|
| Rete assente | Itinerario scaricato offline prima della demo; mappa e foto sono locali |
| Street View / 3D non caricano | Chiave Google: controllare referrer (`:8443` incluso) e API abilitate; il resto funziona senza |
| GPS impreciso in sala | Usare sempre "Avvia con posizione simulata" |
| La voce non parte (iOS silenzioso) | Disattivare il silenzioso; in alternativa leggere il capitolo a schermo |
