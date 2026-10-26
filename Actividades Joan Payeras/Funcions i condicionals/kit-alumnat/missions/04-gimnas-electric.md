# ⚡ Zona 4 · Gimnàs Elèctric: `@function`

⏱️ **20 minuts** · Fitxers: `src/scss/_funcions.scss` i `src/scss/_electric.scss` · Medalla: ⚡ · [⬅️ Tornar al README](../README.md)

> 🔒 Només pots entrar si tens la medalla 🌿.

---

## 🎬 Història

> *"Hey, recluta! Sóc el **Tinent Surge**. En aquest gimnàs no fabriquem classes: fabriquem **eines**. El meu Pikachu necessita calculadores per al sistema de disseny: una que converteixi píxels a `rem` sense errors, i una altra que tregui valors d'un mapa sense que tot exploti si algú s'equivoca de nom. Pika pika! ⚡"*

---

## 📋 Preparació (no dona XP)

1. Crea `src/scss/_funcions.scss` i `src/scss/_electric.scss`.
2. Afegeix-los a `main.scss` **en aquest ordre**:
   ```scss
   @use 'foc';
   @use 'aigua';
   @use 'tipus';
   @use 'funcions';
   @use 'electric';
   ```

> 💡 `_funcions.scss` no generarà CSS. L'afegim a `main.scss` perquè Sass el llegeixi i puguis veure els teus `@debug` al terminal. Un fitxer que ningú no carrega amb `@use` no s'executa mai.

---

## 📖 Concepte: `@function` i `@return`

Una **funció** rep valors, **calcula** i **retorna un valor** amb `@return`. Es fa servir a la dreta dels dos punts, com qualsevol valor.

```scss
@use 'sass:math';

@function percentatge-de($part, $total: 100) {    // $total té un valor per defecte
  @if $total == 0 {
    @error "percentatge-de: no es pot dividir per zero!";
  }
  @return math.percentage(math.div($part, $total));
}

@debug percentatge-de(25);        // 25%  ($total val 100 per defecte)
@debug percentatge-de(1, 4);      // 25%
```

**Funció o mixin?**

| | `@function` | `@mixin` |
|---|---|---|
| Què fa | Calcula i **retorna un valor** | **Escriu** propietats o regles |
| Com s'usa | `width: nom(...);` | `@include nom(...);` |
| Pot contenir `color: red;`? | ❌ No | ✅ Sí |

**Eines per comunicar-se amb el programador:**

| Directiva | Què fa | Atura la compilació? |
|---|---|---|
| `@debug valor;` | Mostra un valor al terminal | No |
| `@warn "text";` | Mostra un avís | No |
| `@error "text";` | Mostra un error | **Sí** |

**Funcions útils de `sass:math`:**

```scss
@debug math.unit(16px);           // px   (és un text: compara'l amb 'px')
@debug math.unit(2rem);           // rem
@debug math.is-unitless(16);      // true
@debug math.is-unitless(16px);    // false
```

**I un secret:** si una propietat val `null`, **no s'escriu al CSS**.

---

## ⚔️ Missió 4.1 · La calculadora `px-a-rem` · 100 XP

A `_funcions.scss`, crea la funció **`px-a-rem($valor, $base: 16px)`**, que converteixi un valor a `rem` dividint-lo per la `$base`. Ha de gestionar **tots** aquests casos:

| Si `$valor` és... | Ha de retornar |
|---|---|
| zero (`0` o `0px`) | `0` |
| en `px` | el valor en `rem` |
| ja en `rem` | el mateix valor, sense tocar-lo |
| un número sense unitat | el tracta com a px (i, si vols, mostra un `@warn`) |

### 🧪 Taula de proves

Posa aquestes línies **al final** de `_funcions.scss` i mira el terminal. Totes han de donar el resultat esperat:

```scss
@debug px-a-rem(24px);         // 1.5rem
@debug px-a-rem(8px);          // 0.5rem
@debug px-a-rem(0);            // 0
@debug px-a-rem(0px);          // 0
@debug px-a-rem(2rem);         // 2rem
@debug px-a-rem(24);           // 1.5rem
@debug px-a-rem(20px, 10px);   // 2rem
```

### 🔍 Autocomprovació

- [X] Les 7 proves donen el resultat esperat.
- [X] Fas servir `math.div`, `math.unit` i/o `math.is-unitless` (res de `/`, `unit()` ni `unitless()`).
- [X] `px-a-rem(0px)` retorna `0`, no `0rem`. Si no ho fa, llegeix la pista 🟢.
- [X] Quan acabis, **comenta** les línies `@debug` (així no embrutaran el terminal).

<details>
<summary>🟢 Pista 1 (suau) · la missió valdrà 70 XP</summary>

Abans de programar, pensa en l'**ordre** de les preguntes: quin cas és el més "especial" i convé resoldre primer? Una pregunta trampa: per a Sass, `0px == 0` és `true`? Prova-ho amb `@debug 0px == 0;`.
</details>

<details>
<summary>🟡 Pista 2 (mitjana) · la missió valdrà 50 XP</summary>

Una possible seqüència de comprovacions, cadascuna amb el seu `@if` i el seu `@return`:

1. És `0` o `0px`? → `@return 0;`
2. `math.is-unitless($valor)`? → converteix-lo en px multiplicant-lo per `1px` (`$valor: $valor * 1px;`) i continua.
3. `math.unit($valor) == 'rem'`? → `@return $valor;`
4. Finalment: `@return math.div($valor, $base) * 1rem;`

No t'oblidis de `@use 'sass:math';`.
</details>

<details>
<summary>🔴 Pista 3 (forta) · la missió valdrà 30 XP</summary>

```scss
@use 'sass:math';

@function px-a-rem($valor, $base: ___) {
  @if $valor == 0 ___ $valor == 0px {
    @return ___;
  }

  @if math.___($valor) {
    @warn "px-a-rem: '#{$valor}' no té unitat; l'interpreto com a px.";
    $valor: $valor * ___;
  }

  @if math.unit($valor) == ___ {
    @return $valor;
  }

  @return math.div(___, ___) * 1rem;
}
```
</details>

---

## ⚔️ Missió 4.2 · Les capes del Tinent: `z()` · 100 XP

A `_funcions.scss`:

1. Crea el mapa **`$capes-z`**:

| Capa | Valor |
|---|---|
| `'base'` | `1` |
| `'menu'` | `100` |
| `'modal'` | `200` |
| `'notificacio'` | `300` |

2. Crea la funció **`z($capa)`**:
   - Si la capa **existeix** al mapa → retorna el seu valor.
   - Si **no existeix** → mostra un `@warn` que digui quina capa s'ha demanat i retorna `null`.
   - Fes servir `map.has-key()` i `map.get()` (cal `@use 'sass:map';`).

### 🧪 Taula de proves

```scss
@debug z('modal');      // 200
@debug z('base');       // 1
@debug z('drac');       // null  (i un WARNING al terminal)
```

### 🔍 Autocomprovació

- [X] Les 3 proves donen el resultat esperat.
- [X] El `WARNING` diu el nom de la capa que no existeix.
- [X] Comenta els `@debug` quan acabis.

<details>
<summary>🟢 Pista 1 (suau) · la missió valdrà 70 XP</summary>

Abans de treure un valor del mapa, has de fer una pregunta. Quina? I si la resposta és "no", què ha de passar?
</details>

<details>
<summary>🟡 Pista 2 (mitjana) · la missió valdrà 50 XP</summary>

`@if not map.has-key($capes-z, $capa) { @warn ...; @return null; }` i, després, `@return map.get($capes-z, $capa);`
</details>

<details>
<summary>🔴 Pista 3 (forta) · la missió valdrà 30 XP</summary>

```scss
@use 'sass:map';

$capes-z: (
  'base': 1,
  // ...
);

@function z(___) {
  @if ___ map.has-key(___, $capa) {
    @warn "z: la capa '#{___}' no existeix.";
    @return ___;
  }

  @return map.___($capes-z, $capa);
}
```
</details>

---

## ⚔️ Missió 4.3 · Radis i capes, des d'un altre fitxer · 100 XP

> ⏩ *Si vas tard de temps, fes només la part A.*

Ara faràs servir les teves funcions **des d'un altre fitxer**: `_electric.scss`.

### 📖 Recordatori: `@use` i espais de noms

Les funcions d'un altre fitxer s'usen amb un **prefix** (l'espai de noms):

```scss
@use 'funcions';              // prefix: funcions.
// o bé
@use 'funcions' as f;         // prefix curt: f.

.exemple {
  padding: f.px-a-rem(8px);
}
```

> ⚠️ **Trampa silenciosa:** si t'oblides del prefix, Sass **no** dona error. Copia `px-a-rem(8px)` tal qual al CSS (es pensa que és una funció de CSS) i el navegador l'ignora. Mira sempre el CSS!

### Part A: radis

A `_electric.scss`, crea un mapa **`$radis`** i genera **`.radi-1`** fins a **`.radi-6`** amb un `border-radius` en `rem`, convertit amb `px-a-rem`:

| Clau | px |
|---|---|
| `1` | `2px` |
| `2` | `4px` |
| `3` | `8px` |
| `4` | `12px` |
| `5` | `16px` |
| `6` | `24px` |

### Part B: capes

Crea aquestes tres classes fent servir la funció `z()`:

| Classe | Propietats |
|---|---|
| `.menu-pokedex` | `position: relative;` i `z-index` de la capa `'menu'` |
| `.modal-pokedex` | `position: fixed;` i `z-index` de la capa `'modal'` |
| `.drac-perdut` | `position: absolute;` i `z-index` de la capa `'drac'` |

🔮 **Prediu abans de desar:** què sortirà al CSS de `.drac-perdut`? Escriu-ho a `progres.md`.

### 🔍 Autocomprovació

- [X] `.radi-3` → `border-radius: 0.5rem` i `.radi-6` → `border-radius: 1.5rem`.
- [X] Al CSS **no** apareix enlloc el text `px-a-rem(` ni `z(`.
- [X] `.menu-pokedex` → `z-index: 100`.
- [X] Has comprovat la predicció de `.drac-perdut` i saps explicar-la.
- [X] Al laboratori, els quadrats tenen les cantonades cada vegada més arrodonides.

<details>
<summary>🟢 Pista 1 (suau) · la missió valdrà 70 XP</summary>

La part A és com la missió 3.2 del Gimnàs de Planta, però el valor passa per una funció. Has carregat `_funcions.scss` a `_electric.scss`? Amb quin prefix?
</details>

<details>
<summary>🟡 Pista 2 (mitjana) · la missió valdrà 50 XP</summary>

- `@use 'funcions' as f;` a dalt de `_electric.scss`.
- `@each $nom, $px in $radis` → `.radi-#{$nom} { border-radius: f.px-a-rem($px); }`
- `z-index: f.z('menu');`
</details>

<details>
<summary>🔴 Pista 3 (forta) · la missió valdrà 30 XP</summary>

```scss
@use '___' as f;

$radis: (
  1: 2px,
  // ...
);

@each $nom, $px in ___ {
  .radi-#{___} {
    border-radius: ___.px-a-rem(___);
  }
}

.menu-pokedex {
  position: relative;
  z-index: ___('menu');
}
```
</details>

---

## 🎁 Repte bonus · +50 XP

Crea la funció **`escala-modular($pas, $base: 1rem, $ratio: 1.25)`**, que retorni `$base` multiplicat per `$ratio` elevat a `$pas` (fes servir `math.pow`).

```scss
@debug escala-modular(0);    // 1rem
@debug escala-modular(1);    // 1.25rem
@debug escala-modular(3);    // 1.953125rem
@debug escala-modular(-1);   // 0.8rem
```

Després, genera `.mida-pas-0` fins a `.mida-pas-3` a `_electric.scss` amb un `font-size` calculat amb la teva funció.

---

## 🏅 Pregunta de medalla: Medalla Tro ⚡

Respon-la a `progres.md` amb les teves paraules i aixeca la mà:

> **"Puc fer que una `@function` generi una classe CSS (per exemple `.radi-1 { ... }`)? Per què sí o per què no? Què faries servir en lloc seu?"**

---

## 📕 Actualitza la Pokédex

A `progres.md`, escriu una línia per a `@debug`, *`null` com a valor d'una propietat* i *Diferència entre `@function` i `@mixin`*.

> *"Bzzzt! Quatre medalles, recluta. Ja tens totes les eines. Només queda una cosa: l'Altiplà Índigo. La Lliga Pokémon t'espera."* 🏆

👉 Següent: [05-lliga-pokemon.md](05-lliga-pokemon.md)
