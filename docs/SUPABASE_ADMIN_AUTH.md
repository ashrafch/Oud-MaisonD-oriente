# Supabase Admin Auth

Questa configurazione protegge il pannello `/admin` con Supabase Auth.

## Ruoli usati

- `super_admin`: creatore del progetto, accesso completo.
- `admin`: proprietario/gestore del negozio, accesso admin normale.

Il sito non usa ruoli complessi per i clienti in questa fase.

## Passaggi in Supabase

1. Apri Supabase SQL Editor.
2. Esegui `supabase/migrations/002_admin_auth.sql`.
3. Vai in Authentication > Users.
4. Crea il tuo utente con email e password.
5. Crea l'utente di tuo fratello con email e password.
6. In `.env.local` e su Vercel imposta:

```env
ADMIN_AUTH_ENABLED=true
ADMIN_SUPER_EMAILS=tua-email@example.com
ADMIN_EMAILS=email-tuo-fratello@example.com
```

Puoi separare piu email con virgola.

## Flusso

- Quando un utente fa login su `/admin/login`, il progetto controlla Supabase Auth.
- Se l'email e in `ADMIN_SUPER_EMAILS`, viene assegnato `super_admin`.
- Se l'email e in `ADMIN_EMAILS`, viene assegnato `admin`.
- Se l'email non e autorizzata e non ha gia un profilo admin, l'accesso viene negato.

## Locale

Finche `ADMIN_AUTH_ENABLED=false`, il pannello resta accessibile in modalita sviluppo locale come `super_admin`.
