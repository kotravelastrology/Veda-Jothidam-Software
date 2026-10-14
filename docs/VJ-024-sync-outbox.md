# VJ-024 — optional sync: scopes, outbox, idempotency, revocation

**Delivered:** 2026-09-28 · Deps VJ-011, VJ-012, VJ-022 met · Acceptance:
*scoped access; device outbox; idempotent writes; revocation*

## What this is, and what it is not

**There is no hosted sync service, and none is claimed.** What is delivered is
the client half and the protocol contract: the outbox, the scope model, the
drain loop, and a faithful in-process implementation of the server's rules
that the tests drive.

That is a deliberate boundary. ADR-05 makes sync optional — the product works
fully with the outbox empty and never drained — and writing half a service
that nobody runs is exactly how this repository accumulated the Phase 30
claims that did not hold. The page says so on its face rather than implying a
service exists.

`localSyncService.js` is not a mock returning whatever a test wants. It keeps
its own idempotency ledger, its own resource versions, its own grants and
revocations, and enforces them. When a real service is built it must satisfy
this same contract, and `test-sync-outbox.js` is the specification of what
that means.

## Security first

`backend/.env` was **listed in `.gitignore` but still tracked**, and on a
public remote. Adding a path to `.gitignore` does not untrack a file already
in the index — a trap worth knowing.

It is untracked now (`git rm --cached`, local copy intact). But **the history
still contains it**, as do the `backup/pre-env-strip` refs, so:

> **The `JWT_SECRET_KEY` in `backend/.env` must be treated as compromised and
> rotated.** It is a real 39-character secret, not a placeholder. Untracking
> stops the bleeding; it does not undo the exposure.

`DATABASE_URL` is a local SQLite path with no credentials, so nothing else in
that file needs rotating.

## Scoped access

Six scopes, read and write separate for every resource:

`profiles:read` · `profiles:write` · `consultations:read` ·
`consultations:write` · `journal:read` · `journal:write`

The easy design is one token meaning "this is me", and then every device ever
signed in can read and rewrite everything — including the consultation notes
and client contact details the library holds. A practitioner's phone, a laptop
lent to an assistant and a desktop in a shared office are not the same trust
level, and one token cannot say so.

A token with **no scopes can do nothing**. There is no implicit default,
because the default is what goes wrong. Read does not imply write: a tablet
that shows a chart during a reading has no business rewriting the birth data.

Revocation is reported **before** scope, so a revoked device is told it is
revoked rather than told it lacks a permission — the two call for completely
different actions by whoever reads the message.

## Device outbox

Local changes queue in the ordinary library database (schema **v6**) and drain
later. Writing straight to a server means a change made on a train is lost, or
the UI blocks on the network. Queueing makes offline the normal case, and it
is the only design where "saved" can be true the moment the practitioner stops
typing.

The queue is durable — the test closes the database and reopens it to prove
the queue outlives the process — and drains oldest-first so changes arrive in
the order they were made.

## Idempotent writes

`operationId()` hashes the operation's content. It is **not random**, so the
same change produced twice — by a retried caller, or by a crash between
writing a profile and enqueuing its sync row — is one operation. A random id
would make a retry look like a second edit.

The server keeps a ledger of applied `op_id`s. A redelivery returns
`{ ok: true, applied: false }`: success, because the caller's intent is
satisfied, and `applied: false` so the client can tell "written" from "already
written".

The test exercises the classic failure directly — the write succeeds, the
acknowledgement is lost, the client retries — and asserts the write count and
the resource version both stay at one. A genuinely different edit produces a
different op id and does write.

## Revocation

Revoking stops the **whole drain immediately** rather than offering each
queued operation in turn; continuing is pointless and looks like an attack.
The queued work is kept, not discarded.

The server refuses independently, so a client that ignored its own revocation
still gets nowhere. An unknown device is refused too — registering locally is
not enough.

**A revoked device keeps its row.** Deleting it would lose the record that it
ever had access, which is the first thing anyone asks after revoking one.

## Four failure kinds, deliberately distinguished

| Kind | What happens | Why |
|---|---|---|
| retryable (network, 5xx) | stays pending, `attempts` increments | it may work later |
| blocked (scope refused) | parked in `blocked` | retrying cannot fix a missing scope, and a row retrying forever in silence is how a queue quietly stops working |
| revoked | the drain stops | nothing further will succeed |
| conflict | stays pending, collected | see below |

## Conflicts are surfaced, never resolved

When the server holds a newer version, the operation is **not** applied and
**not** discarded. It stays queued, and the conflict is returned with both
sides — local payload and remote version — for VJ-025 to put in front of a
person.

The one thing worse than a conflict is a silent overwrite. The test asserts
the remote is untouched and the local change is still pending.

## Verified

`npm test` green including `test-sync-outbox.js`; typecheck at its baseline of
20. `/sync` browser-verified: a device added with the read-only preset, then
revoked, with the row surviving and its revocation date shown. Test device
removed from the real library afterwards.

## Not done

- **No hosted service.** The contract and the client half exist; the server
  does not.
- **No transport.** `drainOutbox` takes any object with `apply()`; no HTTP
  client, retry backoff, or TLS handling is written.
- **Nothing enqueues yet.** `saveProfile`, `recordConsultation` and
  `addJournalEvent` do not call `enqueue`, so the outbox only fills when
  something explicitly queues. Wiring that is a small change per call site and
  belongs with a real service.
- **No device authentication.** A grant is identified by `deviceId`; there is
  no token issuance, signing, or expiry. That is the part that needs the
  rotated `JWT_SECRET_KEY` and a real service.
- **Conflict resolution is VJ-025** — conflicts are collected here and go no
  further.
