# Operazioni produzione

## Monitoraggio

`Production smoke monitoring` in GitHub Actions esegue ogni 30 minuti controlli HTTP su storefront, database (`/api/health`), header e otto API admin senza sessione. Si puo eseguire manualmente da Actions > Production smoke monitoring > Run workflow. Un run fallito e visibile in Actions; le notifiche dipendono dalle preferenze GitHub del proprietario. Lo scheduler GitHub puo subire ritardi: non costituisce SLA di uptime.

Il controllo legge solo dati pubblici, non crea ordini, non invia email e non esegue pagamenti. La route health non restituisce configurazioni o errori DB al pubblico. Vercel Runtime Logs serve per indagare errori durante le richieste; il monitoraggio esterno non sostituisce error tracking o alert di pagamento.

## Backup e ripristino

Il progetto Supabase e sul piano Free. Non presumere backup automatici recuperabili dal pannello: la procedura operativa richiede esportazioni fuori dal progetto. Prima di dichiarare completato il backup occorre eseguire un'esportazione reale, conservarla in una destinazione privata, e provarne il ripristino su un ambiente isolato.

Prerequisiti da configurare dal proprietario: autenticazione Supabase CLI (`supabase login`), destinazione privata esterna al repository e credenziali della connessione database. Non inviare credenziali in chat o committarle. La CLI locale installata tramite npx e la v3: verificare `supabase db dump --help` prima dell'uso e selezionare esplicitamente il progetto remoto `bpccayvecjyurladprag`.

Esportare ruoli, schema e dati con i tre modi documentati di `supabase db dump` (`--role-only`, schema predefinito, `--data-only --use-copy`), sempre specificando `--remote=bpccayvecjyurladprag` e `--file` verso la destinazione privata. Non usare SQL Editor per leggere file del server.

Gli oggetti Supabase Storage NON sono inclusi nel dump DB. Copiare separatamente tutti gli oggetti del bucket `product-images` con il client Storage autenticato, mantenendo path e checksum. Non eliminare oggetti sorgente durante il backup.

Conservare almeno sette copie giornaliere e quattro settimanali in uno storage cifrato, con accesso limitato. Non inserire dati clienti negli artifact pubblici GitHub o nel repository.

Ripristino: creare un ambiente isolato, seguire la guida Supabase CLI ufficiale per importare ruoli/schema/dati e oggetti Storage, confrontare conteggi, vincoli e checksum, poi provare catalogo e stock con le query di test in `supabase/tests`. NON ripristinare sulla produzione come prova. Documentare data, destinazione, conteggi e risultato del test; l'esistenza di un file non dimostra che sia ripristinabile.

Fonti: https://supabase.com/docs/guides/platform/backups e https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore

## Password compromesse

La protezione Supabase HaveIBeenPwned e disponibile dal piano Pro. Sul Free non e attivabile. Nessun upgrade a pagamento e stato autorizzato/eseguito. Le credenziali degli admin devono essere uniche e gestite dal proprietario; il codice applica allowlist server e rate limit login.

Fonte: https://supabase.com/docs/guides/auth/password-security

## Test autenticati

Il titolare effettua login direttamente su `/admin`; non condividere password, cookie o token. Verificare dashboard, lettura prodotti/ordini, caricamento di una immagine raster di prova, rifiuto di un file non immagine, logout e nuovo rifiuto delle API. Non salvare prodotti di prova nel catalogo reale e non testare rimborsi su ordini clienti.

## Rollback

Per un problema applicativo usare il deployment Production precedente da Vercel. Le migrazioni aggiungono funzioni e riducono privilegi: non revocare RLS o riaprire UPDATE del ruolo per aggirare un errore. Verificare sempre il commit attivo e l'alias pubblico dopo il rollback. Ripristinare auto-assignment se la procedura Vercel lo disabilita.
