import type { SeedNeighborhood } from "./types";

/** Poligoni approssimativi, tracciati a mano su riferimenti OSM (fiumi Crati e Busento, piazze, chiese). */
export const neighborhoods: SeedNeighborhood[] = [
  {
    slug: "centro-storico",
    name: { it: "Centro storico", en: "Old town" },
    description: {
      it: "Cosenza Vecchia, tra il Crati e il Busento, dominata dal Castello normanno-svevo: un dedalo di vicoli, chiese, palazzi e piazze suddiviso in numerosi rioni alti e bassi.",
      en: "Old Cosenza, between the Crati and Busento rivers and crowned by the Norman-Swabian Castle: a maze of alleys, churches, palaces and squares divided into many upper and lower quarters.",
    },
    polygon: [
      [16.2545, 39.2905],
      [16.2575, 39.2918],
      [16.26, 39.2935],
      [16.265, 39.2915],
      [16.2675, 39.2875],
      [16.264, 39.284],
      [16.2595, 39.2815],
      [16.2545, 39.285],
      [16.253, 39.2885],
      [16.2545, 39.2905],
    ],
  },
  {
    slug: "santa-lucia",
    name: { it: "Santa Lucia", en: "Santa Lucia" },
    description: {
      it: "Rione basso del centro storico tra Piazza dei Valdesi e la chiesa di Santa Lucia, fatto di case strette, scale e vicoli che salgono verso il colle.",
      en: "A lower quarter of the old town between Piazza dei Valdesi and the church of Santa Lucia, made of narrow houses, stairways and alleys climbing the hill.",
    },
    polygon: [
      [16.2572, 39.2914],
      [16.259, 39.2916],
      [16.2596, 39.2905],
      [16.259, 39.2896],
      [16.2575, 39.2898],
      [16.2568, 39.2906],
      [16.2572, 39.2914],
    ],
  },
  {
    slug: "rivocati",
    name: { it: "Riforma-Rivocati", en: "Riforma-Rivocati" },
    description: {
      it: "Quartiere sulla riva sinistra del Busento, attorno a Piazza della Riforma: storica cerniera tra la città vecchia, la città nuova e i paesi dell'entroterra.",
      en: "A district on the left bank of the Busento around Piazza della Riforma: the historic hinge between the old town, the new city and the inland villages.",
    },
    polygon: [
      [16.2495, 39.2915],
      [16.25, 39.294],
      [16.254, 39.2945],
      [16.258, 39.2935],
      [16.2575, 39.292],
      [16.2545, 39.2908],
      [16.251, 39.29],
      [16.2495, 39.2915],
    ],
  },
  {
    slug: "massa",
    name: { it: "Massa", en: "Massa" },
    description: {
      it: "Rione del centro storico sulla sponda destra del Crati, legato al ponte dei Pignatari, a Piazza Arenella e al complesso di Sant'Agostino.",
      en: "An old-town quarter on the right bank of the Crati, linked to the Pignatari bridge, Piazza Arenella and the Sant'Agostino complex.",
    },
    polygon: [
      [16.2603, 39.2912],
      [16.2625, 39.2918],
      [16.2655, 39.2908],
      [16.2662, 39.289],
      [16.264, 39.288],
      [16.262, 39.2886],
      [16.2603, 39.2912],
    ],
  },
  {
    slug: "spirito-santo",
    name: { it: "Spirito Santo", en: "Spirito Santo" },
    description: {
      it: "Nel Cinquecento il rione più popoloso della città, detto delle Concerie; oggi raccolto attorno alla piazza e alla chiesa dello Spirito Santo.",
      en: "In the sixteenth century the city's most populous quarter, known as the Tanneries; today gathered around the square and church of the Holy Spirit.",
    },
    polygon: [
      [16.2612, 39.2885],
      [16.263, 39.289],
      [16.2648, 39.288],
      [16.2645, 39.2866],
      [16.2628, 39.2862],
      [16.2614, 39.287],
      [16.2612, 39.2885],
    ],
  },
  {
    slug: "portapiana",
    name: { it: "Portapiana", en: "Portapiana" },
    description: {
      it: "Rione alto del centro storico sotto il Castello, tra vicoli in salita, orti a terrazza e ampi panorami sulla città.",
      en: "An upper quarter of the old town below the Castle, with climbing lanes, terraced gardens and sweeping views over the city.",
    },
    polygon: [
      [16.257, 39.2855],
      [16.26, 39.2852],
      [16.2612, 39.2838],
      [16.26, 39.2822],
      [16.2575, 39.2825],
      [16.2562, 39.284],
      [16.257, 39.2855],
    ],
  },
  {
    slug: "via-popilia",
    name: { it: "Via Popilia", en: "Via Popilia" },
    description: {
      it: "Quartiere popolare cresciuto nel secondo Novecento lungo il tracciato dell'antica strada romana, tra il Crati e il viale Giacomo Mancini.",
      en: "A working-class district that grew in the late twentieth century along the route of the ancient Roman road, between the Crati and Viale Giacomo Mancini.",
    },
    polygon: [
      [16.2545, 39.299],
      [16.261, 39.299],
      [16.2618, 39.311],
      [16.2622, 39.319],
      [16.257, 39.32],
      [16.2535, 39.315],
      [16.254, 39.306],
      [16.2545, 39.299],
    ],
  },
];
