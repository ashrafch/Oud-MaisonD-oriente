import type { LegalPageContent } from '@/components/storefront/legal-page';

const updatedAt = '3 giugno 2026';
const seller = 'OUDE Maison D Oriente';
const address = 'Via Farini 26/D, 40124 Bologna (BO)';
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'ordini@oude.example';
const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '393331234567';
const fiscalData = process.env.NEXT_PUBLIC_BUSINESS_FISCAL_DATA || 'Dati fiscali, P.IVA e titolare da completare prima della pubblicazione';

export const legalPages: Record<string, LegalPageContent> = {
  about: {
    title: 'Chi siamo',
    updatedAt,
    intro: `${seller} e una boutique dedicata a profumi arabi, oud, musk, attar e rituali olfattivi orientali.`,
    sections: [
      { title: 'La boutique', body: [`Sede operativa: ${address}. Selezioniamo fragranze persistenti e prodotti per la profumazione personale e della casa, con attenzione a consulenza, packaging e assistenza post vendita.`] },
      { title: 'Come lavoriamo', body: ['Ogni scheda prodotto descrive famiglia olfattiva, intensita, durata indicativa, note principali e disponibilita. Le informazioni olfattive sono descrittive e possono variare in base a pelle, ambiente e modalita di applicazione.'] },
      { title: 'Assistenza', body: [`Per consigli prima dell acquisto o supporto ordine puoi scrivere a ${email} o contattarci su WhatsApp al numero ${whatsapp}.`] }
    ]
  },
  contact: {
    title: 'Contatti',
    updatedAt,
    intro: 'Siamo disponibili per informazioni su prodotti, ordini, spedizioni, resi e consulenza olfattiva.',
    sections: [
      { title: 'Recapiti', body: [`Negozio: ${seller}. Indirizzo: ${address}. Email: ${email}. WhatsApp: ${whatsapp}.`] },
      { title: 'Orari di risposta', body: ['Le richieste ricevute tramite email o WhatsApp vengono gestite nei giorni lavorativi. Nei periodi di alta richiesta i tempi di risposta possono allungarsi.'] },
      { title: 'Dati aziendali', body: [fiscalData] }
    ]
  },
  terms: {
    title: 'Termini e condizioni di vendita',
    updatedAt,
    intro: 'Questi termini regolano gli ordini effettuati sul sito. Prima della pubblicazione devono essere completati con i dati fiscali definitivi del venditore.',
    sections: [
      { title: 'Venditore', body: [`Il venditore e ${seller}, con sede/negozio in ${address}. ${fiscalData}.`] },
      { title: 'Prodotti', body: ['Il catalogo comprende profumi, oli, incensi, bakhoor, set regalo e prodotti affini. Le immagini e le descrizioni sono curate per rappresentare il prodotto nel modo piu fedele possibile; lievi differenze di packaging, colore o percezione olfattiva non costituiscono difetto se non incidono sulla conformita del prodotto.'] },
      { title: 'Prezzi', body: ['I prezzi sono indicati in euro. Eventuali costi di spedizione, sconti o promozioni sono mostrati nel riepilogo prima della conferma ordine. Il venditore puo modificare prezzi e disponibilita prima della conferma dell ordine.'] },
      { title: 'Ordine manuale assistito', body: ['In questa fase il checkout registra una richiesta ordine. Dopo l invio, il negozio verifica disponibilita, dati di spedizione e modalita di pagamento, quindi contatta il cliente per la conferma finale. L ordine non si considera pagato online finche non sara integrato Stripe o altro metodo di pagamento definitivo.'] },
      { title: 'Pagamento', body: ['Le modalita di pagamento disponibili vengono comunicate al cliente in fase di conferma. Quando sara attivo il pagamento online, la conferma di pagamento avverra tramite il provider configurato.'] },
      { title: 'Garanzia legale', body: ['Per i consumatori si applica la garanzia legale di conformita prevista dal Codice del Consumo. In caso di prodotto difettoso o non conforme, il cliente deve contattare il venditore fornendo numero ordine, descrizione del problema e foto utili alla valutazione.'] },
      { title: 'Limitazioni d uso', body: ['I prodotti cosmetici o profumati devono essere usati secondo le indicazioni riportate in etichetta. Il cliente e invitato a non usare il prodotto in caso di allergie note o reazioni indesiderate e a verificare ingredienti, avvertenze e modalita d uso prima dell acquisto.'] },
      { title: 'Legge applicabile', body: ['Per i consumatori residenti in Italia si applicano le tutele inderogabili previste dalla normativa italiana ed europea a protezione del consumatore.'] }
    ]
  },
  shipping: {
    title: 'Spedizioni',
    updatedAt,
    intro: 'Questa pagina descrive tempi, costi e modalita operative di spedizione.',
    sections: [
      { title: 'Zone servite', body: ['La spedizione e prevista in Italia. Eventuali spedizioni estere devono essere confermate dal negozio prima del pagamento.'] },
      { title: 'Tempi di preparazione', body: ['Gli ordini vengono preparati dopo conferma disponibilita e pagamento. Il tempo medio di preparazione e 1-3 giorni lavorativi, salvo prodotti non disponibili, periodi promozionali o festivita.'] },
      { title: 'Costi di spedizione', body: ['Il costo di spedizione viene mostrato nel riepilogo ordine. Attualmente la spedizione e gratuita sopra la soglia indicata nel carrello; sotto soglia viene applicato il costo visibile prima della conferma.'] },
      { title: 'Consegna', body: ['Il cliente deve indicare un indirizzo corretto e presidiato. Eventuali ritardi del corriere non imputabili al venditore non costituiscono inadempimento del negozio, ma il venditore fornira supporto per la tracciabilita.'] },
      { title: 'Prodotti danneggiati', body: ['Se il pacco arriva visibilmente danneggiato, il cliente deve segnalarlo subito al corriere e contattare il negozio con foto dell imballo e del prodotto.'] }
    ]
  },
  returns: {
    title: 'Resi e rimborsi',
    updatedAt,
    intro: 'Le regole di recesso e reso seguono la normativa applicabile ai contratti a distanza e le specificita dei prodotti sigillati per igiene.',
    sections: [
      { title: 'Diritto di recesso', body: ['Per gli acquisti a distanza il consumatore ha normalmente 14 giorni dalla ricezione per comunicare il recesso, senza dover indicare una motivazione. La comunicazione va inviata ai recapiti del venditore indicando numero ordine e prodotti interessati.'] },
      { title: 'Eccezioni per prodotti sigillati', body: ['Per ragioni igieniche e sanitarie, prodotti cosmetici, profumi o prodotti sigillati che siano stati aperti dopo la consegna possono non essere idonei al reso se non piu rivendibili o se rientrano nelle eccezioni previste per beni sigillati non restituibili per motivi igienici.'] },
      { title: 'Condizioni del reso', body: ['Il prodotto deve essere integro, completo, non usato, nella confezione originale e con eventuali sigilli non rimossi quando applicabili. Il cliente e responsabile della diminuzione di valore causata da manipolazioni diverse da quelle necessarie a stabilire natura e caratteristiche del bene.'] },
      { title: 'Spese di restituzione', body: ['Salvo diversa indicazione del venditore, le spese di restituzione sono a carico del cliente. Il rimborso viene effettuato dopo ricezione e verifica del prodotto reso.'] },
      { title: 'Prodotto difettoso o errato', body: ['Se il prodotto ricevuto e errato, danneggiato o non conforme, il cliente deve contattare il negozio con numero ordine, foto e descrizione. In questi casi verranno valutati sostituzione, rimborso o altra soluzione conforme alla garanzia legale.'] }
    ]
  },
  privacy: {
    title: 'Privacy policy',
    updatedAt,
    intro: 'Informativa sul trattamento dei dati personali degli utenti che navigano il sito, inviano richieste o effettuano ordini.',
    sections: [
      { title: 'Titolare del trattamento', body: [`Titolare: ${seller}. Sede/negozio: ${address}. Contatto privacy: ${email}. ${fiscalData}.`] },
      { title: 'Dati trattati', body: ['Possiamo trattare dati di navigazione, dati di contatto, dati necessari alla gestione dell ordine, indirizzo di spedizione, telefono, email, contenuto delle comunicazioni e dati tecnici necessari alla sicurezza del sito.'] },
      { title: 'Finalita', body: ['I dati sono trattati per rispondere alle richieste, gestire ordini e spedizioni, fornire assistenza, adempiere obblighi fiscali e contabili, prevenire abusi e migliorare il servizio. Newsletter e marketing diretto richiedono consenso o altra base giuridica applicabile.'] },
      { title: 'Base giuridica', body: ['Le basi giuridiche includono esecuzione di misure precontrattuali o contrattuali, obblighi di legge, legittimo interesse alla sicurezza e gestione del servizio, e consenso quando richiesto.'] },
      { title: 'Conservazione', body: ['I dati ordine e fiscali sono conservati per il tempo richiesto dalla normativa contabile e fiscale. I dati di contatto sono conservati per il tempo necessario a gestire la richiesta. I dati marketing sono conservati fino a revoca del consenso o opposizione.'] },
      { title: 'Destinatari', body: ['I dati possono essere comunicati a fornitori tecnici, hosting, database, corrieri, consulenti fiscali, strumenti email e soggetti necessari alla gestione dell ordine. I fornitori devono trattare i dati secondo istruzioni e misure adeguate.'] },
      { title: 'Diritti dell interessato', body: ['L utente puo richiedere accesso, rettifica, cancellazione, limitazione, opposizione, portabilita quando applicabile e revoca del consenso. Puo inoltre proporre reclamo all Autorita Garante per la protezione dei dati personali.'] },
      { title: 'Cookie', body: ['Il sito usa cookie tecnici necessari al funzionamento. Cookie analytics, marketing o profilazione devono essere attivati solo dopo adeguata informativa e, quando richiesto, consenso valido tramite banner o piattaforma di gestione consenso.'] }
    ]
  },
  faq: {
    title: 'FAQ',
    updatedAt,
    intro: 'Risposte rapide alle domande piu frequenti su prodotti, ordini e assistenza.',
    sections: [
      { title: 'Come funziona il checkout manuale?', body: ['Invii una richiesta ordine con dati cliente e spedizione. Il negozio verifica disponibilita e ti contatta per confermare pagamento e spedizione.'] },
      { title: 'Posso chiedere consiglio prima di comprare?', body: [`Si. Puoi scrivere su WhatsApp al numero ${whatsapp} indicando gusti, occasione d uso e budget.`] },
      { title: 'Quanto dura un profumo?', body: ['La durata indicata in scheda e orientativa. Persistenza e proiezione dipendono da pelle, clima, quantita applicata e concentrazione del prodotto.'] },
      { title: 'Posso restituire un profumo aperto?', body: ['Per motivi igienici i prodotti sigillati aperti possono non essere idonei al reso. In caso di difetto o prodotto errato contatta subito il negozio.'] },
      { title: 'I coupon sono cumulabili?', body: ['Salvo diversa indicazione, i coupon non sono cumulabili. Il carrello applica il codice inserito se attivo e valido.'] }
    ]
  }
};
