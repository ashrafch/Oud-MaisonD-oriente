import type { LegalPageContent } from '@/components/storefront/legal-page';

const updatedAt = '10 giugno 2026';
const seller = "OUDÉ Maison D’Oriente";
const address = 'Via Farini 26/D, 40124 Bologna (BO)';
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'ordini@oude.example';
const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '393331234567';
const fiscalData = process.env.NEXT_PUBLIC_BUSINESS_FISCAL_DATA || 'Dati fiscali, P.IVA e titolare da completare prima della pubblicazione';

export const legalPages: Record<string, LegalPageContent> = {
  about: {
    title: 'La boutique OUDÉ',
    updatedAt: '20 novembre 2026',
    intro: `${seller} è una profumeria araba a Bologna. Puoi scegliere online o venire a trovarci in Via Farini 26/D.`,
    sections: [
      { title: 'La boutique', body: [`Oud, note dolci, fiori e muschi: il nostro catalogo raccoglie profumi di diversi marchi. Se hai un dubbio o cerchi un regalo, raccontaci cosa ti piace e quanto vuoi spendere.`] },
      { title: 'Come lavoriamo', body: ['Nelle schede trovi le note, l’intensità e la disponibilità dei profumi. La durata è indicativa: cambia con la pelle, il clima e la quantità applicata.'] },
      { title: 'Assistenza', body: [`Per un consiglio o una domanda sul tuo ordine, scrivici a ${email} o su WhatsApp al ${whatsapp}.`] }
    ]
  },
  contact: {
    title: 'Contatta la boutique',
    updatedAt: '20 novembre 2026',
    intro: 'Hai un dubbio su un profumo o sul tuo ordine? Scrivici: ti rispondiamo dalla boutique.',
    sections: [
      { title: 'Recapiti', body: [`Negozio: ${seller}. Indirizzo: ${address}. Email: ${email}. WhatsApp: ${whatsapp}.`] },
      { title: 'Orari di risposta', body: ['Rispondiamo a email e messaggi WhatsApp nei giorni lavorativi. Per informazioni su un acquisto, indica il numero ordine.'] },
      { title: 'Dati aziendali', body: [fiscalData] }
    ]
  },
  terms: {
    title: 'Termini e condizioni di vendita',
    updatedAt,
    intro: 'Questi termini regolano gli ordini effettuati sul sito e le richieste assistite inviate alla boutique. Prima della pubblicazione definitiva con dominio proprietario devono essere completati i dati fiscali del venditore.',
    sections: [
      { title: 'Venditore', body: [`Il venditore e ${seller}, con sede/negozio in ${address}. ${fiscalData}.`] },
      { title: 'Prodotti', body: ['Il catalogo comprende profumi, oli, incensi, bakhoor, set regalo e prodotti affini. Le immagini e le descrizioni sono curate per rappresentare il prodotto nel modo piu fedele possibile; lievi differenze di packaging, colore o percezione olfattiva non costituiscono difetto se non incidono sulla conformita del prodotto.'] },
      { title: 'Prezzi', body: ['I prezzi sono indicati in euro. Eventuali costi di spedizione, sconti o promozioni sono mostrati nel riepilogo prima della conferma ordine. Il venditore puo aggiornare prezzi, promozioni e disponibilita del catalogo; per gli ordini online il totale applicato e quello mostrato al momento del checkout.'] },
      { title: 'Ordini online', body: ['Il cliente puo completare l ordine tramite checkout online inserendo dati di contatto, indirizzo di spedizione e metodo di pagamento. Dopo il pagamento confermato, l ordine viene registrato nel pannello gestionale e passa alla preparazione secondo disponibilita e tempi operativi.'] },
      { title: 'Richiesta assistita', body: ['La richiesta ordine assistita resta disponibile per consulenza, verifiche particolari o esigenze non gestibili direttamente online. In questo caso il negozio ricontatta il cliente prima di procedere con pagamento e preparazione.'] },
      { title: 'Pagamento', body: ['Il pagamento online con carta e gestito tramite Stripe. I dati della carta non vengono salvati dal sito: la transazione e processata dal provider di pagamento. Eventuali altri metodi, come PayPal o pagamento assistito, saranno disponibili solo se mostrati nel checkout o concordati con il negozio.'] },
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
      { title: 'Zone servite', body: ['La spedizione e prevista in Italia. Eventuali spedizioni estere devono essere concordate con il negozio prima della preparazione.'] },
      { title: 'Tempi di preparazione', body: ['Gli ordini pagati online vengono preparati dopo conferma del pagamento e controllo operativo della disponibilita. Il tempo medio di preparazione e 1-3 giorni lavorativi, salvo prodotti non disponibili, periodi promozionali o festivita.'] },
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
      { title: 'Spese di restituzione', body: ['Salvo diversa indicazione del venditore, le spese di restituzione sono a carico del cliente. Il rimborso viene effettuato dopo ricezione e verifica del prodotto reso, usando quando possibile lo stesso metodo di pagamento dell ordine originale.'] },
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
      { title: 'Finalita', body: ['I dati sono trattati per rispondere alle richieste, gestire ordini, pagamenti e spedizioni, fornire assistenza, adempiere obblighi fiscali e contabili, prevenire abusi e migliorare il servizio. Newsletter e marketing diretto richiedono consenso o altra base giuridica applicabile.'] },
      { title: 'Base giuridica', body: ['Le basi giuridiche includono esecuzione di misure precontrattuali o contrattuali, obblighi di legge, legittimo interesse alla sicurezza e gestione del servizio, e consenso quando richiesto.'] },
      { title: 'Conservazione', body: ['I dati ordine e fiscali sono conservati per il tempo richiesto dalla normativa contabile e fiscale. I dati di contatto sono conservati per il tempo necessario a gestire la richiesta. I dati marketing sono conservati fino a revoca del consenso o opposizione.'] },
      { title: 'Destinatari', body: ['I dati possono essere comunicati a fornitori tecnici, hosting, database, provider di pagamento, corrieri, consulenti fiscali, strumenti email e soggetti necessari alla gestione dell ordine. I fornitori devono trattare i dati secondo istruzioni e misure adeguate.'] },
      { title: 'Diritti dell interessato', body: ['L utente puo richiedere accesso, rettifica, cancellazione, limitazione, opposizione, portabilita quando applicabile e revoca del consenso. Puo inoltre proporre reclamo all Autorita Garante per la protezione dei dati personali.'] },
      { title: 'Cookie', body: ['Il sito usa cookie tecnici necessari al funzionamento. Cookie analytics, marketing o profilazione devono essere attivati solo dopo adeguata informativa e, quando richiesto, consenso valido tramite banner o piattaforma di gestione consenso.'] }
    ]
  },
  faq: {
    title: 'Domande frequenti',
    updatedAt: '20 novembre 2026',
    intro: 'Le informazioni utili per scegliere e acquistare.',
    sections: [
      { title: 'Come posso pagare?', body: ['Puoi pagare con carta tramite Stripe. Se preferisci parlare con noi prima di acquistare, scegli la richiesta assistita: ti contatteremo per concordare i prossimi passi.'] },
      { title: 'Quando viene preparato l’ordine?', body: ['Prepariamo gli ordini dopo la conferma del pagamento. Conserva il numero mostrato nella pagina di conferma: ci aiuta a ritrovare il tuo acquisto se ci contatti.'] },
      { title: 'Posso chiedere consiglio prima di comprare?', body: [`Certo. Scrivici su WhatsApp al ${whatsapp}: dicci quali profumi o note ti piacciono e quanto vuoi spendere.`] },
      { title: 'Quanto dura un profumo?', body: ['La durata indicata nella scheda è orientativa. Dipende dalla pelle, dal clima, dalla quantità applicata e dalla concentrazione del profumo.'] },
      { title: 'Posso restituire un profumo aperto?', body: ['Per motivi igienici i prodotti sigillati aperti possono non essere idonei al reso. In caso di difetto o prodotto errato contatta subito il negozio.'] },
      { title: 'I coupon sono cumulabili?', body: ['Puoi inserire un codice sconto nel carrello. Se è valido, lo sconto compare nel riepilogo prima del pagamento. Si può usare un solo codice per ordine.'] }
    ]
  }
};
