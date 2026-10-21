# 🌿 Zona 3 · Gimnàs de Planta: mapes i `@each`

⏱️ **20 minuts (sessió 1) + 10 minuts (sessió 2)** · Fitxer: `src/scss/_tipus.scss` · Medalla: 🌿 · [⬅️ Tornar al README](../README.md)

> 🔒 Només pots entrar si tens la medalla 💧.

---

## 🎬 Història

> *"Benvingut al meu jardí. Sóc l'**Erika**, líder del Gimnàs de Ciutat Azulona. La Pokédex necessita un color per a cada tipus de Pokémon, i classes per pintar textos, fons i vores: `.text-foc`, `.fons-aigua`, `.vora-planta`... Si les escrius a mà, hauràs de mantenir desenes de regles. Però si guardes els colors en un **mapa**, com les arrels d'un arbre, totes les classes en creixeran soles."*

---

## 📋 Preparació (no dona XP)

1. Crea `src/scss/_tipus.scss`.
2. Afegeix `@use 'tipus';` a `main.scss`.

---

## 📖 Concepte: llistes, mapes i `@each`

Una **llista** és una col·lecció de valors. Un **mapa** és una col·lecció de parelles **`clau: valor`**, entre parèntesis i separades per comes:

```scss
$regions: kanto, johto, hoenn;                  // llista

$mides-lletra: (                                // mapa
  'petita': 0.875rem,
  'normal': 1rem,
  'gran': 1.25rem,                              // la coma final és opcional
);
```

`@each` recorre una llista o un mapa **element per element**. Amb un mapa, pots recollir la clau i el valor alhora:

```scss
@each $nom, $mida in $mides-lletra {
  .lletra-#{$nom} {
    font-size: $mida;
  }
}
```

CSS que genera:

```css
.lletra-petita { font-size: 0.875rem; }
.lletra-normal { font-size: 1rem; }
.lletra-gran { font-size: 1.25rem; }
```

**`@for` o `@each`?** `@for` compta números (1, 2, 3...). `@each` recorre **col·leccions**: no li cal saber quants elements hi ha.

> 💡 Escriu les claus entre cometes (`'foc'`) i **sense accents** (`electric`, `psiquic`): aniran a parar a noms de classes.

---

## ⚔️ Missió 3.1 · El mapa de tipus · 100 XP

Crea un mapa anomenat **`$tipus-colors`** amb aquests 6 tipus:

| Clau | Color |
|---|---|
| `'foc'` | `#f08030` |
| `'aigua'` | `#6890f0` |
| `'planta'` | `#78c850` |
| `'electric'` | `#f8d030` |
| `'psiquic'` | `#f85888` |
| `'roca'` | `#b8a038` |

🔮 **Prediu abans de desar:** què canviarà a `main.css` quan creïs el mapa? Escriu-ho a `progres.md`.

### 🔍 Autocomprovació

- [ ] Compila sense errors.
- [ ] Has comprovat la teva predicció.
- [ ] Afegeix temporalment `@debug $tipus-colors;` sota el mapa: el terminal ha de mostrar els 6 tipus. Després treu-lo.

<details>
<summary>🟢 Pista 1 (suau) · la missió valdrà 70 XP</summary>

Fixa't en l'exemple `$mides-lletra` del concepte. Quins símbols separen la clau del valor? I una parella de la següent?
</details>

<details>
<summary>🟡 Pista 2 (mitjana) · la missió valdrà 50 XP</summary>

`$tipus-colors: ( 'clau': valor, 'clau': valor, ... );`: parèntesis, dos punts entre clau i valor i comes entre parelles. Si Sass diu `expected ")"`, segurament t'has deixat una coma.
</details>

<details>
<summary>🔴 Pista 3 (forta) · la missió valdrà 30 XP</summary>

```scss
$tipus-colors: (
  'foc': #f08030,
  'aigua': ___,
  ___: #78c850,
  // ... falten 3 tipus més
);
```
</details>

---

## ⚔️ Missió 3.2 · Utilitats de color · 100 XP

Amb **un sol `@each`** sobre `$tipus-colors`, genera per a cada tipus aquestes tres classes:

| Classe | Propietat |
|---|---|
| `.text-{tipus}` | `color: {color};` |
| `.fons-{tipus}` | `background-color: {color};` |
| `.vora-{tipus}` | `border: 2px solid {color};` |

Per exemple, per a `foc`: `.text-foc`, `.fons-foc` i `.vora-foc`.

### 🔍 Autocomprovació

- [ ] Existeixen `.text-foc`, `.fons-aigua` i `.vora-roca` amb el color correcte.
- [ ] Els noms de les classes **no** tenen cometes (`.text-foc`, no `.text-'foc'`).
- [ ] Al laboratori, la secció *Gimnàs de Planta* té colors.

<details>
<summary>🟢 Pista 1 (suau) · la missió valdrà 70 XP</summary>

A cada volta de l'`@each` necessites dues coses: el **nom** del tipus (per al selector) i el **color** (per al valor). Quantes variables ha de tenir el teu `@each`?
</details>

<details>
<summary>🟡 Pista 2 (mitjana) · la missió valdrà 50 XP</summary>

`@each $tipus, $color in $tipus-colors { ... }` i, a dins, **tres** regles. Al selector, interpolació: `.text-#{$tipus}`.
</details>

<details>
<summary>🔴 Pista 3 (forta) · la missió valdrà 30 XP</summary>

```scss
@each ___, ___ in $tipus-colors {
  .text-#{$tipus} {
    color: ___;
  }

  .fons-___ {
    ___: $color;
  }

  // falta la vora
}
```
</details>

---

## 🔮 Missió 3.3 · Descobriment: quantes classes? · 100 XP

**Sense mirar el CSS**, calcula quantes classes `.text-`, `.fons-` i `.vora-` s'han generat **en total**. Escriu el càlcul (no només el resultat) a `progres.md`.

Ara compta-les de veritat:
- **VS Code:** a `main.css`, `Ctrl + F`, activa `.*` i busca `^\.(text|fons|vora)-`.
- **PowerShell:**
  ```powershell
  (Select-String -Path dist/css/main.css -Pattern '^\.(text|fons|vora)-').Count
  ```

### 🔍 Autocomprovació

- [ ] La teva predicció i el recompte coincideixen. Si no, has trobat per què?
- [ ] Si afegissis un 7è tipus al mapa, quantes línies de codi hauries de canviar? Escriu-ho a `progres.md`.

<details>
<summary>🟢 Pista 1 (suau) · la missió valdrà 70 XP</summary>

Quantes voltes fa l'`@each`? I quantes classes crea a cada volta?
</details>

<details>
<summary>🟡 Pista 2 (mitjana) · la missió valdrà 50 XP</summary>

Total = (nombre de tipus) × (classes per tipus).
</details>

<details>
<summary>🔴 Pista 3 (forta) · la missió valdrà 30 XP</summary>

Tipus al mapa: `___`. Classes per volta: `___`. Total: `___ × ___ = ___`.
</details>

---

## 🌙 Final de la sessió 1

Hagis arribat on hagis arribat:

1. Desa tots els fitxers.
2. Actualitza el registre de missions i l'XP de `progres.md`.
3. Omple l'apartat **📍 On m'he quedat** (3 línies).

---

## 🌟 Inici de la sessió 2

1. Obre el projecte i engega `npm run sass:watch`.
2. Rellegeix el teu `progres.md`.
3. Si no havies acabat les missions 3.1 a 3.3, acaba-les primer.

---

## ⚔️ Missió 3.4 · Mapes imbricats: els tons · 100 XP

L'Erika vol **tres tons** per a cada tipus: `clar`, `base` i `fosc`.

### 📖 Mini concepte: mapes dins de mapes

El valor d'un mapa pot ser... **un altre mapa**:

```scss
@use 'sass:map';

$botons: (
  'primari': ('normal': #3b4cca, 'hover': #2a3a9e),
  'perill': ('normal': #e3350d, 'hover': #b02a0a),
);

@debug map.get($botons, 'primari');   // → ("normal": #3b4cca, "hover": #2a3a9e)
```

Si un `@each` et dona, a cada volta, un valor que és un mapa... què pots fer amb aquest mapa? 🤔

### La missió

1. Crea un mapa **`$tipus-tons`** on cada tipus tingui un mapa amb `'clar'`, `'base'` i `'fosc'`:

| Tipus | `'clar'` | `'base'` | `'fosc'` |
|---|---|---|---|
| `'foc'` | `#f5ac78` | `#f08030` | `#9c531f` |
| `'aigua'` | `#9db7f5` | `#6890f0` | `#445e9c` |
| `'planta'` | `#a7db8d` | `#78c850` | `#4e8234` |
| `'electric'` | `#fae078` | `#f8d030` | `#a1871f` |
| `'psiquic'` | `#fa92b2` | `#f85888` | `#a13959` |
| `'roca'` | `#d1c17d` | `#b8a038` | `#786824` |

2. Genera, per a cada tipus i cada to, les classes **`.text-{tipus}-{to}`**, **`.fons-{tipus}-{to}`** i **`.vora-{tipus}-{to}`** (amb les mateixes propietats de la missió 3.2). Per exemple: `.fons-foc-clar`, `.text-aigua-fosc`, `.vora-roca-base`.

🔮 **Prediu abans de desar:** quantes classes noves sortiran? Escriu el càlcul a `progres.md`.

### 🔍 Autocomprovació

- [ ] `.fons-foc-clar` → `background-color: #f5ac78`.
- [ ] `.vora-roca-fosc` → `border: 2px solid #786824`.
- [ ] Recompte amb l'expressió regular `^\.(text|fons|vora)-[a-z]+-(clar|base|fosc)`: coincideix amb la teva predicció?
- [ ] Al laboratori, la fila de tons té tres intensitats per a cada tipus.

<details>
<summary>🟢 Pista 1 (suau) · la missió valdrà 70 XP</summary>

En el primer `@each`, el valor de cada volta ja no és un color: és un mapa de tons. I com es recorre un mapa? Pots posar un bucle **dins** d'un altre bucle.
</details>

<details>
<summary>🟡 Pista 2 (mitjana) · la missió valdrà 50 XP</summary>

- `@each $tipus, $tons in $tipus-tons` → `$tons` és un mapa.
- A dins: `@each $to, $color in $tons` → ara sí, `$color` és un color.
- Selector amb **dues** interpolacions: `.fons-#{$tipus}-#{$to}`.
</details>

<details>
<summary>🔴 Pista 3 (forta) · la missió valdrà 30 XP</summary>

```scss
$tipus-tons: (
  'foc': ('clar': #f5ac78, 'base': #f08030, 'fosc': #9c531f),
  // ... 5 tipus més
);

@each $tipus, ___ in $tipus-tons {
  @each ___, $color in ___ {
    .text-#{$tipus}-#{___} {
      color: $color;
    }
    // falten el fons i la vora
  }
}
```
</details>

---

## 🎁 Repte bonus · +50 XP

Escriure 18 colors a mà és cansat i és fàcil equivocar-se. Construeix un mapa **`$tons-automatics`** amb la mateixa forma que `$tipus-tons`, però **generat automàticament** a partir de `$tipus-colors`:

- `'clar'`: el color barrejat amb blanc → `color.mix(#fff, $color, 35%)`
- `'base'`: el color tal qual
- `'fosc'`: el color barrejat amb negre → `color.mix(#000, $color, 35%)`

Comprova'l amb `@debug $tons-automatics;`.

<details>
<summary>💡 Una pista per al bonus (no resta XP)</summary>

Comença amb un mapa buit, `$tons-automatics: ();`, i a cada volta d'un `@each` sobre `$tipus-colors` **afegeix-hi** una parella nova amb `map.merge($tons-automatics, ( $tipus: (...) ))`. Recorda que cal tornar a assignar el resultat a la variable i que necessites `@use 'sass:map';` i `@use 'sass:color';`.
</details>

---

## 🏅 Pregunta de medalla: Medalla Arc de Sant Martí 🌿

Respon-la a `progres.md` amb les teves paraules i aixeca la mà:

> **"Quantes classes genera un `@each` imbricat amb 6 tipus i 3 tons per a 3 propietats? Explica d'on surt cada número."**

El Professor Pi et pot fer una variant d'aquesta pregunta per comprovar que no t'has après el número de memòria.

---

## 📕 Actualitza la Pokédex

A `progres.md`, escriu una línia per a *Mapes*, `@each` i `@each` imbricat.

> *"Quin jardí més ben ordenat! Amb un sol mapa n'has fet créixer desenes de classes. L'última parada abans de la Lliga és Ciutat Carmí: el Tinent Surge i el seu Pikachu ja carreguen energia."* ⚡

👉 Següent: [04-gimnas-electric.md](04-gimnas-electric.md)
