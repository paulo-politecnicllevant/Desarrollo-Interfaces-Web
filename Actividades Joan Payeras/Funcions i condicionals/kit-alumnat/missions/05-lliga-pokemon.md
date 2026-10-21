# 🏆 Zona 5 · La Lliga Pokémon: la Pokédex CSS

⏱️ **25 minuts** · Fitxers: `src/scss/pokedex.scss` i la carpeta `src/scss/pokedex/` · Trofeu: 🏆 · [⬅️ Tornar al README](../README.md)

> 🔒 Només pots entrar si tens les 4 medalles: 🔥 💧 🌿 ⚡

---

## 🎬 Història

> *"Has arribat a l'Altiplà Índigo. Sóc el **Campió de la Lliga**. Molts entrenadors arriben fins aquí amb quatre medalles... però pocs saben construir un sistema sencer. El meu repte és senzill d'explicar i difícil de superar: construeix la **Pokédex CSS**, un mini sistema de disseny generat **només** amb mapes, bucles, condicionals i funcions. Aquí no hi ha passos guiats: el disseny és teu. Cada vegada que acabis una part, et faré una pregunta de combat. Preparat?"*

---

## 📋 Preparació (no dona XP)

La Pokédex és un **projecte nou** dins del mateix projecte: tindrà el seu propi fitxer d'entrada i el seu propi CSS.

1. Crea `src/scss/pokedex.scss` (sense guió baix: és un fitxer d'entrada, no un parcial).
2. Crea la carpeta `src/scss/pokedex/`. Hi aniran els teus parcials (`_config.scss`, etc.).
3. Afegeix aquests dos scripts al `package.json` (dins de `"scripts"`, separats per comes):
   ```json
   "lliga:watch": "sass --watch src/scss/pokedex.scss:dist/css/pokedex.css --style=expanded --source-map",
   "lliga:build": "sass src/scss/pokedex.scss:dist/css/pokedex.css --style=compressed --no-source-map"
   ```
4. Atura el watch dels gimnasos (`Ctrl + C`) i engega el de la Lliga: `npm run lliga:watch`.
5. Copia `kit-alumnat/plantilles/pokedex.html` a `src/` i obre'l al navegador.
6. Obre `dist/css/pokedex.css` en una pestanya de VS Code.

> 💡 Dins de `src/scss/pokedex/`, per carregar un altre parcial de la mateixa carpeta: `@use 'config' as c;`. Per reutilitzar les funcions del Gimnàs Elèctric (una carpeta més amunt): `@use '../funcions' as f;`.

---

## 📜 El reglament de la Lliga (requisits)

Has de dissenyar-ho **tu**: quins mapes, quins fitxers, quins noms de variables... L'únic que està fixat és **el nom de les classes**, perquè la pàgina `pokedex.html` les pugui fer servir.

| # | Requisit | Classes que ha de generar |
|---|---|---|
| **L.1** | Un mapa d'**espaiats** que generi marges i paddings. | `.m-0` … `.m-5`, `.mt-2`, `.px-3`, `.py-1`… Lletra 1: `m` (margin) o `p` (padding). Lletra 2 (opcional): `t` top, `r` right, `b` bottom, `l` left, `x` esquerra i dreta, `y` dalt i baix. Número: mida del mapa. |
| **L.2** | Un mapa de **tipus de Pokémon** que generi colors de text, fons i vora, amb una variant **`-suau`** (el mateix color amb un 10% d'opacitat). | `.text-foc`, `.fons-foc`, `.vora-foc`, `.fons-foc-suau`, `.vora-foc-suau`… (per als 6 tipus) |
| **L.3** | Una **tipografia responsiva** amb **3 punts de ruptura**, generada amb `@each` imbricats i media queries. | `.mida-petit`, `.mida-cos`, `.mida-titol`, `.mida-display` (cada una amb una mida diferent a cada punt de ruptura) |
| **L.4** | Mínim **2 funcions pròpies** i **1 mixin que cridi una funció**. | — |
| **L.5** | Tot repartit en **fitxers** amb `@use`. `pokedex.scss` ha de ser **net**: només línies `@use`. | — |

**Valors recomanats** (pots canviar-los):

- Espaiats: `0`, `4px`, `8px`, `16px`, `24px` i `48px` (en el CSS, convertits a `rem`).
- Punts de ruptura: `576px`, `768px` i `1024px`.
- Colors dels tipus: els del Gimnàs de Planta.

---

## 📖 Mini concepte: `@content` (per a L.3 i L.4)

Un mixin pot rebre **un bloc de codi sencer** i posar-lo on vulgui amb `@content`. Va molt bé per a les media queries:

```scss
@mixin a-partir-de-tauleta {
  @media (min-width: 768px) {
    @content;                  // aquí s'enganxa el que posis entre { }
  }
}

.targeta {
  padding: 1rem;

  @include a-partir-de-tauleta {
    padding: 2rem;
  }
}
```

CSS que genera:

```css
.targeta { padding: 1rem; }

@media (min-width: 768px) {
  .targeta { padding: 2rem; }
}
```

I si, en lloc d'escriure `768px` a mà, el mixin demanés el valor a una **funció** que el busqués en un mapa? 🤔

---

## ⚔️ Com es puntua

Cada part (L.1 a L.4) val com una missió: **100 XP** (amb les mateixes reduccions per pistes) **+10** si compila al primer intent.

Quan acabis **cada part**:

1. Comprova-la al CSS i a `pokedex.html`.
2. Respon la seva **pregunta del Campió** a `progres.md`.
3. Aixeca la mà: el Campió (el professor) mirarà el teu CSS i la teva resposta.

---

### L.1 · Espaiats

**🔍 Autocomprovació**
- [ ] `.m-0` → `margin: 0`
- [ ] `.mt-2` → `margin-top: 0.5rem` (si fas servir els valors recomanats)
- [ ] `.px-3` → `padding-left` **i** `padding-right`
- [ ] Al CSS, cap valor està en `px`.

**⚔️ Pregunta del Campió:** *"Quantes classes genera el teu sistema d'espaiats? Escriu la multiplicació i explica d'on surt cada número."*

<details>
<summary>🟢 Pista 1 (suau) · 70 XP</summary>

Comença pel cas més petit: genera només `.m-0` … `.m-5` amb un `@each`. Quan funcioni, pensa: què canvia entre `.m-2`, `.mt-2` i `.p-2`? Cada cosa que canvia pot ser un mapa (o una llista) i un bucle.
</details>

<details>
<summary>🟡 Pista 2 (mitjana) · 50 XP</summary>

Necessites tres bucles imbricats:
1. Propietats: `('m': 'margin', 'p': 'padding')`
2. Costats: `('': null, 't': 'top', ..., 'x': ('left', 'right'), 'y': ('top', 'bottom'))`. La clau buida `''` serveix per a "tots els costats".
3. Mides: el mapa d'espaiats.

El **nom d'una propietat** també es pot interpolar: `#{$propietat}-#{$direccio}: ...;`. I per distingir "tots els costats" dels altres, fes servir un `@if`.
</details>

<details>
<summary>🔴 Pista 3 (forta) · 30 XP</summary>

```scss
@each $lletra, $propietat in $propietats-espai {
  @each $costat, $direccions in $costats {
    @each $nom, $valor in $espaiats {
      .#{$lletra}#{___}-#{___} {
        @if $direccions == ___ {
          #{$propietat}: f.px-a-rem($valor);
        } @else {
          @each $direccio in ___ {
            #{$propietat}-#{___}: f.px-a-rem($valor);
          }
        }
      }
    }
  }
}
```
</details>

---

### L.2 · Colors per tipus

**🔍 Autocomprovació**
- [ ] Hi ha 5 classes per tipus (`text`, `fons`, `vora`, `fons-…-suau`, `vora-…-suau`).
- [ ] `.fons-foc-suau` → `background-color: rgba(240, 128, 48, 0.1)`.
- [ ] El valor `0.1` (l'opacitat) **no** està escrit dins del bucle: és en una variable o en un mapa.

**⚔️ Pregunta del Campió:** *"Per què és millor calcular la variant suau amb `color.change($color, $alpha: ...)` que escriure `rgba(240, 128, 48, 0.1)` a mà?"*

<details>
<summary>🟢 Pista 1 (suau) · 70 XP</summary>

És la missió 3.2 del Gimnàs de Planta amb dues classes més. Quina funció del mòdul `sass:color` canvia **només** l'opacitat d'un color?
</details>

<details>
<summary>🟡 Pista 2 (mitjana) · 50 XP</summary>

`color.change($color, $alpha: $opacitat-suau)` retorna el mateix color amb l'opacitat que li diguis. Guarda'l en una variable local dins de l'`@each` i fes-lo servir a `fons-…-suau` i a `vora-…-suau`.
</details>

<details>
<summary>🔴 Pista 3 (forta) · 30 XP</summary>

```scss
@use 'sass:color';
@use 'config' as c;

@each $tipus, $color in c.$tipus-colors {
  $suau: color.___($color, $alpha: c.___);

  .fons-#{$tipus}-suau {
    background-color: ___;
  }
  // ... i les altres 4 classes
}
```
</details>

---

### L.3 · Tipografia responsiva

**🔍 Autocomprovació**
- [ ] Les classes `.mida-…` tenen una mida **sense** media query (la de mòbil).
- [ ] Hi ha **exactament 3** blocs `@media` al CSS (no un per classe!).
- [ ] Les media queries van **de petita a gran** (`576px`, `768px` i `1024px`).
- [ ] Si fas la finestra del navegador més estreta o més ampla, els títols de `pokedex.html` canvien de mida.

**⚔️ Pregunta del Campió:** *"En quin ordre han d'anar les media queries `min-width` al CSS i què passaria si les generessis a l'inrevés?"*

<details>
<summary>🟢 Pista 1 (suau) · 70 XP</summary>

Necessites dues dades per a cada mida: l'**estil** (`titol`, `cos`...) i el **punt de ruptura** (`sm`, `md`, `lg`). Com ho guardaries en un sol mapa? Recorda els mapes imbricats del Gimnàs de Planta.
</details>

<details>
<summary>🟡 Pista 2 (mitjana) · 50 XP</summary>

- Un mapa `$escala-tipografica` en què cada estil sigui un mapa: `'titol': ('base': 24px, 'sm': 28px, 'md': 32px, 'lg': 40px)`.
- Primer, un `@each` per a les mides `'base'` (sense media query).
- Després, un `@each` **exterior** sobre els punts de ruptura, que obri **una** media query, i a dins un `@each` sobre els estils. Per treure la mida d'aquell punt: `map.get($mides, $punt)`.
</details>

<details>
<summary>🔴 Pista 3 (forta) · 30 XP</summary>

```scss
@each $punt, $amplada in c.$punts-ruptura {
  @include m.des-de(___) {            // el teu mixin amb @content
    @each $estil, $mides in ___ {
      .mida-#{___} {
        font-size: f.px-a-rem(map.get(___, ___));
      }
    }
  }
}
```
</details>

---

### L.4 · Funcions i mixin

**🔍 Autocomprovació**
- [ ] Tens almenys **2** `@function` pròpies que es fan servir a la Pokédex.
- [ ] Tens almenys **1** `@mixin` que, a dins, **crida una de les teves funcions**.
- [ ] Almenys una funció té un `@warn` o un `@error` **útil** (que digui què ha fallat i com arreglar-ho).

**⚔️ Pregunta del Campió:** *"Explica la diferència entre el que fa la teva funció i el que fa el teu mixin, fent servir el teu propi codi com a exemple."*

<details>
<summary>🟢 Pista 1 (suau) · 70 XP</summary>

Revisa el que ja tens: `px-a-rem`, `z`, `contrast-text`... A L.3, el mixin de la media query necessita un número de píxels. D'on el podria treure?
</details>

<details>
<summary>🟡 Pista 2 (mitjana) · 50 XP</summary>

Crea una funció `punt-ruptura($nom)` que, amb `map.has-key` i `map.get`, retorni el valor de `$punts-ruptura` (i que faci un `@error` si el nom no existeix). Després, el mixin de la media query pot fer `@media (min-width: punt-ruptura($nom)) { @content; }`.
</details>

<details>
<summary>🔴 Pista 3 (forta) · 30 XP</summary>

```scss
@function punt-ruptura($nom) {
  @if not map.has-key(c.$punts-ruptura, ___) {
    @error "punt-ruptura: '#{$nom}' no existeix.";
  }
  @return map.get(___, ___);
}

@mixin des-de($nom) {
  @media (min-width: ___($nom)) {
    ___;
  }
}
```
</details>

---

## 🎁 Restriccions de la Lliga · +50 XP cadascuna

| Restricció | Com ho comproves |
|---|---|
| **Zero valors màgics**: cap número ni color escrit fora dels mapes o de les variables de configuració. | Revisa els teus bucles: només hi ha variables? |
| **Cap `@import`**. | `Ctrl + Shift + F` i busca `@import` a `src/scss`. |
| **Un `@warn` útil** que es dispari amb un valor incorrecte. | Prova-ho amb un valor dolent i mira el terminal. Després treu la prova. |
| **CSS comprimit de menys de 20 KB**. | `npm run lliga:build` i després `(Get-Item dist/css/pokedex.css).Length` (en bytes). |

---

## ⚔️ Combat final contra el Campió

Quan tinguis L.1 a L.5 fets, aixeca la mà. El Campió et farà **3 preguntes ràpides** de forma oral:

- una sobre `@if`,
- una sobre `@for` o `@each`,
- una sobre `@function`.

Si les superes, rebràs el **codi del trofeu 🏆**.

> *"...Impressionant. La teva Pokédex s'escriu sola. Des d'avui, el teu nom quedarà gravat al Saló de la Fama."* 👑

👉 Següent: [06-epileg.md](06-epileg.md)
