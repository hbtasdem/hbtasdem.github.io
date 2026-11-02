---
title: Calculator0
summary: A financial exit planner for abuse survivors that looks and works like an ordinary calculator.
area: security
tags: [swe-ai]
kind: Hackathon · team of 2
role: AES encryption and full-stack development
team: 2 · Hackathon
stack: [React Native, Expo, TypeScript, Flask, Firebase Authentication, AES-256, Gemini, Capital One Nessie API (sandbox)]
highlights:
  - { value: 'AES-256', label: 'encryption of financial data' }
  - { value: 'Decoy PIN', label: 'opens fake data under pressure' }
  - { value: 'Threat model', label: 'phone in the abuser’s hands' }
order: 3
---

## Problem

Financial abuse is one of the main ways abusers keep someone from leaving: paychecks get intercepted, spending gets watched, and saving money raises suspicion. A survivor who wants to plan an exit can’t safely install a budgeting or banking app, because those are exactly the apps an abuser checks.

Everyone has a calculator app, though, and nobody questions it.

## Threat model

<dl class="threat">
  <div><dt>Adversary</dt><dd>Someone with access to the survivor’s phone, who can see which apps are installed, open them, and pressure the survivor to unlock them.</dd></div>
  <div><dt>What we protect</dt><dd>The survivor’s financial data, and the fact that an exit plan exists at all.</dd></div>
  <div><dt>Hackathon scope</dt><dd>We used sandbox bank data from Capital One’s Nessie API, never real accounts.</dd></div>
</dl>

## Design decisions

### A disguise that holds up

The app opens as a working calculator. Nothing on the surface hints at what’s behind it.

### A decoy PIN for when the disguise fails

If the survivor is forced to unlock the app, entering a decoy PIN opens fake data instead of the real plan, so refusing isn’t the only option.

### Encrypting the financial data

I built the encryption layer: the survivor’s transaction data is encrypted with AES-256 before it’s stored for analysis. I also built the app and the Flask backend end to end.

### Spotting abuse patterns

We used Gemini to analyze six months of transactions for patterns like missing deposits, sudden spending restrictions and “allowance” behavior, and to give a LOW, MEDIUM or HIGH risk level. The app also includes a savings planner that estimates what it costs to leave safely.

## Where the hackathon build stopped

The goal was zero-knowledge storage: data that nobody but the survivor can read, including us. Under the hackathon deadline we got as far as server-side encryption, where the server holds the AES key. That was a first layer, but the server could still decrypt everything.

## What I’d do next

- **Move the key to the device.** Derive the encryption key from the survivor’s PIN on the phone, so the server only ever stores ciphertext. That is what makes storage truly zero-knowledge.
- **Use authenticated encryption.** Switch to AES-GCM, so tampered data is detected instead of silently decrypted.
- **Harden sign-in.** Store PINs with a salted, deliberately slow hash such as Argon2.
