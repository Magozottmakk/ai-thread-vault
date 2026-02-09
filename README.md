# AI Thread Vault 🛡️ (v1.5)

Az **AI Thread Vault** egy professzionális Chrome bővítmény, amely lehetővé teszi a beszélgetések mentését és hatékony kontextus-alapú visszaállítását a legnépszerűbb AI felületeken.

### Miért a Thread Vault?
A legtöbb mentőeszközzel ellentétben a Thread Vault a **fájl-alapú visszatöltést** támogatja. Ez megakadályozza a token-túllépést és a kontextusablak telítődését, mivel az AI-ok (ChatGPT, Claude, Gemini) sokkal hatékonyabban dolgozzák fel a csatolt fájlokat, mint a hosszú beillesztett szövegeket.

### Támogatott platformok:
* **ChatGPT** (chatgpt.com)
* **Gemini** (gemini.google.com)
* **Claude** (claude.ai)
* **DeepSeek** (deepseek.com)
* **Perplexity** (perplexity.ai)

### Főbb funkciók:
* **Többformátumú mentés:** Markdown (.md), Modern HTML (Sötét mód támogatással), JSON és TXT.
* **Intelligens fájlnév:** Automatikus AI azonosítás és dátumozás (pl. `Gemini - 2026-02-09.md`).
* **Fájlcsatolás-alapú visszatöltés:** A bővítmény előkészíti a speciális elemzési instrukciót a vágólapra, neked csak a fájlt kell csatolnod.
* **Adatvédelem:** A kód 100%-ban lokálisan fut, nem továbbít adatokat külső szerverre.

### Használati útmutató:

#### Mentés:
1. Kattints a bővítmény ikonjára.
2. Válaszd ki a kívánt formátumot (ajánlott: **Markdown**).
3. Kattints a **📥 Beszélgetés mentése** gombra.

#### Visszatöltés (Restore):
1. Kattints a **📎 Fájl előkészítése** gombra és válaszd ki a korábbi mentést.
2. A bővítmény a vágólapra másolja a kontextus-átadási parancsot.
3. Menj az AI chat ablakba, nyomj **Ctrl+V**-t, majd **csatold (húzd be)** a mentett fájlt.
4. Küldd el az üzenetet – az AI elemezni fogja a fájlt, és készen áll a folytatásra.

### Telepítés:
1. Töltsd le a repozitórium tartalmát.
2. Nyisd meg a Chrome-ban a `chrome://extensions/` oldalt.
3. Kapcsold be a **Fejlesztői módot**.
4. Kattints a **Kicsomagolt bővítmény betöltése** (Load unpacked) gombra és válaszd ki a mappát.

---
*Készítette: József Schell*