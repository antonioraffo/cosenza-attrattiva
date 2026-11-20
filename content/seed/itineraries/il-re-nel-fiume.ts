import type { SeedItinerary } from "../types";

export const itinerary: SeedItinerary = {
  slug: "il-re-nel-fiume",
  title: {
    it: "Il re nel fiume",
    en: "The King in the River",
  },
  subtitle: {
    it: "Sulle tracce di Alarico, dal Busento al castello",
    en: "On the trail of Alaric, from the Busento to the castle",
  },
  intro: {
    it: `Nell'anno 410 Alarico, re dei Visigoti, saccheggia Roma. Pochi mesi dopo muore qui, alle porte di Cosenza. Da allora la città custodisce un segreto: secondo la leggenda, il re riposa con il suo tesoro sul fondo del Busento. Questo racconto in cinque capitoli parte dai ponti sull'acqua, dove i due fiumi si incontrano, segue le parole di uno storico goto e di due poeti, poi risale il centro storico fino al castello, da cui la valle intera sembra custodire ancora il mistero.`,
    en: `In the year 410 Alaric, king of the Visigoths, sacked Rome. A few months later he died here, at the gates of Cosenza. Ever since, the city has kept a secret: according to legend, the king lies with his treasure at the bottom of the river Busento. This story in five chapters starts on the bridges where two rivers meet, follows the words of a Gothic historian and two poets, then climbs through the old town to the castle, from where the whole valley still seems to guard the mystery.`,
  },
  theme: "storia",
  difficulty: "media",
  color: "#1F4E5A",
  cover: "confluenza-crati-busento-1",
  featured: true,
  chapters: [
    {
      place: "ponte-alarico",
      title: {
        it: "Un nome sull'acqua",
        en: "A Name Above the Water",
      },
      body: {
        it: `Fermati sul ponte e guarda giù. L'acqua scorre veloce, verde e grigia, tra sassi e canneti. Il ponte su cui ti trovi porta un nome che a Cosenza nessuno pronuncia per caso: Alarico.

Torna indietro di sedici secoli. Nell'agosto del 410 Alarico, re dei Visigoti, entra a Roma con i suoi guerrieri. Per tre giorni la città eterna viene saccheggiata, e tutto il mondo romano trema. Il re non si ferma: scende verso sud con un esercito carico di bottino, forse diretto in Sicilia e poi in Africa, dove c'è il grano che manca ai suoi uomini. Ma una tempesta distrugge le navi, e Alarico è costretto a tornare indietro, risalendo la Calabria.

Arriva qui, a Consentia, l'antica città dei Bruzi. E qui, all'improvviso, si ammala. Le fonti parlano di una febbre. Il re che ha piegato Roma muore lontano dalla sua terra, a pochi passi da questi fiumi, pochi mesi dopo il sacco.

Ascolta il rumore dell'acqua sotto di te: da quel giorno, a Cosenza, i fiumi raccontano una storia. Volgi lo sguardo verso il punto in cui le due correnti si uniscono. È lì che la leggenda comincia davvero.`,
        en: `Stop on the bridge and look down. The water runs fast, green and grey, between stones and reeds. The bridge you are standing on bears a name that nobody in Cosenza says lightly: Alaric.

Go back sixteen centuries. In August 410, Alaric, king of the Visigoths, entered Rome with his warriors. For three days the Eternal City was plundered, and the whole Roman world trembled. The king did not stop there. He marched south with an army laden with loot, perhaps bound for Sicily and then Africa, where there was the grain his men so badly needed. But a storm wrecked his ships, and Alaric was forced to turn back, heading north again through Calabria.

He came here, to Consentia, the ancient city of the Bruttians. And here, suddenly, he fell ill. The sources speak of a fever. The king who had brought Rome to its knees died far from his homeland, a few steps from these rivers, just months after the sack.

Listen to the water beneath you: since that day, the rivers of Cosenza have been telling a story. Turn towards the point where the two currents meet. That is where the legend truly begins.`,
      },
      camera: { zoom: 17.5, bearing: -30, pitch: 45 },
    },
    {
      place: "confluenza-crati-busento",
      title: {
        it: "Il fiume deviato",
        en: "The River Turned Aside",
      },
      body: {
        it: `Qui il Busento si getta nel Crati. Le due acque si incontrano con un rumore sordo, si mescolano e proseguono insieme verso nord. È questo il luogo che, da secoli, i cosentini indicano come la tomba di un re.

A raccontare la storia è Giordane, uno storico di origine gotica che scrive a metà del sesto secolo, circa centoquarant'anni dopo i fatti. Secondo il suo racconto, i Goti piangono il loro re e decidono di dargli una sepoltura che nessuno possa mai violare. Radunano una schiera di prigionieri e li costringono a deviare il corso del Busento. Nel letto rimasto all'asciutto scavano una fossa e vi depongono Alarico insieme a molte ricchezze. Poi restituiscono al fiume il suo cammino, e l'acqua torna a scorrere sopra il re. Perché il segreto resti tale, i prigionieri che hanno lavorato vengono uccisi.

È una leggenda, e nessuno sa quanto ci sia di vero. Nessuna tomba è mai stata trovata, e in sedici secoli il letto dei fiumi è cambiato più volte. Ma guarda l'acqua davanti a te e prova a immaginarla ferma, deviata, poi di nuovo libera, a coprire ogni cosa.

Ora risali per qualche passo lungo il Busento. Su queste rive, molti secoli dopo, un poeta tedesco immaginerà di sentire cantare i Goti.`,
        en: `Here the Busento pours into the Crati. The two waters meet with a low rumble, mingle, and flow on together towards the north. For centuries, this is the place the people of Cosenza have pointed to as the grave of a king.

The story comes from Jordanes, a historian of Gothic descent writing in the middle of the sixth century, some hundred and forty years after the events. According to his account, the Goths mourned their king and resolved to give him a burial that no one could ever disturb. They rounded up a crowd of captives and forced them to divert the course of the Busento. In the dried-out riverbed they dug a grave and laid Alaric in it, together with great riches. Then they let the river return to its path, and the water flowed once more over the king. To keep the secret safe, the captives who had done the work were put to death.

It is a legend, and no one knows how much of it is true. No tomb has ever been found, and over sixteen centuries the rivers have shifted their beds many times. But look at the water in front of you and try to picture it halted, turned aside, then released again to cover everything.

Now walk a short way up along the Busento. On these banks, many centuries later, a German poet would imagine hearing the Goths sing.`,
      },
      camera: { zoom: 17, bearing: 40, pitch: 55 },
    },
    {
      place: null,
      at: [16.25756, 39.29161],
      title: {
        it: "La ballata dei Goti",
        en: "The Ballad of the Goths",
      },
      body: {
        it: `Sei sul ponte che scavalca il Busento poco prima che il fiume finisca nel Crati. Alle tue spalle piazza dei Valdesi, davanti a te la chiesa di San Domenico. Ascolta il fiume: è questo il suono che, nel 1820, il poeta tedesco August von Platen immagina nella notte di Cosenza.

La sua ballata si intitola Das Grab im Busento, la tomba nel Busento. In poche strofe ritmate Platen mette in scena il canto funebre dei Goti, il fiume deviato, il re sepolto con la sua armatura, in sella al suo cavallo, e l'acqua che torna a coprire tutto. La poesia diventa celebre in Germania, e generazioni di studenti la imparano a memoria.

In Italia la traduce Giosuè Carducci, che ne conserva la musica cupa e cadenzata. Prova a leggerne l'inizio a bassa voce, guardando l'acqua:

*Cupi a notte canti suonano da Cosenza su 'l Busento, cupo il fiume li rimormora dal suo gorgo sonnolento.*

Grazie a questi versi un piccolo fiume calabrese è entrato nell'immaginario romantico europeo. Ma la poesia ha avuto anche un altro effetto: ha acceso la fantasia di chi sogna l'oro.

Lascia il ponte, attraversa la piazza e imbocca il corso che sale verso la città vecchia.`,
        en: `You are on the bridge over the Busento, just before the river runs into the Crati. Behind you is Piazza dei Valdesi, ahead of you the church of San Domenico. Listen to the river: this is the sound that, in 1820, the German poet August von Platen imagined in the Cosenza night.

His ballad is called Das Grab im Busento, The Grave in the Busento. In a few rhythmic stanzas Platen stages the funeral song of the Goths, the diverted river, the king buried in his armour, seated on his horse, and the water closing over everything once more. The poem became famous in Germany, and generations of schoolchildren learned it by heart.

In Italy it was translated by Giosuè Carducci, who kept its dark, rolling music. In Platen's own words, it begins something like this: by night, along the Busento near Cosenza, muffled songs are whispered, and from the water comes an answer, and the eddies echo back.

Thanks to these lines, a small Calabrian river found its way into the imagination of Romantic Europe. But the poem had another effect as well: it set alight the dreams of everyone who longs for gold.

Leave the bridge, cross the square, and take the street that climbs towards the old town.`,
      },
      camera: { zoom: 18, bearing: -10, pitch: 40 },
    },
    {
      place: "corso-telesio",
      title: {
        it: "I cercatori del tesoro",
        en: "The Treasure Hunters",
      },
      body: {
        it: `Da piazza dei Valdesi cominci a salire lungo corso Telesio. Le pietre del selciato sono levigate, i palazzi si stringono, le voci rimbalzano tra i muri. È la stessa città che ha visto passare, nei secoli, una lunga processione di cercatori d'oro.

Perché la leggenda non parla solo di un re: parla di un tesoro. Nella fantasia popolare il bottino di Roma è diventato sempre più favoloso. C'è chi immagina casse di monete e gioielli, chi addirittura i tesori del Tempio di Gerusalemme, portati a Roma secoli prima dalle legioni. Eruditi, avventurieri e semplici curiosi hanno studiato antiche carte, scrutato le anse del fiume, scavato di notte lungo le rive. Si racconta che nel Novecento perfino emissari venuti da lontano abbiano cercato qui la tomba del re goto. E in anni più recenti si è parlato di indagini con strumenti moderni, capaci di guardare sotto il letto del fiume.

Nessuno ha mai trovato nulla. E forse il vero tesoro di Cosenza è proprio questo: un mistero che non si lascia scavare.

Mentre sali, guarda le botteghe, le finestre socchiuse, le scalinate che si aprono di lato come fessure di luce. La città vecchia è cresciuta su questo colle per difendersi, guardando dall'alto le valli dei due fiumi. Lascia il corso e prendi i gradini che portano verso la cima. Lassù, tra le mura, la vista è quella di un re.`,
        en: `From Piazza dei Valdesi you start climbing Corso Telesio. The paving stones are worn smooth, the palaces crowd together, voices bounce between the walls. This is the same city that, over the centuries, has watched a long procession of gold seekers go by.

Because the legend is not only about a king: it is about a treasure. In the popular imagination the plunder of Rome has grown ever more fabulous. Some picture chests of coins and jewels; some even imagine the treasures of the Temple of Jerusalem, carried to Rome centuries earlier by the legions. Scholars, adventurers and the merely curious have pored over old maps, studied every bend of the river, dug at night along its banks. It is said that in the twentieth century even envoys from distant lands came here looking for the Gothic king's tomb. And in more recent years there has been talk of surveys with modern instruments that can see beneath the riverbed.

No one has ever found anything. Perhaps the real treasure of Cosenza is exactly that: a mystery that refuses to be dug up.

As you climb, look at the workshops, the half-open windows, the stairways that open up to the side like slits of light. The old town grew up on this hill to defend itself, watching over the valleys of its two rivers. Leave the main street and take the steps leading to the top. Up there, among the walls, the view is fit for a king.`,
      },
      camera: { zoom: 17, bearing: 30, pitch: 50 },
    },
    {
      place: "castello-svevo",
      title: {
        it: "Lo sguardo dalla rocca",
        en: "The View from the Fortress",
      },
      body: {
        it: `Sei in cima al colle Pancrazio, a quasi quattrocento metri sul mare, davanti al castello che sorveglia Cosenza da più di mille anni. Già nel 937 i cosentini costruiscono un forte quassù. I Normanni lo ingrandiscono, il terremoto del 1184 lo devasta, e Federico Secondo di Svevia lo fa rinascere: torri agli angoli, camminamenti merlati, grandi sale con le volte. Più tardi Luigi Terzo d'Angiò e Margherita di Savoia ne fanno una residenza principesca. Poi arrivano altri terremoti, l'abbandono, il seminario, i restauri.

Affacciati dalle mura. Il vento sale dalla valle e porta l'odore delle colline. Sotto di te i tetti del centro storico scendono a cascata, e in fondo luccicano i due fiumi, il Crati e il Busento, fino al punto in cui si uniscono.

Da qui capisci perché tutti i popoli passati per Cosenza hanno voluto questo colle: da quassù si vede ogni cosa. La strada da cui arrivarono i Goti. Il fiume in cui, forse, seppellirono il loro re.

Alarico è ancora laggiù? Nessuno lo sa. La città ha scelto di custodire la domanda, non la risposta. Resta un momento in silenzio e ascolta: quando il vento cala, sembra quasi di sentire, dal fondo della valle, il canto cupo dei Goti.`,
        en: `You are at the top of the Pancrazio hill, almost four hundred metres above sea level, in front of the castle that has watched over Cosenza for more than a thousand years. As early as 937 the townspeople built a fort up here. The Normans enlarged it, the earthquake of 1184 ravaged it, and Frederick the Second of Swabia brought it back to life: corner towers, battlemented walkways, great vaulted halls. Later, Louis the Third of Anjou and Margaret of Savoy turned it into a princely residence. Then came more earthquakes, neglect, a seminary, and finally restoration.

Lean out from the walls. The wind rises from the valley carrying the scent of the hills. Below you the roofs of the old town tumble downhill, and far beneath them the two rivers glint, the Crati and the Busento, all the way to the point where they meet.

From here you understand why every people that passed through Cosenza wanted this hill: from up here you can see everything. The road along which the Goths arrived. The river in which, perhaps, they buried their king.

Is Alaric still down there? No one knows. The city has chosen to keep the question rather than the answer. Stay silent for a moment and listen: when the wind drops, you can almost hear, from the bottom of the valley, the dark song of the Goths.`,
      },
      camera: { zoom: 16.5, bearing: 15, pitch: 60 },
    },
  ],
};
