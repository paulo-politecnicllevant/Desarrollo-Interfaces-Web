# 💧 Zona 2 · Gimnàs d'Aigua: `@for`

⏱️ **15 minuts** · Fitxer: `src/scss/_aigua.scss` · Medalla: 💧 · [⬅️ Tornar al README](../README.md)

> 🔒 Només pots entrar si tens la medalla 🔥.

---

## 🎬 Història

> *"Hola! Sóc la **Misty**, líder del Gimnàs de Ciutat Celeste. La Pokédex nova necessita una graella de **12 columnes**, i també una escala de capes (`z-index`) per als menús. El meu ajudant les ha començat a escriure a mà: `.columna-1`, `.columna-2`... i a la cinquena s'ha equivocat de percentatge! Un bon entrenador d'aigua sap que les coses es fan **fluir**, no s'escriuen una per una."*

---

## 📋 Preparació (no dona XP)

1. Crea el fitxer `src/scss/_aigua.scss` (amb el guió baix davant).
2. Afegeix-lo a `src/scss/main.scss`:
   ```scss
   @use 'foc';
   @use 'aigua';
   ```

---

## 📖 Concepte: el bucle `@for`

`@for` repeteix un bloc **per a una seqüència de números**. A cada volta, la variable (normalment `$i`) val un número diferent.

```scss
@for $i from 1 through 3 {
  .retard-#{$i} {
    animation-delay: $i * 0.2s;
  }
}
```

CSS que genera:

```css
.retard-1 { animation-delay: 0.2s; }
.retard-2 { animation-delay: 0.4s; }
.retard-3 { animation-delay: 0.6s; }
```

Tres idees clau:

1. **Interpolació `#{}`**: per posar el valor d'una variable **dins d'un nom** (un selector, el nom d'una propietat o un text) cal escriure `#{$i}`. En els valors de les propietats no cal: `$i * 0.2s` funciona sol.
2. **`through` o `to`**: hi ha dues maneres d'escriure el final del bucle. Quina diferència hi ha? **Ho descobriràs a la missió 2.1.**
3. **Càlculs moderns**: per dividir no es fa servir `/`, sinó `math.div()`. Per convertir un número a percentatge, `math.percentage()`:
   ```scss
   @use 'sass:math';                        // a dalt de tot del fitxer

   @debug math.div(3, 4);                   // 0.75
   @debug math.percentage(0.75);            // 75%
   ```

---

## 🔮 Missió 2.1 · Descobriment: `to` o `through`? · 100 XP

**Abans d'escriure res**, respon a `progres.md` (🔮 *Prediccions*):

- Quantes classes creus que sortiran amb `@for $i from 1 to 5`?
- I amb `@for $i from 1 through 5`?

Ara escriu a `_aigua.scss` dos bucles de prova:
- un que generi `.prova-to-1`, `.prova-to-2`... amb `from 1 to 5`;
- un altre que generi `.prova-through-1`, `.prova-through-2`... amb `from 1 through 5`.

> ⚠️ Una regla **buida** no surt al CSS. Posa una propietat qualsevol a dins, per exemple `order: $i;`.

Desa, compta les classes de cada tipus a `main.css` i completa *Què ha passat*.

Quan ho tinguis, **comenta o esborra** els dos bucles de prova.

### 🔍 Autocomprovació

- [ ] Has escrit les prediccions **abans** de compilar.
- [ ] Saps quin número és l'últim que genera cada bucle.
- [ ] Pots completar aquesta frase a la teva Pokédex: *"`to` ... i `through` ..."*.

<details>
<summary>🟢 Pista 1 (suau) · la missió valdrà 70 XP</summary>

Fixa't en l'**últim** número de cada bucle al CSS. És el 5 en tots dos casos?
</details>

<details>
<summary>🟡 Pista 2 (mitjana) · la missió valdrà 50 XP</summary>

L'estructura d'un bucle és `@for $i from INICI to FINAL { ... }` (o amb `through`). A dins, la regla `.prova-to-#{$i} { order: $i; }`.
</details>

<details>
<summary>🔴 Pista 3 (forta) · la missió valdrà 30 XP</summary>

```scss
@for $i from 1 ___ 5 {
  .prova-to-#{___} {
    order: $i;
  }
}

@for $i from 1 ___ 5 {
  .prova-___-#{$i} {
    order: ___;
  }
}
```
</details>

---

## ⚔️ Missió 2.2 · La graella de 12 columnes · 100 XP

Genera les classes **`.columna-1`** fins a **`.columna-12`**. Cada una ha de tenir un `width` en percentatge: la columna `n` ocupa `n` dotzenes de l'amplada.

Requisits:
- Guarda el número total de columnes en una variable (`$columnes: 12;`): si un dia en vols 16, només canviaràs una línia.
- Usa `math.div` i `math.percentage` (res de `/` ni de `percentage()` sense `math.`).

### 🔍 Autocomprovació

- [X] Hi ha **exactament 12** classes `.columna-` (compta-les amb `Ctrl + F` i l'expressió regular `^\.columna-`).
- [X] `.columna-3` → `width: 25%`
- [X] `.columna-6` → `width: 50%`
- [X] `.columna-12` → `width: 100%`
- [X] `.columna-1` → `width: 8.3333333333%`
- [X] El terminal **no** mostra cap `DEPRECATION WARNING`.
- [X] Al laboratori, cada fila de la graella ocupa tota l'amplada.

<details>
<summary>🟢 Pista 1 (suau) · la missió valdrà 70 XP</summary>

Quina fracció de l'amplada ocupa la columna 3 d'un total de 12? Com escriuries aquest càlcul amb `$i` i `$columnes`? Necessites que arribi fins al 12 inclòs: `to` o `through`?
</details>

<details>
<summary>🟡 Pista 2 (mitjana) · la missió valdrà 50 XP</summary>

- `@use 'sass:math';` a dalt.
- `@for $i from 1 through $columnes`.
- Selector amb interpolació: `.columna-#{$i}`.
- Valor: `math.percentage(math.div($i, $columnes))`.
</details>

<details>
<summary>🔴 Pista 3 (forta) · la missió valdrà 30 XP</summary>

```scss
@use 'sass:math';

$columnes: ___;

@for $i from 1 ___ $columnes {
  .columna-___ {
    width: math.percentage(math.div(___, ___));
  }
}
```
</details>

---

## ⚔️ Missió 2.3 · L'escala de capes · 100 XP

> ⏩ *Si vas tard de temps, aquesta missió és opcional: pots fer `/saltar`.*

Genera **`.z-1`** fins a **`.z-4`**, amb un `z-index` que sigui un múltiple de 100: `100`, `200`, `300` i `400`.

### 🔍 Autocomprovació

- [ ] Hi ha exactament 4 classes `.z-`.
- [ ] `.z-1` → `z-index: 100` i `.z-4` → `z-index: 400`.
- [ ] El valor és un número sense unitats (`400`, no `400px`).

<details>
<summary>🟢 Pista 1 (suau) · la missió valdrà 70 XP</summary>

És molt semblant a la missió anterior, però el càlcul és encara més senzill. Quina operació converteix 1, 2, 3, 4 en 100, 200, 300, 400?
</details>

<details>
<summary>🟡 Pista 2 (mitjana) · la missió valdrà 50 XP</summary>

Un altre `@for` de l'1 al 4 (inclòs) i, com a valor, `$i * 100`.
</details>

<details>
<summary>🔴 Pista 3 (forta) · la missió valdrà 30 XP</summary>

```scss
@for $i from 1 ___ 4 {
  .z-#{$i} {
    z-index: ___;
  }
}
```
</details>

---

## 🎁 Repte bonus · +50 XP

Afegeix a la graella les classes **`.offset-1`** fins a **`.offset-11`**, que desplacen una columna cap a la dreta amb `margin-left` (en %). Per exemple, `.offset-6` → `margin-left: 50%`.

Per què acaba a l'11 i no al 12? Escriu la resposta a `progres.md`. Per fer el bucle, fes servir la paraula (`to` o `through`) que t'estalviï escriure `11`.

---

## 🏅 Pregunta de medalla: Medalla Cascada 💧

Respon-la a `progres.md` amb les teves paraules i aixeca la mà:

> **"Puc fer servir `@for` per recórrer un mapa de colors com `('foc': #f08030, 'aigua': #6890f0)`? Per què?"**

---

## 📕 Actualitza la Pokédex

A `progres.md`, escriu una línia per a `@for ... through` vs `@for ... to`, *Interpolació `#{}`* i `math.div` i `math.percentage`.

> *"Fluid com un Squirtle! La graella ja corre sola. Ara cap a Ciutat Azulona: l'Erika té un jardí ple de colors per ordenar."* 🌿

👉 Següent: [03-gimnas-planta.md](03-gimnas-planta.md)
