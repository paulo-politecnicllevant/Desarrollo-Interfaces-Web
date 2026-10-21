# 📜 Epíleg: el Saló de la Fama

⏱️ **5 minuts** · Fitxer: `progres.md` · [⬅️ Tornar al README](../README.md)

---

> *"Ha estat un viatge llarg, entrenador. Vas sortir de Poble Paleta escrivint CSS línia a línia, i ara el teu CSS pren decisions, es repeteix sol i fa servir eines que has fabricat tu. Abans de marxar, deixa constància del teu viatge."* — Professor Pi

---

## 1. La teva fitxa final

Completa `progres.md`:

- [ ] Suma tota l'XP del registre de missions i escriu-la a **XP total**.
- [ ] Mira la taula de nivells del [README](../README.md#-xp-nivells-i-medalles) i escriu el teu **nivell**.
- [ ] Comprova que les medalles guanyades estan marcades amb ✅ i tenen el seu codi.

## 2. Resum en 5 línies

A l'apartat *Reflexió final*, escriu **una línia per concepte**, amb les teves paraules, com si ho expliquessis a un company que no ha vingut a classe:

1. `@if / @else`
2. `@for`
3. `@each` i els mapes
4. `@function`
5. Com s'organitza un sistema d'utilitats amb `@use`

## 3. Reflexió

Respon a `progres.md`:

- **Què ha estat el més difícil?**
- **Què t'ha agradat més?**

---

## 🏠 Reptes opcionals per a casa

Tria'n un (o tots dos!):

### 🌙 Repte A · Mode fosc amb variables CSS

Fes que la Pokédex tingui un mode fosc. Genera, amb un `@each` sobre un mapa de temes, **variables CSS** (`--color-fons`, `--color-text`...) dins de `:root` i de `[data-tema="fosc"]`, i fes que les teves classes les facin servir amb `var(--...)`. Després afegeix un botó a `pokedex.html` que canviï l'atribut `data-tema` de l'`<html>`.

*Pregunta per pensar:* per què aquí **no** n'hi ha prou amb un `@if` de Sass?

### 🧲 Repte B · Utilitats de flexbox

Amb un mapa i `@each`, genera utilitats de flexbox:

- `.flex`, `.flex-col`, `.flex-wrap`
- `.justificar-inici`, `.justificar-centre`, `.justificar-final`, `.justificar-entre`
- `.alinear-inici`, `.alinear-centre`, `.alinear-final`
- `.gap-0` … `.gap-5`, reutilitzant el **teu** mapa d'espaiats de la Lliga

*Bonus:* fes-ne versions responsives (`.md:flex-col`...) amb el teu mixin de punts de ruptura. Compte: el `:` s'ha d'escapar al selector (`.md\:flex-col`).

---

> *"Recorda: un bon Campió no és el que mai s'equivoca, sinó el que sap llegir els errors. Fins aviat, entrenador!"* 🎓
