# 🏠 Zona 0 · Poble Paleta: preparació

⏱️ **5 minuts** · No dona XP (és preparació) · [⬅️ Tornar al README](../README.md)

---

## 🎬 Història

> *"Bon dia, entrenador! Abans de sortir de viatge, tot entrenador passa pel meu laboratori a buscar l'equip. Al final del viatge construiràs la **Pokédex CSS**: un petit sistema de disseny que s'escriu sol a partir de mapes, bucles i funcions. Però primer, comprovem la motxilla."*

---

## 🎒 Llista de l'equip

Obre la carpeta del projecte `Funcions i condicionals` a VS Code (`Fitxer > Obre la carpeta...`) i comprova que hi ha tot això:

- [ ] `package.json` amb aquests dos scripts:
  ```json
  "scripts": {
    "sass:watch": "sass --watch src/scss/main.scss:dist/css/main.css --style=expanded --source-map",
    "sass:build": "sass src/scss/main.scss:dist/css/main.css --style=compressed --no-source-map"
  }
  ```
- [ ] La carpeta `node_modules`. Si no hi és (el projecte del Classroom no la porta), obre un terminal a la carpeta del projecte i escriu `npm install`. Trigarà una mica i la crearà.
- [ ] `src/scss/main.scss`
- [ ] `src/scss/_foc.scss`
- [ ] `src/index.html`, que enllaça `../dist/css/main.css`

Comprova que Sass funciona. Obre un terminal (`Terminal > Nou terminal`) i escriu:

```powershell
npx sass --version
```

Hauria de sortir un número de versió `1.x.x` (com més alt, millor).

<details>
<summary>🆘 No tinc el projecte base o em falta alguna cosa</summary>

Des de la carpeta `Funcions i condicionals`, al terminal:

```powershell
npm init -y
npm install sass --save-dev
mkdir src/scss, dist/css
```

Després:

1. Afegeix els dos scripts de dalt dins de `"scripts"` al `package.json`.
2. Crea `src/scss/main.scss` amb aquesta línia: `@use 'foc';`
3. Crea `src/scss/_foc.scss` (pot estar buit).
4. Crea `src/index.html` amb un `<link rel="stylesheet" href="../dist/css/main.css">`.

Si tens dubtes, avisa el professor.
</details>

---

## 📋 Prepara la partida

1. **Copia** `kit-alumnat/progres.md` a l'arrel del teu projecte (al costat del `package.json`). Si ja n'hi havia un, substitueix-lo.
2. Obre `progres.md` i escriu el teu **nom d'entrenador**.
3. **Copia** `kit-alumnat/plantilles/laboratori.html` dins de `src/`. És una pàgina que ja fa servir totes les classes que crearàs als gimnasos: a mesura que avancis, s'anirà "pintant".
4. Al terminal, engega el compilador i **deixa'l obert tota la sessió**:
   ```powershell
   npm run sass:watch
   ```
   Ha de dir alguna cosa com `Compiled src\scss\main.scss to dist\css\main.css.` i `Sass is watching for changes`.
5. Obre `src/laboratori.html` al navegador (botó dret a la pestanya de VS Code > *Reveal in File Explorer* i doble clic, o amb l'extensió Live Server si la tens). De moment tot es veu sense estils: és normal.
6. Obre també `dist/css/main.css` en una pestanya de VS Code. **Aquí és on veuràs la veritat de cada missió.**

> 💡 Consell: divideix l'editor (`Ctrl + \`): a l'esquerra el teu `.scss` i a la dreta el `main.css`. Cada vegada que desis, veuràs com canvia el CSS.

---

## ✅ Llest per sortir?

- [ ] `progres.md` copiat i amb el teu nom.
- [ ] `src/laboratori.html` copiat.
- [ ] `npm run sass:watch` funcionant sense errors.
- [ ] `dist/css/main.css` obert en una pestanya.

> *"Perfecte! La primera parada és l'Illa Cinabri, on et vol veure el líder del Gimnàs de Foc. Diu que té un problema amb les seves fitxes..."* 🔥

👉 Següent: [01-gimnas-foc.md](01-gimnas-foc.md)
