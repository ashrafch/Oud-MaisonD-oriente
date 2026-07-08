// Dataset prodotti OUDÉ Maison D'Oriente — generato dal catalogo SumUp del negozio
// Match foto (src/prodotti) ↔ prezzo (src/prezzi) ↔ categoria ↔ gender.
// Prezzi: dai listini SumUp reali. Note olfattive: piramidi ufficiali dei profumi
// (dati pubblici dei produttori) solo dove verificate; niente dati inventati.
//
// Categorie disponibili nello store: oud, musk, attar, bakhoor, set-regalo, unisex
// gender: 'uomo' | 'donna' | 'unisex'
// images: nomi file dentro src/prodotti (prima = principale)

export const products = [
  // ===================== LATTAFA — KHAMRAH LINE =====================
  {
    slug: 'lattafa-khamrah',
    name: 'Khamrah',
    brand: 'Lattafa',
    price: 49.99,
    category: 'oud',
    categories: ['oud', 'unisex'],
    gender: 'unisex',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: ['bestseller'],
    shortDescription: 'Ambrato speziato e goloso: cannella, datteri e praline avvolti in vaniglia e tonka. Una scia calda e persistente.',
    notes: {
      top: ['Cannella', 'Noce moscata', 'Bergamotto'],
      heart: ['Dattero', 'Pralina', 'Tuberosa', 'Mogano'],
      base: ['Vaniglia', 'Fava tonka', 'Mirra', 'Benzoino']
    },
    images: ['ab5a4519-340c-4494-be06-4498766af6b6.JPG']
  },
  {
    slug: 'lattafa-khamrah-qahwa',
    name: 'Khamrah Qahwa',
    brand: 'Lattafa',
    price: 49.99,
    category: 'oud',
    categories: ['oud', 'unisex'],
    gender: 'unisex',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: ['nuovo'],
    shortDescription: 'La versione al caffè di Khamrah: caffè arabo, cardamomo e cannella su un fondo cremoso di vaniglia e pralina.',
    notes: {
      top: ['Caffè', 'Cardamomo', 'Cannella'],
      heart: ['Dattero', 'Tuberosa', 'Pralina'],
      base: ['Vaniglia', 'Fava tonka', 'Caffè tostato']
    },
    images: ['61cf2e91-8075-47e3-baec-5f02aa163564.JPG']
  },
  {
    slug: 'lattafa-khamrah-dukhan',
    name: 'Khamrah Dukhan',
    brand: 'Lattafa',
    price: 49.99,
    category: 'oud',
    categories: ['oud'],
    gender: 'unisex',
    intensity: 'Molto intenso',
    duration: '10+ ore',
    tags: [],
    shortDescription: 'Khamrah in versione affumicata: zafferano, incenso e tabacco su datteri, vaniglia e tonka. Profonda e ipnotica.',
    notes: {
      top: ['Zafferano', 'Cannella'],
      heart: ['Incenso', 'Tabacco', 'Dattero'],
      base: ['Vaniglia', 'Fava tonka', 'Oud affumicato']
    },
    images: ['bdfa76e0-ac4f-4fdc-b131-290b6785d775.JPG']
  },
  {
    slug: 'lattafa-khamra-set',
    name: 'Khamrah Set Regalo',
    brand: 'Lattafa',
    price: 69.99,
    category: 'set-regalo',
    categories: ['set-regalo', 'oud'],
    gender: 'unisex',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: ['gift'],
    shortDescription: 'Cofanetto Khamrah: eau de parfum 100ml, spray corpo e deodorante ambiente. Il regalo perfetto per gli amanti dell\'ambrato speziato.',
    notes: {
      top: ['Cannella', 'Noce moscata'],
      heart: ['Dattero', 'Pralina', 'Tuberosa'],
      base: ['Vaniglia', 'Fava tonka', 'Benzoino']
    },
    images: ['b626ead1-587d-4c02-95e2-48b1b6ae85e1.JPG']
  },
  {
    slug: 'lattafa-khamrah-air-spray',
    name: 'Khamrah Air Freshener',
    brand: 'Lattafa',
    price: 14.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'unisex',
    intensity: 'Ambiente',
    duration: 'Ambiente',
    tags: [],
    shortDescription: 'Profumatore per ambienti Khamrah 300ml: porta la scia calda e speziata di cannella, datteri e vaniglia in ogni stanza.',
    notes: { top: ['Cannella', 'Noce moscata'], heart: ['Dattero', 'Pralina'], base: ['Vaniglia', 'Fava tonka'] },
    images: ['0c26ddea-8db4-4831-a8f5-6ac02915f964.JPG']
  },

  // ===================== LATTAFA — ASAD LINE =====================
  {
    slug: 'lattafa-asad',
    name: 'Asad',
    brand: 'Lattafa',
    price: 44.99,
    category: 'unisex',
    categories: ['unisex', 'oud'],
    gender: 'uomo',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: ['bestseller'],
    shortDescription: 'Fruttato-legnoso potente e fresco: ananas e pepe nero su betulla e patchouli, fondo ambrato muschiato. Ispirato a Creed Aventus.',
    notes: {
      top: ['Pepe nero', 'Ananas', 'Bergamotto'],
      heart: ['Betulla', 'Patchouli', 'Cardamomo'],
      base: ['Ambra grigia', 'Muschio', 'Vaniglia', 'Muschio di quercia']
    },
    images: ['6863938f-b700-4fd1-8ed3-86a83e85a621.JPG']
  },
  {
    slug: 'lattafa-asad-bourbon',
    name: 'Asad Bourbon',
    brand: 'Lattafa',
    price: 49.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'uomo',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Versione gourmand di Asad: vaniglia bourbon, cacao e pesca con un tocco di lavanda. Caldo, dolce e avvolgente.',
    notes: {
      top: ['Lavanda', 'Pesca'],
      heart: ['Cacao', 'Fiori'],
      base: ['Vaniglia bourbon', 'Fava tonka', 'Muschio']
    },
    images: ['ac8c5049-e96a-4812-94bd-10f7b6360ed1.JPG']
  },
  {
    slug: 'lattafa-asad-elixir',
    name: 'Asad Elixir',
    brand: 'Lattafa',
    price: 54.99,
    category: 'unisex',
    categories: ['unisex', 'oud'],
    gender: 'uomo',
    intensity: 'Molto intenso',
    duration: '10+ ore',
    tags: [],
    shortDescription: 'Elixir concentrato della linea Asad: frutti rossi e spezie su un fondo legnoso-ambrato profondo e vellutato.',
    notes: {
      top: ['Frutti rossi', 'Pepe rosa'],
      heart: ['Legni', 'Spezie'],
      base: ['Ambra', 'Vaniglia', 'Muschio']
    },
    images: ['a5b54044-f6e2-45ee-8728-9477a419a0ba.JPG', 'cb695da3-704d-4186-9752-268c22f72139.JPG']
  },

  // ===================== LATTAFA — BADEE AL OUD LINE =====================
  {
    slug: 'lattafa-badee-al-oud-honor-glory',
    name: 'Bade\'e Al Oud Honor & Glory',
    brand: 'Lattafa',
    price: 44.99,
    category: 'oud',
    categories: ['oud'],
    gender: 'unisex',
    intensity: 'Molto intenso',
    duration: '10+ ore',
    tags: ['bestseller'],
    shortDescription: 'Oud minerale e maestoso: zafferano e noce moscata su oud e patchouli, fondo di muschio bianco e tonka. Ispirato a Initio Oud for Greatness.',
    notes: {
      top: ['Zafferano', 'Noce moscata'],
      heart: ['Oud', 'Patchouli', 'Nota minerale'],
      base: ['Muschio bianco', 'Fava tonka']
    },
    images: ['7f621db5-2b78-4bb4-a272-927b025e9892.JPG']
  },
  {
    slug: 'lattafa-badee-al-oud-sublime',
    name: 'Bade\'e Al Oud Sublime',
    brand: 'Lattafa',
    price: 44.99,
    category: 'oud',
    categories: ['oud'],
    gender: 'unisex',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Oud fruttato e rosato: mela e litchi su rosa e oud, con un fondo dolce e resinoso. Elegante e sensuale.',
    notes: {
      top: ['Mela', 'Litchi'],
      heart: ['Rosa', 'Oud'],
      base: ['Ambra', 'Vaniglia', 'Muschio']
    },
    images: ['caa683fb-3f87-41f8-8d00-7498bbfa76d8.JPG']
  },
  {
    slug: 'lattafa-badee-al-oud-noble-blush',
    name: 'Bade\'e Al Oud Noble Blush',
    brand: 'Lattafa',
    price: 44.99,
    category: 'oud',
    categories: ['oud', 'unisex'],
    gender: 'donna',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Oud fruttato-floreale in chiave femminile: note rosate e dolci di mandorla e vaniglia su un cuore di oud morbido.',
    notes: {
      top: ['Frutti rosa', 'Mandorla'],
      heart: ['Rosa', 'Fiori bianchi'],
      base: ['Oud', 'Vaniglia', 'Muschio']
    },
    images: ['59e4e531-a32b-4ee0-9459-08a7b93760d8.JPG']
  },

  // ===================== LATTAFA — FAKHAR LINE =====================
  {
    slug: 'lattafa-fakhar-black',
    name: 'Fakhar Black',
    brand: 'Lattafa',
    price: 44.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'uomo',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Aromatico-fougère elegante: mela e lavanda su cannella e patchouli, fondo di vaniglia, tonka e muschio di quercia.',
    notes: {
      top: ['Mela', 'Lavanda', 'Bergamotto'],
      heart: ['Cannella', 'Patchouli'],
      base: ['Vaniglia', 'Fava tonka', 'Muschio di quercia']
    },
    images: ['bf037522-29e5-4169-bfe5-eccbaeb5f4ed.JPG', 'ce1a7645-45b9-4930-bac1-b2370916d57a.JPG']
  },
  {
    slug: 'lattafa-fakhar-gold',
    name: 'Fakhar Gold (Lattafa Woman)',
    brand: 'Lattafa',
    price: 44.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'donna',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Chypre fruttato femminile: note dorate e avvolgenti di frutti, fiori bianchi e un fondo caldo ambrato-muschiato.',
    notes: {
      top: ['Frutti', 'Bergamotto'],
      heart: ['Fiori bianchi', 'Gelsomino'],
      base: ['Ambra', 'Muschio', 'Vaniglia']
    },
    images: ['2aed6b76-d61c-4d94-b1c6-f90338e3057a.JPG']
  },
  {
    slug: 'lattafa-fakhar-platino',
    name: 'Fakhar Platino',
    brand: 'Lattafa',
    price: 44.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'uomo',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Aromatico fresco e legnoso: agrumi e lavanda su spezie e legni, fondo pulito e persistente. La versione platino della linea Fakhar.',
    notes: {
      top: ['Agrumi', 'Lavanda', 'Cardamomo'],
      heart: ['Legni', 'Spezie'],
      base: ['Muschio', 'Ambra', 'Vaniglia']
    },
    images: ['de260e31-4b7a-4838-84fe-baf28077b2e7.JPG']
  },
  {
    slug: 'lattafa-fakhar-air-spray',
    name: 'Fakhar Air Freshener',
    brand: 'Lattafa',
    price: 14.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'unisex',
    intensity: 'Ambiente',
    duration: 'Ambiente',
    tags: [],
    shortDescription: 'Profumatore per ambienti Fakhar 300ml: agrumi, vaniglia e legni per una casa dalla scia elegante e accogliente.',
    notes: { top: ['Agrumi', 'Lavanda'], heart: ['Fiori bianchi'], base: ['Vaniglia', 'Muschio'] },
    images: ['ee74157c-e173-4dbb-a929-076c60460881.JPG']
  },

  // ===================== LATTAFA — YARA LINE =====================
  {
    slug: 'lattafa-yara',
    name: 'Yara',
    brand: 'Lattafa',
    price: 44.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'donna',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: ['bestseller'],
    shortDescription: 'Dolce e cremoso: orchidea e eliotropio su tuberosa, con un fondo goloso di vaniglia, sandalo e muschio. Il best seller femminile.',
    notes: {
      top: ['Orchidea', 'Eliotropio', 'Frutti'],
      heart: ['Tuberosa', 'Gelsomino'],
      base: ['Vaniglia', 'Sandalo', 'Muschio']
    },
    images: ['5fd0f470-e893-42f3-863c-a658f0b40651.JPG', 'f88e30f8-9c58-4efc-964b-6ccde4976ef4.JPG']
  },
  {
    slug: 'lattafa-yara-moi',
    name: 'Yara Moi',
    brand: 'Lattafa',
    price: 44.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'donna',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Yara in versione fruttata: pesca e fiori d\'arancio su gelsomino, fondo cremoso di vaniglia e muschio. Solare e femminile.',
    notes: {
      top: ['Pesca', 'Fiori d\'arancio'],
      heart: ['Gelsomino', 'Fiori bianchi'],
      base: ['Vaniglia', 'Muschio', 'Sandalo']
    },
    images: ['82e28bf3-46f0-478b-aa0f-499b803716f4.JPG']
  },
  {
    slug: 'lattafa-yara-candy',
    name: 'Yara Candy',
    brand: 'Lattafa',
    price: 44.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'donna',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: ['nuovo'],
    shortDescription: 'La versione più golosa di Yara: note caramellate e fruttate di caramella su un fondo dolce di vaniglia e muschio.',
    notes: {
      top: ['Frutti dolci', 'Caramella'],
      heart: ['Fiori bianchi', 'Tuberosa'],
      base: ['Vaniglia', 'Caramello', 'Muschio']
    },
    images: ['83be10b5-11c3-4d2d-9567-538e3d0a7e38.JPG']
  },
  {
    slug: 'lattafa-yara-air-spray',
    name: 'Yara Air Freshener',
    brand: 'Lattafa',
    price: 14.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'unisex',
    intensity: 'Ambiente',
    duration: 'Ambiente',
    tags: [],
    shortDescription: 'Profumatore per ambienti Yara 300ml: la scia dolce e cremosa di orchidea, vaniglia e sandalo per la tua casa.',
    notes: { top: ['Orchidea', 'Frutti'], heart: ['Tuberosa'], base: ['Vaniglia', 'Sandalo', 'Muschio'] },
    images: ['f6322e4b-939e-4db9-bbd8-c4e9726c2eb6.JPG']
  },

  // ===================== LATTAFA — MUSAMAM =====================
  {
    slug: 'lattafa-musamam-black',
    name: 'Musamam Black Intense',
    brand: 'Lattafa',
    price: 64.99,
    category: 'oud',
    categories: ['oud'],
    gender: 'uomo',
    intensity: 'Molto intenso',
    duration: '10+ ore',
    tags: [],
    shortDescription: 'Legnoso-speziato scuro e magnetico: agrumi e spezie su un cuore di legni preziosi, fondo intenso di ambra e oud.',
    notes: {
      top: ['Bergamotto', 'Spezie'],
      heart: ['Legni', 'Note speziate'],
      base: ['Oud', 'Ambra', 'Muschio']
    },
    images: ['101f4bb5-64f7-4935-be4d-fe96d465fbee.JPG', 'd95572d8-6edf-4498-9884-e78013eef3bb.JPG']
  },
  {
    slug: 'lattafa-musamam-white',
    name: 'Musamam White',
    brand: 'Lattafa',
    price: 54.99,
    category: 'unisex',
    categories: ['unisex', 'oud'],
    gender: 'unisex',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'La versione chiara di Musamam: legni dorati e morbidi, spezie delicate e un fondo caldo e luminoso.',
    notes: {
      top: ['Agrumi', 'Spezie dolci'],
      heart: ['Legni chiari', 'Fiori'],
      base: ['Ambra', 'Muschio bianco', 'Vaniglia']
    },
    images: ['5c7f6f52-3c40-4b98-9c1c-415941390fbe.JPG']
  },

  // ===================== LATTAFA — TERIAQ =====================
  {
    slug: 'lattafa-teriaq-white',
    name: 'Teriaq White',
    brand: 'Lattafa',
    price: 44.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'unisex',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Fruttato-legnoso luminoso: note dolci e ambrate su un fondo caldo e cremoso. La versione chiara di Teriaq.',
    notes: {
      top: ['Frutti', 'Bergamotto'],
      heart: ['Fiori', 'Legni'],
      base: ['Ambra', 'Vaniglia', 'Muschio']
    },
    images: ['40e72db2-c1ad-492b-be3b-3bfb29be4c36.JPG']
  },
  {
    slug: 'lattafa-teriaq-black',
    name: 'Teriaq Intense',
    brand: 'Lattafa',
    price: 54.99,
    category: 'oud',
    categories: ['oud', 'unisex'],
    gender: 'unisex',
    intensity: 'Molto intenso',
    duration: '10+ ore',
    tags: [],
    shortDescription: 'Versione intensa e scura di Teriaq: frutti ambrati e spezie su un fondo profondo di legni, ambra e vaniglia.',
    notes: {
      top: ['Frutti scuri', 'Spezie'],
      heart: ['Legni', 'Fiori'],
      base: ['Ambra', 'Vaniglia', 'Muschio']
    },
    images: ['18ed98bc-69f0-4d99-8969-102da080bbb4.JPG']
  },

  // ===================== LATTAFA — ALTRI =====================
  {
    slug: 'lattafa-nebras-elixir',
    name: 'Nebras Elixir',
    brand: 'Lattafa',
    price: 49.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'unisex',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Gourmand cremoso e avvolgente: vaniglia, caramello e note dolci-lattiginose. Confortevole e persistente.',
    notes: {
      top: ['Note dolci', 'Frutti'],
      heart: ['Fiori bianchi', 'Crema'],
      base: ['Vaniglia', 'Caramello', 'Muschio']
    },
    images: ['a20d93e5-316e-40bf-953a-8dcadc03a050.JPG', 'fab018de-3436-4d1b-8414-920424a3fa77.JPG']
  },
  {
    slug: 'lattafa-classic-stone',
    name: 'Classic Stone',
    brand: 'Lattafa (Niche Emarati)',
    price: 62.99,
    category: 'oud',
    categories: ['oud', 'unisex'],
    gender: 'unisex',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Orientale-legnoso della linea Niche Emarati: spezie calde, vaniglia e mandorla su un fondo ambrato e legnoso raffinato.',
    notes: {
      top: ['Zafferano', 'Cardamomo'],
      heart: ['Mandorla', 'Fiori', 'Legni'],
      base: ['Vaniglia', 'Ambra', 'Sandalo']
    },
    images: ['05cdbd58-1864-4d11-9393-31d88b827c72.JPG', '3a42c6d8-d562-40a9-9e7a-b8c45ac0fcbd.JPG', '872565e0-6f2e-44e9-872f-e94e82833de5.JPG']
  },
  {
    slug: 'lattafa-pure-crystal',
    name: 'Pure Crystal',
    brand: 'Lattafa',
    price: 59.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'donna',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Fruttato-chypre elegante: note luminose di frutti e fiori bianchi su un fondo muschiato e ambrato di grande classe.',
    notes: {
      top: ['Frutti', 'Bergamotto', 'Ribes nero'],
      heart: ['Gelsomino', 'Rosa', 'Fiori bianchi'],
      base: ['Muschio', 'Ambra', 'Legni']
    },
    images: ['dbb63b40-4f06-4aa1-8092-746b50aa072c.JPG']
  },
  {
    slug: 'lattafa-queen-of-arabia',
    name: 'Queen of Arabia',
    brand: 'Lattafa',
    price: 64.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'donna',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Dolce e tropicale: cocco e vaniglia su fiori bianchi, con un fondo cremoso e caldo. Femminile e avvolgente.',
    notes: {
      top: ['Cocco', 'Frutti'],
      heart: ['Fiori bianchi', 'Gelsomino'],
      base: ['Vaniglia', 'Sandalo', 'Muschio']
    },
    images: ['99ec32a8-9e74-43d7-a1a3-53f82b7eb73b.JPG']
  },
  {
    slug: 'lattafa-sherif',
    name: 'Sherif',
    brand: 'Lattafa (Poise)',
    price: 54.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'uomo',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Fresco verde e fruttato: mela verde, lime e violetta su un cuore aromatico, fondo legnoso e muschiato. Elegante e versatile.',
    notes: {
      top: ['Mela verde', 'Lime', 'Bergamotto'],
      heart: ['Violetta', 'Note verdi'],
      base: ['Legni', 'Muschio', 'Ambra']
    },
    images: ['28d8f0c9-ba7d-4eff-ad9b-25b67b85c00b.JPG']
  },
  {
    slug: 'lattafa-taureau-de-combat',
    name: 'Taureau de Combat',
    brand: 'Lattafa Pride',
    price: 64.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'uomo',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Legnoso-ambrato deciso e virile: spezie e legni su un fondo caldo di vaniglia e ambra. Carattere forte e persistente.',
    notes: {
      top: ['Spezie', 'Bergamotto'],
      heart: ['Legni', 'Fiori'],
      base: ['Vaniglia', 'Ambra', 'Muschio']
    },
    images: ['11fe2883-1db5-47f7-9e43-b9e5f19c7512.JPG', '91002acf-2bb3-4f43-88aa-774a3f5cf5d4.JPG']
  },
  {
    slug: 'lattafa-nasamaat',
    name: 'Nasamaat',
    brand: 'Lattafa',
    price: 44.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'donna',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Floreale-ambrato dolce: fiori bianchi e frutti su un fondo caldo di vaniglia, ambra e muschio. Femminile e raffinato.',
    notes: {
      top: ['Frutti', 'Fiori d\'arancio'],
      heart: ['Gelsomino', 'Fiori bianchi'],
      base: ['Vaniglia', 'Ambra', 'Muschio']
    },
    images: ['2e25099d-7300-4c93-a07c-eb38a1826ed2.JPG']
  },
  {
    slug: 'lattafa-atheeri',
    name: 'Atheeri',
    brand: 'Lattafa',
    price: 49.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'unisex',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Dolce e mielato: miele e fiori bianchi su un fondo caldo e ambrato. Solare, goloso e avvolgente.',
    notes: {
      top: ['Miele', 'Frutti'],
      heart: ['Gelsomino', 'Fiori d\'arancio'],
      base: ['Vaniglia', 'Ambra', 'Legni']
    },
    images: ['35351109-24e8-483a-805b-7ce5c9a98d62.JPG']
  },
  {
    slug: 'lattafa-victoria',
    name: 'Victoria',
    brand: 'Lattafa',
    price: 44.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'donna',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Floreale-gourmand elegante: fiori bianchi e agrumi su un fondo cremoso di vaniglia. Raffinato e luminoso.',
    notes: {
      top: ['Agrumi', 'Frutti'],
      heart: ['Fiori bianchi', 'Gelsomino'],
      base: ['Vaniglia', 'Muschio', 'Legni']
    },
    images: ['ede2edbc-82d1-4bd5-90ba-a2f749be431b.JPG']
  },
  {
    slug: 'lattafa-sakeena',
    name: 'Sakeena',
    brand: 'Lattafa',
    price: 49.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'donna',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Floreale-fruttato caldo: frutti e fiori su un fondo dolce e avvolgente di vaniglia e muschio. Femminile e sofisticato.',
    notes: {
      top: ['Frutti', 'Bergamotto'],
      heart: ['Rosa', 'Fiori bianchi'],
      base: ['Vaniglia', 'Muschio', 'Ambra']
    },
    images: ['db9e5030-3e3d-4a80-931d-4cd0dc74fce4.JPG']
  },
  {
    slug: 'lattafa-eclaire',
    name: 'Eclaire',
    brand: 'Lattafa',
    price: 44.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'donna',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Gourmand goloso: caramello, vaniglia e note dolci-lattiginose. Come un dolce cremoso, caldo e confortevole.',
    notes: {
      top: ['Caramello', 'Note dolci'],
      heart: ['Fiori bianchi', 'Crema'],
      base: ['Vaniglia', 'Fava tonka', 'Muschio']
    },
    images: ['d6c75a11-1474-45fc-83c0-b2a7b3ffbd57.JPG']
  },
  {
    slug: 'lattafa-ana-abiyedh-poudree-air-spray',
    name: 'Ana Abiyedh Poudrée Air Freshener',
    brand: 'Lattafa',
    price: 14.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'unisex',
    intensity: 'Ambiente',
    duration: 'Ambiente',
    tags: [],
    shortDescription: 'Profumatore per ambienti Ana Abiyedh Poudrée 300ml: cipriato pulito e delicato di fiori bianchi e muschio per la casa.',
    notes: { top: ['Fiori bianchi'], heart: ['Note cipriate'], base: ['Muschio', 'Vaniglia'] },
    images: ['31f50e1c-e5bb-4c3f-ad35-290c0ccb454d.JPG']
  },
  {
    slug: 'lattafa-oud-mood-air-spray',
    name: 'Oud Mood Air Freshener',
    brand: 'Lattafa',
    price: 14.99,
    category: 'bakhoor',
    categories: ['bakhoor', 'oud'],
    gender: 'unisex',
    intensity: 'Ambiente',
    duration: 'Ambiente',
    tags: [],
    shortDescription: 'Profumatore per ambienti Oud Mood 300ml: oud caldo, legni e ambra per avvolgere la casa in una scia orientale.',
    notes: { top: ['Spezie'], heart: ['Oud', 'Legni'], base: ['Ambra', 'Muschio'] },
    images: ['1ee9c707-29c9-4748-9ab7-02c721a789bc.JPG']
  },
  {
    slug: 'lattafa-art-of-universe-set',
    name: 'Art of Universe Set Regalo',
    brand: 'Lattafa Pride',
    price: 74.99,
    category: 'set-regalo',
    categories: ['set-regalo'],
    gender: 'uomo',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: ['gift'],
    shortDescription: 'Cofanetto Art of Universe: eau de parfum, spray corpo e profumo tascabile. Fresco-legnoso, il regalo ideale per lui.',
    notes: {
      top: ['Agrumi', 'Spezie'],
      heart: ['Legni', 'Fiori'],
      base: ['Ambra', 'Muschio', 'Vaniglia']
    },
    images: ['c17618dc-9748-4a68-95e5-779c8fa7d89d.JPG']
  },

  // ===================== FRENCH AVENUE =====================
  {
    slug: 'french-avenue-cosmic-tonka',
    name: 'Cosmic Tonka',
    brand: 'French Avenue',
    price: 64.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'unisex',
    intensity: 'Molto intenso',
    duration: '10+ ore',
    tags: ['bestseller'],
    shortDescription: 'Gourmand-ambrato di lusso: fava tonka, vaniglia e note dolci-speziate su un fondo caldo e resinoso. Potente ed elegante.',
    notes: {
      top: ['Spezie', 'Bergamotto'],
      heart: ['Fava tonka', 'Fiori'],
      base: ['Vaniglia', 'Ambra', 'Legni']
    },
    images: ['c25eb50e-b381-4d32-89d2-a2110dff30b7.JPG', 'f4414c4d-348a-4392-87b0-667d73b26de6.JPG']
  },
  {
    slug: 'french-avenue-marmara',
    name: 'Marmara',
    brand: 'French Avenue',
    price: 64.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'unisex',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Legnoso-speziato mediterraneo: pepe e agrumi su un cuore di legni e sandalo, fondo caldo e avvolgente.',
    notes: {
      top: ['Pepe', 'Lime', 'Zafferano'],
      heart: ['Legni', 'Sandalo'],
      base: ['Ambra', 'Muschio', 'Vaniglia']
    },
    images: ['0b771183-5f4c-46f5-a537-4a90c6b8036f.JPG', '76a9c0e6-65f7-4843-b9c3-9ffd51a449c3.JPG']
  },
  {
    slug: 'french-avenue-nomade',
    name: 'Nomade',
    brand: 'French Avenue',
    price: 64.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'unisex',
    intensity: 'Molto intenso',
    duration: '10+ ore',
    tags: [],
    shortDescription: 'Ambrato-legnoso caldo: zafferano e agrumi su un fondo di vaniglia, legni e ambra. Avvolgente e sofisticato.',
    notes: {
      top: ['Zafferano', 'Limone'],
      heart: ['Legni', 'Note ambrate'],
      base: ['Vaniglia', 'Ambra', 'Legno di cedro']
    },
    images: ['87480401-9010-4856-9ec7-b11b5335bb1f.JPG']
  },
  {
    slug: 'french-avenue-liquid-brun',
    name: 'Liquid Brun',
    brand: 'French Avenue',
    price: 59.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'uomo',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Gourmand-legnoso caldo: vaniglia e note tostate su un fondo di legni e ambra. Sensuale e persistente.',
    notes: {
      top: ['Spezie', 'Bergamotto'],
      heart: ['Legni', 'Vaniglia'],
      base: ['Ambra', 'Muschio', 'Fava tonka']
    },
    images: ['e1069d4b-3467-4e34-a428-a0979466dcd6.JPG']
  },
  {
    slug: 'french-avenue-vulcan-baie',
    name: 'Vulcan Baie',
    brand: 'French Avenue',
    price: 49.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'donna',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Fruttato-fresco vivace: frutti di bosco e ribes nero su un cuore aromatico, fondo muschiato. Frizzante e giovane.',
    notes: {
      top: ['Frutti di bosco', 'Lampone', 'Ribes nero'],
      heart: ['Rosmarino', 'Note verdi'],
      base: ['Muschio', 'Legni', 'Ambra']
    },
    images: ['95287404-b2d8-4a4d-9805-a62b141cc0bd.JPG']
  },
  {
    slug: 'french-avenue-vulcan-feu',
    name: 'Vulcan Feu',
    brand: 'French Avenue',
    price: 49.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'unisex',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Fresco fruttato-agrumato: mango, limone e zenzero su un cuore floreale, fondo luminoso e solare.',
    notes: {
      top: ['Mango', 'Limone', 'Zenzero'],
      heart: ['Fiori bianchi', 'Note verdi'],
      base: ['Muschio', 'Legni', 'Ambra']
    },
    images: ['a22ea421-65dd-40ca-995f-4eeb997d8795.JPG']
  },
  {
    slug: 'french-avenue-eclair-affair',
    name: 'Eclair Affair',
    brand: 'French Avenue',
    price: 49.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'donna',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Gourmand goloso: caramello e vaniglia su fiori bianchi, fondo cremoso e dolce. Come un dessert raffinato.',
    notes: {
      top: ['Caramello', 'Note dolci'],
      heart: ['Gelsomino', 'Fiori bianchi'],
      base: ['Vaniglia', 'Fava tonka', 'Muschio']
    },
    images: ['82bb8390-5965-4391-8049-41df3f135304.JPG']
  },
  {
    slug: 'french-avenue-aromatix-xandal',
    name: 'Aromatix Xandal',
    brand: 'French Avenue',
    price: 64.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'unisex',
    intensity: 'Molto intenso',
    duration: '10+ ore',
    tags: [],
    shortDescription: 'Legnoso-cremoso di lusso: sandalo e vaniglia su un fondo caldo e vellutato. Ricco, morbido e persistente.',
    notes: {
      top: ['Spezie', 'Bergamotto'],
      heart: ['Sandalo', 'Fiori'],
      base: ['Vaniglia', 'Ambra', 'Legni']
    },
    images: ['fc0f49af-6216-4979-9b3d-658a70cde5e1.JPG']
  },

  // ===================== BARAKKAT (Fragrance World) =====================
  {
    slug: 'barakkat-rouge-540',
    name: 'Barakkat Rouge 540',
    brand: 'Fragrance World',
    price: 44.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'unisex',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: ['bestseller'],
    shortDescription: 'Iconico ambrato-floreale: zafferano e gelsomino su un fondo di ambroxan e cedro. Ispirato a MFK Baccarat Rouge 540.',
    notes: {
      top: ['Zafferano', 'Gelsomino'],
      heart: ['Ambroxan', 'Legno d\'ambra'],
      base: ['Cedro', 'Muschio', 'Resina']
    },
    images: ['90e6f3fe-5f68-4d57-ba78-39ece48b9b8c.JPG']
  },
  {
    slug: 'barakkat-rouge-540-extrait',
    name: 'Barakkat Rouge 540 Extrait',
    brand: 'Fragrance World',
    price: 44.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'unisex',
    intensity: 'Molto intenso',
    duration: '10+ ore',
    tags: [],
    shortDescription: 'La versione extrait, più intensa e resinosa: zafferano e gelsomino su ambroxan e cedro. Scia potente e duratura.',
    notes: {
      top: ['Zafferano', 'Gelsomino'],
      heart: ['Ambroxan', 'Legno d\'ambra'],
      base: ['Cedro', 'Muschio', 'Resina']
    },
    images: ['8c71211b-2537-455b-b47f-863e5732e5fd.JPG']
  },

  // ===================== ARMAF =====================
  {
    slug: 'armaf-club-de-nuit-bling',
    name: 'Club de Nuit Bling',
    brand: 'Armaf',
    price: 64.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'uomo',
    intensity: 'Molto intenso',
    duration: '10+ ore',
    tags: [],
    shortDescription: 'Fresco-legnoso scintillante della prestigiosa linea Club de Nuit: agrumi frizzanti su un fondo di legni, ambra e muschio.',
    notes: {
      top: ['Bergamotto', 'Agrumi', 'Pepe'],
      heart: ['Legni', 'Gelsomino'],
      base: ['Ambra', 'Muschio', 'Vaniglia']
    },
    images: ['1116b8ab-65f7-4361-8dd7-8d02aa495d42.JPG', '2a0095b6-4305-4b1d-8411-49e00d43e614.JPG']
  },
  {
    slug: 'armaf-club-de-nuit-sillage',
    name: 'Club de Nuit Sillage',
    brand: 'Armaf',
    price: 64.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'unisex',
    intensity: 'Molto intenso',
    duration: '10+ ore',
    tags: [],
    shortDescription: 'Fresco-aromatico dalla scia enorme: agrumi e note verdi su un cuore floreale, fondo ambrato-muschiato. Versatile e potente.',
    notes: {
      top: ['Agrumi', 'Note verdi', 'Ananas'],
      heart: ['Gelsomino', 'Legni'],
      base: ['Ambra', 'Muschio', 'Legno di cedro']
    },
    images: ['75590c12-37c2-4d5b-8cb6-58d3138f3587.JPG']
  },
  {
    slug: 'armaf-ego-exotic',
    name: 'Ego Exotic',
    brand: 'Armaf',
    price: 44.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'uomo',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Gourmand-legnoso: cacao e note dolci su un fondo caldo di legni e ambra. Goloso e avvolgente.',
    notes: {
      top: ['Note dolci', 'Spezie'],
      heart: ['Cacao', 'Fiori'],
      base: ['Legni', 'Vaniglia', 'Ambra']
    },
    images: ['9f0dab20-b0f9-4b66-b2db-9af852f3840f.JPG']
  },

  // ===================== RIIFFS =====================
  {
    slug: 'riiffs-fleurie-emerald',
    name: 'Fleurie Emerald',
    brand: 'Riiffs',
    price: 44.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'donna',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Floreale-fruttato luminoso: agrumi e rosa su un cuore fiorito, fondo caldo e ambrato. Elegante e femminile.',
    notes: {
      top: ['Agrumi', 'Frutti', 'Anice stellato'],
      heart: ['Rosa', 'Fiori bianchi'],
      base: ['Ambra', 'Muschio', 'Legni']
    },
    images: ['4c8f14ea-31f1-43ba-97ee-e06f8884e208.JPG']
  },
  {
    slug: 'riiffs-golden-elixir',
    name: 'Golden Elixir Reserve',
    brand: 'Riiffs',
    price: 44.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'unisex',
    intensity: 'Molto intenso',
    duration: '10+ ore',
    tags: [],
    shortDescription: 'Ambrato-legnoso prezioso: note dorate e resinose su un fondo caldo di legni, ambra e vaniglia. Ricco e sofisticato.',
    notes: {
      top: ['Zafferano', 'Frutti'],
      heart: ['Fiori', 'Legni'],
      base: ['Ambra', 'Vaniglia', 'Muschio']
    },
    images: ['dc379e02-10ab-44bd-bd6d-adb3453ba9e1.JPG']
  },
  {
    slug: 'riiffs-patchouli-de-oro',
    name: 'Patchouli De Oro',
    brand: 'Riiffs',
    price: 44.99,
    category: 'oud',
    categories: ['oud', 'unisex'],
    gender: 'unisex',
    intensity: 'Molto intenso',
    duration: '10+ ore',
    tags: [],
    shortDescription: 'Patchouli-legnoso intenso: patchouli scuro su un fondo di legni, ambra e note resinose. Deciso e persistente.',
    notes: {
      top: ['Spezie', 'Bergamotto'],
      heart: ['Patchouli', 'Legni'],
      base: ['Ambra', 'Muschio', 'Vaniglia']
    },
    images: ['b76b6ccc-4162-471e-bbde-a6e45da427b1.JPG']
  },

  // ===================== MAISON ASRAR =====================
  {
    slug: 'maison-asrar-rey',
    name: 'Rey',
    brand: 'Maison Asrar',
    price: 49.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'uomo',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Legnoso-ambrato regale: spezie e legni su un fondo caldo e avvolgente di ambra e muschio. Elegante e maestoso.',
    notes: {
      top: ['Spezie', 'Bergamotto'],
      heart: ['Legni', 'Fiori'],
      base: ['Ambra', 'Muschio', 'Vaniglia']
    },
    images: ['8b37389f-f4df-4d64-9d62-893adbb85014.JPG', 'b2a9da1b-8920-4f6b-abee-79592990d682.JPG']
  },
  {
    slug: 'maison-asrar-vanilla-voyage',
    name: 'Vanilla Voyage',
    brand: 'Maison Asrar',
    price: 49.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'unisex',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Gourmand alla vaniglia: vaniglia calda e caramello su un fondo dolce e cremoso. Confortevole e avvolgente.',
    notes: {
      top: ['Note dolci', 'Spezie'],
      heart: ['Caramello', 'Fiori'],
      base: ['Vaniglia', 'Fava tonka', 'Muschio']
    },
    images: ['86e18acb-bbca-4a50-8605-b9cfb466fffe.JPG']
  },
  {
    slug: 'maison-asrar-muharib',
    name: 'Muharib',
    brand: 'Maison Asrar',
    price: 69.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'uomo',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Legnoso-aromatico dal carattere forte: agrumi e miele su un cuore di legni e spezie, fondo caldo e persistente.',
    notes: {
      top: ['Agrumi', 'Lavanda', 'Miele'],
      heart: ['Legni', 'Spezie'],
      base: ['Ambra', 'Muschio', 'Vaniglia']
    },
    images: ['88d03e5a-ce47-4182-9820-8ba84996dc3d.JPG']
  },
  {
    slug: 'maison-asrar-faris-al-arab',
    name: 'Faris Al Arab',
    brand: 'Maison Asrar',
    price: 69.99,
    category: 'oud',
    categories: ['oud', 'unisex'],
    gender: 'uomo',
    intensity: 'Molto intenso',
    duration: '10+ ore',
    tags: [],
    shortDescription: 'Oud-legnoso maestoso: spezie e legni preziosi su un fondo profondo di oud, ambra e muschio. Nobile e potente.',
    notes: {
      top: ['Spezie', 'Anice stellato'],
      heart: ['Oud', 'Legni'],
      base: ['Ambra', 'Muschio', 'Vaniglia']
    },
    images: ['acdea310-d652-48ef-9c7c-0dc725df546f.JPG']
  },
  {
    slug: 'maison-asrar-hilm',
    name: 'Hilm',
    brand: 'Maison Asrar',
    price: 64.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'unisex',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Ambrato-legnoso raffinato: note calde e dorate su un fondo di legni, ambra e vaniglia. Elegante e avvolgente.',
    notes: {
      top: ['Spezie', 'Frutti'],
      heart: ['Legni', 'Fiori'],
      base: ['Ambra', 'Vaniglia', 'Muschio']
    },
    images: ['cf52d470-29aa-4b8b-ab07-0d5622630a2d.JPG']
  },
  {
    slug: 'maison-asrar-oh-honey',
    name: 'Oh Honey!',
    brand: 'Maison Asrar',
    price: 59.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'donna',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Goloso e mielato: miele e fiori bianchi su un fondo caldo e dolce di vaniglia e ambra. Solare e sensuale.',
    notes: {
      top: ['Miele', 'Frutti'],
      heart: ['Fiori d\'arancio', 'Gelsomino'],
      base: ['Vaniglia', 'Ambra', 'Muschio']
    },
    images: ['de09e9b0-d05b-432c-a0d9-e8862173885c.JPG']
  },
  {
    slug: 'maison-asrar-tornado',
    name: 'Tornado',
    brand: 'Maison Asrar',
    price: 59.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'uomo',
    intensity: 'Molto intenso',
    duration: '10+ ore',
    tags: [],
    shortDescription: 'Legnoso-ambrato dalla scia esplosiva: spezie e legni su un fondo intenso di ambra e muschio. Potente e magnetico.',
    notes: {
      top: ['Spezie', 'Pepe', 'Bergamotto'],
      heart: ['Legni', 'Fiori'],
      base: ['Ambra', 'Muschio', 'Vaniglia']
    },
    images: ['de5b67c2-eeba-411c-9224-06ec41d3641a.JPG']
  },
  {
    slug: 'maison-asrar-cascade',
    name: 'Cascade',
    brand: 'Maison Asrar',
    price: 49.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'uomo',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Fresco-acquatico elegante: agrumi e note marine su un cuore aromatico, fondo legnoso e muschiato. Pulito e versatile.',
    notes: {
      top: ['Agrumi', 'Note acquatiche'],
      heart: ['Lavanda', 'Fiori'],
      base: ['Legni', 'Muschio', 'Ambra']
    },
    images: ['c8f18104-fa44-4569-9a1d-81a824372f02.JPG']
  },

  // ===================== AFNAN =====================
  {
    slug: 'afnan-ornament-homme',
    name: 'Ornament Pour Homme',
    brand: 'Afnan',
    price: 59.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'uomo',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Legnoso-speziato maschile: spezie e agrumi su un cuore di legni, fondo caldo di ambra e muschio. Deciso e raffinato.',
    notes: {
      top: ['Agrumi', 'Spezie'],
      heart: ['Legni', 'Fiori'],
      base: ['Ambra', 'Muschio', 'Vaniglia']
    },
    images: ['ec891730-82bd-4e5e-bdb6-ead1c987359f.JPG']
  },
  {
    slug: 'afnan-ornament-femme',
    name: 'Ornament Pour Femme',
    brand: 'Afnan',
    price: 59.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'donna',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Ambrato-fruttato femminile: frutti e fiori su un fondo caldo e goloso di vaniglia, ambra e muschio. Sensuale e avvolgente.',
    notes: {
      top: ['Frutti', 'Bergamotto'],
      heart: ['Fiori bianchi', 'Gelsomino'],
      base: ['Vaniglia', 'Ambra', 'Muschio']
    },
    images: ['fed11d0e-02ef-4441-86de-94c67160e820.JPG']
  },

  // ===================== ASDAAF =====================
  {
    slug: 'asdaaf-ameerat-al-arab',
    name: 'Ameerat Al Arab',
    brand: 'Asdaaf (Lattafa)',
    price: 44.99,
    category: 'oud',
    categories: ['oud', 'unisex'],
    gender: 'donna',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Rosa-oud regale: rosa e frutti su un fondo di oud, ambra e vaniglia. Femminile, opulento e persistente.',
    notes: {
      top: ['Frutti', 'Zafferano'],
      heart: ['Rosa', 'Fiori'],
      base: ['Oud', 'Ambra', 'Vaniglia']
    },
    images: ['4e7d2491-f0a7-4a0c-96a0-a9956e8f0fc5.JPG']
  },
  {
    slug: 'asdaaf-ameerat-al-arab-air-spray',
    name: 'Ameerat Al Arab Air Freshener',
    brand: 'Asdaaf (Lattafa)',
    price: 14.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'unisex',
    intensity: 'Ambiente',
    duration: 'Ambiente',
    tags: [],
    shortDescription: 'Profumatore per ambienti Ameerat Al Arab 300ml: rosa, oud e ambra per una casa dalla scia regale e orientale.',
    notes: { top: ['Frutti', 'Zafferano'], heart: ['Rosa'], base: ['Oud', 'Ambra', 'Vaniglia'] },
    images: ['6ca853f2-cd95-415c-be85-34f6885bd28c.JPG']
  },
  {
    slug: 'asdaaf-ya-habibti',
    name: 'Ya Habibti',
    brand: 'Asdaaf (Lattafa)',
    price: 44.99,
    category: 'unisex',
    categories: ['unisex'],
    gender: 'donna',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Floreale-goloso romantico: frutti e fiori su un fondo dolce di vaniglia e caramello. Femminile e avvolgente.',
    notes: {
      top: ['Frutti', 'Bergamotto'],
      heart: ['Fiori bianchi', 'Gelsomino'],
      base: ['Vaniglia', 'Caramello', 'Muschio']
    },
    images: ['dd3e1eed-228b-42cb-af28-4ca421637273.JPG']
  },

  // ===================== ATTRI =====================
  {
    slug: 'attri-ameer-al-oud-vip',
    name: 'Ameer Al Oud VIP',
    brand: 'Attri',
    price: 44.99,
    category: 'oud',
    categories: ['oud'],
    gender: 'uomo',
    intensity: 'Molto intenso',
    duration: '10+ ore',
    tags: [],
    shortDescription: 'Oud-legnoso intenso: spezie e legni su un fondo profondo di oud, ambra e muschio. Il "principe dell\'oud", potente e nobile.',
    notes: {
      top: ['Spezie', 'Bergamotto'],
      heart: ['Oud', 'Legni'],
      base: ['Ambra', 'Muschio', 'Patchouli']
    },
    images: ['58a90bf7-b717-463a-88f4-8f62f1c707d6.JPG']
  },

  // ===================== HERSH =====================
  {
    slug: 'hersh-lahab',
    name: 'Lahab',
    brand: 'Hersh',
    price: 109.99,
    category: 'oud',
    categories: ['oud', 'unisex'],
    gender: 'uomo',
    intensity: 'Molto intenso',
    duration: '10+ ore',
    tags: ['luxury'],
    shortDescription: 'Fragranza di punta legnoso-ambrata: spezie preziose e legni nobili su un fondo caldo e resinoso di ambra e oud. Lusso puro.',
    notes: {
      top: ['Spezie', 'Zafferano', 'Bergamotto'],
      heart: ['Legni', 'Oud', 'Fiori'],
      base: ['Ambra', 'Muschio', 'Vaniglia']
    },
    images: ['c10d307c-2a4e-432a-8c13-73abb0f85935.JPG']
  },

  // ===================== GULF ORCHID =====================
  {
    slug: 'musk-pina-colada',
    name: 'Musk Piña Colada',
    brand: 'Gulf Orchid',
    price: 39.99,
    category: 'musk',
    categories: ['musk', 'unisex'],
    gender: 'unisex',
    intensity: 'Intenso',
    duration: '8-10 ore',
    tags: [],
    shortDescription: 'Muschio tropicale e goloso: cocco e ananas su un fondo di muschio cremoso e vaniglia. Solare, dolce ed estivo.',
    notes: {
      top: ['Ananas', 'Cocco'],
      heart: ['Fiori bianchi', 'Note tropicali'],
      base: ['Muschio', 'Vaniglia', 'Sandalo']
    },
    images: ['db27f66a-3472-4893-9df8-310efa8f3a97.JPG']
  }
];
