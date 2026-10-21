# ⚒️ La Forja de Components: Lliga Pokémon SCSS

> *"Benvingut, entrenador! Sóc el **Professor Pi**. Molts entrenadors saben escriure CSS a mà, línia a línia... però els grans Campions de la Lliga fan que el CSS s'escrigui sol. En aquest viatge aprendràs a pensar com un programador de Sass: a prendre decisions amb `@if`, a repetir sense cansar-te amb `@for` i `@each` i a fabricar les teves pròpies eines amb `@function`. Quatre gimnasos i una Lliga t'esperen. Som-hi!"*

---

## 🎯 Què aprendràs

Quan acabis el viatge seràs capaç de:

1. Escriure condicionals `@if / @else if / @else` dins de mixins i funcions.
2. Triar entre `@for` (seqüències de números, `from..through` o `from..to`) i `@each` (llistes i mapes).
3. Crear funcions amb `@function` i `@return`, i explicar la diferència amb un mixin.
4. Generar un sistema d'utilitats CSS (espaiats, colors, tipografia responsiva) a partir de mapes.
5. Llegir el CSS compilat i comprovar que fa el que esperaves.

---

## 🗺️ Mapa del viatge (110 minuts, 2 sessions)

| Sessió | Zona | Concepte | Fitxer de la missió | Temps | Fitxa |
|---|---|---|---|---|---|
| 1 | 🏠 Poble Paleta | Preparació | `progres.md`, `src/laboratori.html` | 5 min | [00-poble-paleta.md](missions/00-poble-paleta.md) |
| 1 | 🔥 Gimnàs de Foc | `@if` | `src/scss/_foc.scss` | 15 min | [01-gimnas-foc.md](missions/01-gimnas-foc.md) |
| 1 | 💧 Gimnàs d'Aigua | `@for` | `src/scss/_aigua.scss` | 15 min | [02-gimnas-aigua.md](missions/02-gimnas-aigua.md) |
| 1 → 2 | 🌿 Gimnàs de Planta | mapes i `@each` | `src/scss/_tipus.scss` | 20 + 10 min | [03-gimnas-planta.md](missions/03-gimnas-planta.md) |
| 2 | ⚡ Gimnàs Elèctric | `@function` | `src/scss/_funcions.scss`, `src/scss/_electric.scss` | 20 min | [04-gimnas-electric.md](missions/04-gimnas-electric.md) |
| 2 | 🏆 Lliga Pokémon | Tot junt | `src/scss/pokedex.scss` i `src/scss/pokedex/` | 25 min | [05-lliga-pokemon.md](missions/05-lliga-pokemon.md) |
| 2 | 📜 Epíleg | Reflexió | `progres.md` | 5 min | [06-epileg.md](missions/06-epileg.md) |

Al principi de la sessió 2, rellegeix el teu `progres.md` (sobretot l'apartat *On m'he quedat*) i, si no vas acabar el Gimnàs de Planta, acaba'l primer.

---

## 🔁 Com es juga cada missió

Totes les missions segueixen el mateix cicle:

1. 🎬 **Història**: un personatge et fa un encàrrec.
2. 📖 **Concepte**: una explicació curta amb un exemple. **Llegeix-la abans d'escriure res**, i si vols, prova l'exemple.
3. 🔮 **Prediu** (només en algunes missions): abans de compilar, escriu a `progres.md` què creus que passarà. Encertar no és el que compta: el que compta és pensar-ho *abans*.
4. ⚔️ **Missió**: escrius el codi al fitxer indicat. Ningú no te l'escriu.
5. 🔍 **Autocomprovació**: compiles, obres `dist/css/main.css` i marques la llista de comprovacions.
6. 🏅 **Recompensa**: apuntes l'XP a `progres.md`. Al final de cada gimnàs hi ha una **pregunta de medalla**.

---

## 📜 Regles d'or del joc

1. **Una missió cada vegada i en ordre.** No passis a la següent fins que la teva autocomprovació estigui tota marcada.
2. **Primer el concepte, després el codi.**
3. **Prediu abans de compilar** quan la missió t'ho demani (🔮). Escriu la predicció a `progres.md` *abans* de mirar el resultat.
4. **Les pistes van en ordre.** Cada missió té 3 pistes amagades (🟢 suau, 🟡 mitjana i 🔴 forta). Obre-les **d'una en una** i només si estàs encallat més de 3-4 minuts. Apunta la pista més alta que hagis obert.
5. **La solució només la té el Professor Pi** (el teu professor). Si la demanes, te l'explicarà línia per línia, però la missió només et donarà 20 XP.
6. **L'error és part del joc.** Si Sass et dona un error, no ho esborris tot: llegeix-lo amb la [guia d'errors](guia-errors.md). Diu el fitxer, la línia i la columna.
7. **Sempre compila i mira el CSS.** El CSS compilat és la prova de si el teu codi fa el que creus.
8. **Sintaxi moderna de Sass.** Fes servir els mòduls (`sass:math`, `sass:map`, `sass:color`). Consulta la taula de sota.
9. **Actualitza `progres.md`** cada vegada que acabes una missió.
10. **No copiïs codi** (ni d'un company ni d'una IA). La pregunta de medalla descobrirà si ho has entès, i sense medalla no hi ha Lliga.

---

## ⌨️ Les "comandes" del joc

El joc original es jugava parlant amb una IA. Aquí tens l'equivalent:

| Comanda | Què fas tu |
|---|---|
| `/pista` | Obre la pista següent de la missió (🟢 → 🟡 → 🔴). |
| `/solucio` | Aixeca la mà i demana-la al professor. La missió valdrà 20 XP. |
| `/estat` | Mira la teva fitxa a `progres.md`. |
| `/pokedex` | Rellegeix l'apartat *La meva Pokédex SCSS* de `progres.md`. |
| `/saltar` | Apunta la missió com a saltada (0 XP) i passa a la següent. |
| `/reptebonus` | Fes el 🎁 repte bonus de la zona (al final de cada fitxa). |
| `/reset` | Comenta tot el codi de la zona (`Ctrl + K`, `Ctrl + C` a VS Code) i torna-hi des de la primera missió de la zona. |

---

## ⭐ XP, nivells i medalles

**XP de cada missió**

| Com l'has acabat | XP |
|---|---|
| Sense obrir cap pista | **100** |
| Has obert fins a la pista 🟢 1 | **70** |
| Has obert fins a la pista 🟡 2 | **50** |
| Has obert fins a la pista 🔴 3 | **30** |
| Has demanat la solució al professor | **20** |
| Has saltat la missió | **0** |
| **Extra:** ha compilat bé al primer intent | **+10** |
| **Extra:** repte bonus completat | **+50** |

**Nivells**

| Nivell | XP necessària |
|---|---|
| Nv. 1 | 0 |
| Nv. 2 | 150 |
| Nv. 3 | 350 |
| Nv. 4 | 550 |
| Nv. 5 | 750 |
| Nv. 6 | 950 |
| 👑 Campió de la Lliga | 1100 |

**Medalles i barrera de comprensió**

Al final de cada gimnàs hi ha una **pregunta de medalla**:

1. Escriu la resposta, amb les teves paraules, a `progres.md`.
2. Aixeca la mà. El Professor Pi la llegirà (o te la farà oralment).
3. Si és correcta, et dirà un **codi de medalla** secret. Escriu-lo a `progres.md` i pinta la medalla (canvia ⬜ per ✅).
4. Si no ho és, t'ho explicarà amb un altre exemple i t'ho tornarà a preguntar.

**Sense medalla no es pot entrar al gimnàs següent.**

---

## 🛠️ Compilar i mirar el CSS

Treballa sempre amb **dos terminals** oberts a VS Code (`Terminal > Nou terminal`):

| Terminal | Ordre | Per a què |
|---|---|---|
| 1 | `npm run sass:watch` | Recompila cada vegada que deses. El CSS surt **expandit** (fàcil de llegir) a `dist/css/main.css`. Aquí veuràs també els errors, els `@warn` i els `@debug`. |
| 2 | lliure | Per comptar classes, etc. |

`npm run sass:build` genera el CSS **comprimit** (una sola línia). Usa'l només al final, per mesurar quant ocupa.

**Truc per comptar classes a VS Code:** obre `dist/css/main.css`, prem `Ctrl + F`, activa les expressions regulars (icona `.*` o `Alt + R`) i escriu, per exemple, `^\.columna-`. VS Code et dirà "1 de 12".

**Truc per comptar classes al terminal (PowerShell):**

```powershell
(Select-String -Path dist/css/main.css -Pattern '^\.columna-').Count
```

---

## 🆕 Sintaxi moderna: equivalències

Si escrius la sintaxi antiga, funciona, però Sass et mostrarà un `DEPRECATION WARNING`: vol dir que deixarà de funcionar en el futur.

| ❌ Antic (deprecat) | ✅ Modern | Mòdul que cal carregar |
|---|---|---|
| `$a / $b` | `math.div($a, $b)` | `@use 'sass:math';` |
| `percentage(0.25)` | `math.percentage(0.25)` | `@use 'sass:math';` |
| `unit($n)` | `math.unit($n)` | `@use 'sass:math';` |
| `unitless($n)` | `math.is-unitless($n)` | `@use 'sass:math';` |
| `pow($a, $b)` | `math.pow($a, $b)` | `@use 'sass:math';` |
| `map-get($m, $k)` | `map.get($m, $k)` | `@use 'sass:map';` |
| `map-has-key($m, $k)` | `map.has-key($m, $k)` | `@use 'sass:map';` |
| `map-merge($a, $b)` | `map.merge($a, $b)` | `@use 'sass:map';` |
| `darken($c, 10%)` | `color.adjust($c, $lightness: -10%)` | `@use 'sass:color';` |
| `lighten($c, 10%)` | `color.adjust($c, $lightness: 10%)` | `@use 'sass:color';` |
| `rgba($c, 0.1)` | `color.change($c, $alpha: 0.1)` | `@use 'sass:color';` |
| `@import 'fitxer';` | `@use 'fitxer';` | — |

> ⚠️ Els `@use` van **sempre a dalt de tot** del fitxer, abans de qualsevol altra regla.

---

## 📁 Com quedarà el teu projecte al final

```
Funcions i condicionals/
├── package.json
├── progres.md                 ← la teva fitxa d'entrenador
├── dist/css/
│   ├── main.css               ← CSS dels gimnasos
│   └── pokedex.css            ← CSS de la Lliga
└── src/
    ├── index.html
    ├── laboratori.html        ← per veure els gimnasos al navegador
    ├── pokedex.html           ← per veure la Lliga al navegador
    └── scss/
        ├── main.scss          ← només @use
        ├── _foc.scss          🔥
        ├── _aigua.scss        💧
        ├── _tipus.scss        🌿
        ├── _funcions.scss     ⚡
        ├── _electric.scss     ⚡
        ├── pokedex.scss       🏆 (només @use)
        └── pokedex/           🏆 (els fitxers que dissenyis tu)
```

Comença per 👉 [missions/00-poble-paleta.md](missions/00-poble-paleta.md)
