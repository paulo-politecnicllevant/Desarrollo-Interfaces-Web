# 🔥 Zona 1 · Gimnàs de Foc: `@if`

⏱️ **15 minuts** · Fitxer: `src/scss/_foc.scss` · Medalla: 🔥 · [⬅️ Tornar al README](../README.md)

---

## 🎬 Història

> *"Així que tu ets el nou entrenador... Sóc en **Blaine**, líder del Gimnàs de l'Illa Cinabri. Tinc un problema: les fitxes dels meus Pokémon s'han de veure diferents segons el tema de la pàgina, fosc o clar. Cada vegada que canvio un color he de tocar desenes de regles a mà! Vull un CSS que **prengui decisions sol**. Si ho aconsegueixes, la Medalla Volcà serà teva."*

---

## 📖 Concepte: condicionals en Sass

`@if` avalua una condició **mentre Sass compila**. Només la branca que es compleix es converteix en CSS. Les altres desapareixen: **el navegador no veu mai l'`@if`**.

```scss
@mixin boto($mida) {
  font-weight: bold;              // fora del condicional: surt SEMPRE

  @if $mida == 'gran' {
    padding: 1rem 2rem;
  } @else if $mida == 'petit' {
    padding: 0.25rem 0.5rem;
  } @else {                       // qualsevol altre valor
    padding: 0.5rem 1rem;
  }
}

.boto-gran {
  @include boto('gran');
}
```

CSS que genera:

```css
.boto-gran {
  font-weight: bold;
  padding: 1rem 2rem;
}
```

**Operadors que pots fer servir a les condicions:**

| Operador | Significat | Exemple |
|---|---|---|
| `==` / `!=` | igual / diferent | `$tema == 'fosc'` |
| `<` `>` `<=` `>=` | comparar números | `$mida > 16px` |
| `and` | les dues coses | `$a > 0 and $b > 0` |
| `or` | almenys una | `$tema == 'fosc' or $tema == 'nit'` |
| `not` | el contrari | `not $actiu` |

> ⚠️ Compte: per comparar es fa servir `==` (dos iguals). Amb un sol `=` Sass dona error.

---

## ⚔️ Missió 1.1 · El mixin de les fitxes · 100 XP

Al fitxer `src/scss/_foc.scss`, crea un mixin anomenat **`fitxa-tema`** que rebi un paràmetre `$tema`.

**Sempre** (sigui quin sigui el tema) ha de posar:
- `padding: 1rem;`
- `border-radius: 8px;`

I a més, **segons el tema**:

| `$tema` | `background-color` | `color` | `border` |
|---|---|---|---|
| `'fosc'` | `#2b2b2b` | `#f5f5f5` | `2px solid #f08030` |
| `'clar'` | `#fff4e6` | `#333` | `2px solid #f5ac78` |
| qualsevol altre valor | `#eee` | `#555` | `2px dashed #999` |

Després aplica'l a aquestes tres classes:

| Classe | Tema |
|---|---|
| `.fitxa-charmander` | `'fosc'` |
| `.fitxa-vulpix` | `'clar'` |
| `.fitxa-growlithe` | `'fosc'` |

### 🔍 Autocomprovació

- [X] El terminal del watch no mostra cap error.
- [X] A `main.css` hi ha **exactament 3** regles que comencen per `.fitxa-`.
- [X] `.fitxa-vulpix` té `background-color: #fff4e6`.
- [X] `.fitxa-charmander` i `.fitxa-growlithe` tenen exactament les mateixes propietats.
- [X] Al CSS **no** apareix ni `@if`, ni `@mixin`, ni la paraula `fosc`.
- [X] Al laboratori, les tres primeres fitxes tenen estil.

<details>
<summary>🟢 Pista 1 (suau) · la missió valdrà 70 XP</summary>

Quantes "branques" ha de tenir el teu condicional? Hi ha dos temes amb nom... i un tercer cas que ha de caçar *tot el que no siguin aquests dos*. Quina paraula clau fa això?

I les propietats que surten sempre, cal posar-les dins de cada branca?
</details>

<details>
<summary>🟡 Pista 2 (mitjana) · la missió valdrà 50 XP</summary>

- Defineix-lo amb `@mixin fitxa-tema($tema) { ... }`.
- Posa `padding` i `border-radius` **fora** del condicional (a dalt).
- Fes una cadena `@if ... == 'fosc'` → `@else if ... == 'clar'` → `@else`.
- Aplica'l a cada classe amb `@include fitxa-tema('...');`.
</details>

<details>
<summary>🔴 Pista 3 (forta) · la missió valdrà 30 XP</summary>

Omple els `___`:

```scss
@mixin fitxa-tema(___) {
  padding: 1rem;
  border-radius: 8px;

  @if $tema ___ 'fosc' {
    background-color: ___;
    color: ___;
    border: ___;
  } ___ $tema == '___' {
    // ...
  } ___ {
    // ...
  }
}

.fitxa-charmander {
  @include ___('fosc');
}
```
</details>

---

## 🔮 Missió 1.2 · Descobriment: valors inesperats · 100 XP

Afegeix aquestes dues classes al final de `_foc.scss`, **però encara no desis**:

```scss
.fitxa-misteri {
  @include fitxa-tema('altre');
}

.fitxa-ponyta {
  @include fitxa-tema('Fosc');
}
```

**Abans de desar**, escriu a `progres.md` (apartat 🔮 *Prediccions*):

- a) Quin `background-color` tindrà `.fitxa-misteri`?
- b) Quin `background-color` tindrà `.fitxa-ponyta`? Fixa't bé en com està escrit el tema.
- c) Si a `.fitxa-growlithe` escrius `fosc` **sense cometes**, funcionarà igual?

Ara desa, mira el CSS i completa la columna *Què ha passat*. Per a la c), prova-ho i després torna a posar les cometes.

### 🔍 Autocomprovació

- [ ] Has escrit les tres prediccions **abans** de compilar.
- [ ] Has comprovat les tres al CSS.
- [ ] Pots explicar amb una frase per què passa la b).

<details>
<summary>🟢 Pista 1 (suau) · la missió valdrà 70 XP</summary>

Mira el CSS de `.fitxa-ponyta`: s'assembla al de Charmander o al del misteri? Per tant, quina branca de l'`@if` s'ha executat?
</details>

<details>
<summary>🟡 Pista 2 (mitjana) · la missió valdrà 50 XP</summary>

Per a Sass, `'Fosc'` i `'fosc'` són exactament el mateix text? Pensa en com compara lletra per lletra.
</details>

<details>
<summary>🔴 Pista 3 (forta) · la missió valdrà 30 XP</summary>

Escriu aquestes línies a dalt de `_foc.scss` i mira què diu el terminal del watch:

```scss
@debug 'Fosc' == 'fosc';
@debug fosc == 'fosc';
```

Després esborra-les.
</details>

---

## ⚔️ Missió 1.3 · La funció `contrast-text` · 100 XP

En Blaine té xapes de colors i vol que el text sempre es llegeixi bé: **text fosc sobre fons clars i text blanc sobre fons foscos**.

### 📖 Mini concepte: funcions i lluminositat

Un **mixin** escriu propietats. Una **funció** només **calcula i retorna un valor** amb `@return` (al Gimnàs Elèctric les estudiarem a fons):

```scss
@function doble($n) {
  @return $n * 2;
}

.caixa {
  margin: doble(8px);   // → margin: 16px;
}
```

Per saber com de clar és un color, el mòdul `sass:color` té `color.channel()`. Retorna la **lluminositat** (de `0%`, negre, a `100%`, blanc):

```scss
@use 'sass:color';   // ⚠️ a la PRIMERA línia del fitxer

@debug color.channel(#6890f0, 'lightness', $space: hsl);   // → 67.45098039215686%
```

### La missió

1. Crea la funció **`contrast-text($fons)`**:
   - Si la lluminositat del `$fons` és **més gran que `50%`**, retorna `#333`.
   - Si no, retorna `#fff`.
2. Crea aquestes tres classes. Cadascuna ha de tenir `background-color` amb el seu color i `color` calculat amb la teva funció:

| Classe | Fons |
|---|---|
| `.xapa-charmander` | `#f08030` |
| `.xapa-magmar` | `#7a1f00` |
| `.xapa-vulpix` | `#ffe0b3` |

🔮 **Prediu abans de desar:** quin color de text tindrà cada xapa? Escriu-ho a `progres.md`.

### 🔍 Autocomprovació

- [ ] Compila sense errors.
- [ ] Cada xapa té un `color` que és `#333` o `#fff` (no el nom de la funció!).
- [ ] Al laboratori, el text de les tres xapes es llegeix bé.

<details>
<summary>👀 Comprova la teva predicció (obre-ho només després de compilar)</summary>

| Xapa | Lluminositat | Text |
|---|---|---|
| Charmander `#f08030` | ≈ 56% | `#333` |
| Magmar `#7a1f00` | ≈ 24% | `#fff` |
| Vulpix `#ffe0b3` | ≈ 85% | `#333` |
</details>

<details>
<summary>🟢 Pista 1 (suau) · la missió valdrà 70 XP</summary>

Una funció no pot escriure `color: ...`. Què ha de fer, doncs, en cada branca de l'`@if`? I has carregat el mòdul que conté `color.channel`?
</details>

<details>
<summary>🟡 Pista 2 (mitjana) · la missió valdrà 50 XP</summary>

- Primera línia del fitxer: `@use 'sass:color';`
- Dins de la funció: `@if color.channel($fons, 'lightness', $space: hsl) > 50% { ... } @else { ... }`
- A cada branca, un `@return` amb el color corresponent.
- A cada classe: `color: contrast-text(#...);`
</details>

<details>
<summary>🔴 Pista 3 (forta) · la missió valdrà 30 XP</summary>

```scss
@use 'sass:color';

// ... el teu mixin ...

@function ___($fons) {
  @if color.channel(___, 'lightness', $space: hsl) ___ 50% {
    ___ #333;
  } @else {
    ___ #fff;
  }
}

.xapa-charmander {
  background-color: #f08030;
  color: ___(#f08030);
}
```
</details>

---

## 🎁 Repte bonus · +50 XP

Fes que el mixin `fitxa-tema` mostri un **avís al terminal** quan rebi un tema desconegut. L'avís ha d'incloure el valor que ha rebut, per exemple:

```
WARNING: fitxa-tema: tema desconegut 'altre'. Usa 'fosc' o 'clar'.
```

<details>
<summary>💡 Una pista per al bonus (no resta XP)</summary>

La directiva és `@warn "text";`. Per posar-hi el valor d'una variable dins del text, fes servir la interpolació: `"... '#{$tema}' ..."`. On l'has de posar perquè només surti amb temes desconeguts?
</details>

---

## 🏅 Pregunta de medalla: Medalla Volcà 🔥

Respon-la a `progres.md` amb les teves paraules i aixeca la mà:

> **"Quina diferència hi ha entre l'`@if` que has fet servir dins del mixin i un condicional que s'executés al navegador (com un `if` de JavaScript o la funció `if()` del CSS modern)?"**

Pista per pensar-hi: obre `dist/css/main.css`. Hi ha cap rastre del teu `@if`? Què passaria si l'usuari canviés el tema de la pàgina *després* de carregar-la?

---

## 📕 Actualitza la Pokédex

A `progres.md` → *La meva Pokédex SCSS*, escriu una línia per a `@if / @else if / @else`, `@function` i `@return` i `@warn`.

> *"Increïble! Les teves fitxes canvien de pell com un Pokémon de foc canvia de flama. La propera parada és Ciutat Celeste: la Misty t'espera al Gimnàs d'Aigua."* 💧

👉 Següent: [02-gimnas-aigua.md](02-gimnas-aigua.md)
