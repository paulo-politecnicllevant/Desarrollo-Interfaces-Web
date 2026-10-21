# 🩺 Centre Pokémon: guia d'errors de Sass

> *"Un error no és una derrota, entrenador: és un Pokémon salvatge que t'està dient exactament on s'amaga. Només cal saber llegir-lo."* — Professor Pi

---

## 1. Anatomia d'un error

Quan una cosa falla, el terminal on tens `npm run sass:watch` mostra un missatge com aquest:

```
Error: There is no module with namespace "math".
   ╷
12 │     width: math.div($i, 12);
   │            ^^^^^^^^^^^^^^^^
   ╵
    src\scss\_aigua.scss 12:12  @use
    src\scss\main.scss 3:1      root stylesheet
```

Llegeix-lo **de dalt a baix**:

| Part | Què et diu | En aquest exemple |
|---|---|---|
| `Error: ...` | **Què** ha passat | No has carregat el mòdul `math`. |
| `12 │ ...` | La **línia** problemàtica | La línia 12. |
| `^^^^^` | **On** és exactament | Just a `math.div(...)`. |
| `_aigua.scss 12:12` | **Fitxer, línia i columna** | `_aigua.scss`, línia 12, columna 12. |
| Línies de sota | **Camí**: qui ha carregat aquest fitxer | `main.scss` l'ha carregat amb `@use` a la línia 3. |

> 💡 A VS Code, prem `Ctrl + G`, escriu el número de línia i hi saltaràs directament.

Quan hi ha un error, **el CSS no s'actualitza**: `main.css` es queda com estava (o mostra el missatge d'error). Si "no canvia res" al navegador, mira primer el terminal.

---

## 2. Avisos (no són errors)

| Missatge | Què vol dir |
|---|---|
| `WARNING: ...` | És un `@warn` (teu o d'algú altre). El CSS sí que s'ha generat. |
| `DEBUG: ...` | És un `@debug` teu. Serveix per veure valors mentre programes. |
| `DEPRECATION WARNING [...]` | Has fet servir sintaxi antiga. Funciona, però deixarà de funcionar. Mira la taula d'equivalències del [README](README.md#-sintaxi-moderna-equivalències). |

---

## 3. Els errors més habituals d'aquest viatge

| Missatge de Sass | Causa probable | Com arreglar-ho |
|---|---|---|
| `There is no module with namespace "math".` (o `"map"`, `"color"`) | Fas servir `math.div()` però no has carregat el mòdul. | Afegeix `@use 'sass:math';` a dalt **d'aquest mateix fitxer**. Cada fitxer carrega els seus mòduls. |
| `@use rules must be written before any other rules.` | Hi ha un `@use` per sota d'una regla, d'un comentari amb codi o d'una variable. | Mou tots els `@use` a les primeres línies. |
| `Can't find stylesheet to import.` | El `@use 'nom';` apunta a un fitxer que no existeix o que té un altre nom. | Comprova que el fitxer existeix i es diu `_nom.scss` (amb guió baix davant). Crea el fitxer **abans** d'afegir el `@use`. |
| `Undefined variable.` | Variable mal escrita, o declarada en un altre fitxer o després d'usar-la. | Revisa l'ortografia (`$colr` ≠ `$color`) i l'ordre. |
| `Undefined mixin.` | Nom del mixin mal escrit, o és en un altre fitxer i no has posat l'espai de noms. | `@include fitxa-tema(...)` si és al mateix fitxer; `@include nom-fitxer.fitxa-tema(...)` si és en un altre. |
| `expected selector.` | Has escrit `.columna-$i` al selector. | En els selectors cal **interpolació**: `.columna-#{$i}`. |
| `expected "=".` | Has escrit `@if $tema = 'fosc'`. | La comparació és amb **dos** iguals: `==`. |
| `expected ")".` | En un mapa t'has deixat una coma entre parelles. | `('foc': #f08030, 'aigua': #6890f0)`: comes entre parelles. |
| `expected "{".` | T'has deixat una clau o un punt i coma. | Revisa la línia indicada **i la d'abans**. |
| `@function rules may not contain declarations.` | Has escrit una propietat CSS (`color: red;`) dins d'una funció. | Les funcions només **retornen valors** amb `@return`. Per escriure propietats, fes servir un mixin. |
| `Function ... finished without @return.` | Hi ha un camí del teu `@if` que no arriba a cap `@return`. | Assegura't que totes les branques retornen alguna cosa. |

---

## 4. Trampes silencioses (no donen error però el resultat no és el que esperes)

Aquestes són les més perilloses perquè **Sass no protesta**. Només les detectaràs si mires el CSS compilat.

| Què veus al CSS | Què ha passat |
|---|---|
| `border-radius: px-a-rem(8px);` (el nom de la funció tal qual) | Has cridat una funció d'un altre fitxer **sense l'espai de noms**. Sass no la coneix i la copia literalment, pensant que és una funció de CSS. Escriu `funcions.px-a-rem(8px)` (o l'àlies que hagis triat). |
| Una propietat **ha desaparegut** | El seu valor era `null`. Passa, per exemple, quan `map.get()` busca una clau que no existeix al mapa. Revisa l'ortografia de la clau. |
| Una regla sencera **no surt** | Era buida: una regla sense cap propietat no s'escriu al CSS. També passa si l'`@if` no ha entrat a cap branca. |
| Els mixins i les funcions **no surten** al CSS | És normal! Només surt el que generen quan els crides. |
| No surt res d'un fitxer nou | Has oblidat afegir el seu `@use` a `main.scss`. |
| `'Fosc'` entra a l'`@else` | Les comparacions de text distingeixen majúscules i minúscules. |
| `0px == 0` és `false` | Per a Sass, un número amb unitat i un número sense unitat no són iguals. |
| El navegador no canvia | Has desat? El *watch* està en marxa? Has refrescat amb `Ctrl + F5`? L'HTML enllaça el CSS correcte? |

---

## 5. Protocol del Centre Pokémon 🏥

Quan alguna cosa no funcioni, segueix aquests passos **en ordre**:

1. **Mira el terminal del watch.** Hi ha un `Error`? Llegeix la primera línia.
2. **Ves al fitxer i a la línia** que t'indica (`Ctrl + G`).
3. **Mira també la línia d'abans**: sovint l'error real (una clau o una coma que falten) és just al damunt.
4. **Compara amb l'exemple del concepte** de la missió.
5. **Fes servir `@debug`** per veure què val una variable:
   ```scss
   @debug $tema;
   @debug map.get($tipus-colors, 'foc');
   ```
6. Si al cap de 3-4 minuts continues encallat, **obre la pista següent**.
