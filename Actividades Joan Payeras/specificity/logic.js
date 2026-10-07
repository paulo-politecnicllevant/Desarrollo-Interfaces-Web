/* CASCADA — càlcul d'especificitat i dades de la sessió. */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Cascada = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const COLOR_A = "#ff5a36";
  const COLOR_B = "#d6ff4a";
  const GATE = 16;
  const POINTS = {
    choice: 100,
    bonus: 50,
    roomPerfect: 300,
    roomExcess: 180,
    review: 50,
  };

  const STAGE_BASE = `
    :host {
      display: grid;
      place-items: center;
      min-height: 220px;
      padding: 28px 20px;
      box-sizing: border-box;
      background: #241c16;
      color: #f4efe6;
      font-family: "Segoe UI", sans-serif;
    }
    p, a, button, h1, h2, input, span, div, nav, article {
      font-family: "Segoe UI", sans-serif;
      box-sizing: border-box;
    }
    p, h1, h2 { margin: 0; }
    a { color: inherit; text-decoration: none; }
    button, input {
      font-weight: 700;
      font-size: 18px;
      color: #f4efe6;
      background: #3a332b;
      border: 0;
      padding: 12px 18px;
      border-radius: 999px;
    }
  `;

  function cmp(a, b) {
    for (let i = 0; i < 4; i++) {
      if (a[i] !== b[i]) return a[i] - b[i];
    }
    return 0;
  }

  function formatSpec(spec) {
    if (!spec) return "—";
    return "(" + spec[0] + ", " + spec[1] + ", " + spec[2] + ", " + spec[3] + ")";
  }

  function splitTop(input, sep) {
    const out = [];
    let start = 0;
    let depthParen = 0;
    let depthBrack = 0;
    let quote = null;
    for (let i = 0; i < input.length; i++) {
      const c = input[i];
      if (quote) {
        if (c === "\\") {
          i++;
          continue;
        }
        if (c === quote) quote = null;
        continue;
      }
      if (c === '"' || c === "'") {
        quote = c;
        continue;
      }
      if (c === "(") depthParen++;
      else if (c === ")") depthParen = Math.max(0, depthParen - 1);
      else if (c === "[") depthBrack++;
      else if (c === "]") depthBrack = Math.max(0, depthBrack - 1);
      else if (c === sep && depthParen === 0 && depthBrack === 0) {
        out.push(input.slice(start, i));
        start = i + 1;
      }
    }
    out.push(input.slice(start));
    return out;
  }

  function specificity(selector) {
    if (typeof selector !== "string") return null;
    const input = selector.trim();
    if (!input || /[{}<]|!important/i.test(input)) return null;
    try {
      const parts = splitTop(input, ",");
      let best = null;
      for (const part of parts) {
        if (!part.trim()) return null;
        const spec = specFrom(part.trim());
        if (!best || cmp(spec, best) > 0) best = spec;
      }
      return best;
    } catch (err) {
      return null;
    }
  }

  function specFrom(sel) {
    const spec = [0, 0, 0, 0];
    let i = 0;
    const s = sel;

    function consumeIdent() {
      const start = i;
      while (i < s.length && /[A-Za-zÀ-ÿ0-9_-]/.test(s[i])) i++;
      if (i === start) throw new Error("ident");
      return s.slice(start, i);
    }

    function consumeGroup() {
      if (s[i] !== "(") throw new Error("group");
      let depth = 0;
      let quote = null;
      const start = i + 1;
      for (; i < s.length; i++) {
        const ch = s[i];
        if (quote) {
          if (ch === "\\") {
            i++;
            continue;
          }
          if (ch === quote) quote = null;
          continue;
        }
        if (ch === '"' || ch === "'") {
          quote = ch;
          continue;
        }
        if (ch === "(") depth++;
        else if (ch === ")") {
          depth--;
          if (depth === 0) {
            const inner = s.slice(start, i);
            i++;
            return inner;
          }
        }
      }
      throw new Error("unbalanced");
    }

    while (i < s.length) {
      const c = s[i];
      if (c === " " || c === "\t" || c === "\n" || c === "\r" || c === ">" || c === "+" || c === "~") {
        i++;
        continue;
      }
      if (c === "*") {
        i++;
        continue;
      }
      if (c === "#") {
        i++;
        consumeIdent();
        spec[1]++;
        continue;
      }
      if (c === ".") {
        i++;
        consumeIdent();
        spec[2]++;
        continue;
      }
      if (c === "[") {
        i++;
        let quote = null;
        let closed = false;
        while (i < s.length) {
          const ch = s[i++];
          if (quote) {
            if (ch === "\\") {
              i++;
              continue;
            }
            if (ch === quote) quote = null;
            continue;
          }
          if (ch === '"' || ch === "'") {
            quote = ch;
            continue;
          }
          if (ch === "]") {
            closed = true;
            break;
          }
        }
        if (!closed) throw new Error("attr");
        spec[2]++;
        continue;
      }
      if (c === ":") {
        i++;
        let pseudoElement = false;
        if (s[i] === ":") {
          pseudoElement = true;
          i++;
        }
        const name = consumeIdent().toLowerCase();
        if (s[i] === "(") {
          const inner = consumeGroup();
          if (pseudoElement) {
            spec[3]++;
            continue;
          }
          if (name === "where") {
            if (inner.trim() && !specificity(inner)) throw new Error("where");
            continue;
          }
          if (name === "is" || name === "not" || name === "has" || name === "matches") {
            const innerSpec = specificity(inner);
            if (!innerSpec) throw new Error("is");
            spec[1] += innerSpec[1];
            spec[2] += innerSpec[2];
            spec[3] += innerSpec[3];
            continue;
          }
          spec[2]++;
          continue;
        }
        if (pseudoElement) spec[3]++;
        else spec[2]++;
        continue;
      }
      if (/[A-Za-zÀ-ÿ_]/.test(c)) {
        consumeIdent();
        spec[3]++;
        continue;
      }
      throw new Error("bad");
    }
    return spec;
  }

  function gradeSpec(spec, optimal) {
    const diff = cmp(spec, optimal);
    if (diff === 0) return "perfect";
    if (diff > 0) return "excess";
    return "weak";
  }

  function explainBattle(battle) {
    if (battle.kind === "important") {
      const who = battle.a.important ? "A" : "B";
      return (
        "La tupla de " +
        who +
        " és més petita, però !important no és una columna de l'especificitat: és una capa que es resol abans. Un !important d'autor guanya un ID normal."
      );
    }
    const sa = battle.a.spec;
    const sb = battle.b.spec;
    if (cmp(sa, sb) === 0) {
      return "Les dues tuples són iguals. Quan l'especificitat empata, mana l'ordre del codi: s'aplica la regla escrita més tard. Aquí es veu B.";
    }
    const cols = [
      "d'estil en línia",
      "dels IDs",
      "de classes, atributs i pseudo-classes",
      "d'elements i pseudo-elements",
    ];
    const winnerIsA = cmp(sa, sb) > 0;
    for (let i = 0; i < 4; i++) {
      if (sa[i] !== sb[i]) {
        const hi = Math.max(sa[i], sb[i]);
        const lo = Math.min(sa[i], sb[i]);
        const who = winnerIsA ? "A" : "B";
        let text =
          "Es compara d'esquerra a dreta. La primera diferència és la columna " +
          cols[i] +
          ": " +
          who +
          " té " +
          hi +
          " i l'altre " +
          lo +
          ". A partir d'aquí ja no es miren les columnes de la dreta.";
        if (battle.extra) text += " " + battle.extra;
        return text;
      }
    }
    return "";
  }

  function bonusFor(battle) {
    if (battle.kind === "important") {
      const who = battle.a.important ? "A" : "B";
      return {
        question: "Per què guanya " + who + ", si l'altra regla té més especificitat?",
        options: [
          "Perquè !important se situa per davant de l'especificitat normal",
          "Perquè una classe sempre guanya un ID",
          "Perquè " + who + " està escrit abans",
        ],
        correct: 0,
      };
    }
    if (battle.bonus) return battle.bonus;
    const winner = battle.correct === "a" ? battle.a : battle.b;
    const spec = winner.spec;
    const loser = battle.correct === "a" ? battle.b : battle.a;
    const options = [spec];
    function push(candidate) {
      if (!candidate) return;
      const key = candidate.join(",");
      if (!options.some((item) => item.join(",") === key)) options.push(candidate);
    }
    push(loser.spec);
    push([spec[0], spec[1], spec[2], spec[3] + 1]);
    push([spec[0], spec[1] + 1, spec[2], spec[3]]);
    push([spec[0], spec[1], spec[2] + 1, spec[3]]);
    const three = options.slice(0, 3);
    const order = seededOrder(three, battle.id);
    return {
      question: "Quina especificitat té la regla que s'aplica?",
      options: order.map(formatSpec),
      correct: order.findIndex((item) => item.join(",") === spec.join(",")),
    };
  }

  function seededOrder(arr, seed) {
    const copy = arr.slice();
    let state = seed * 9301 + 49297;
    for (let i = copy.length - 1; i > 0; i--) {
      state = (state * 9301 + 49297) % 233280;
      const j = state % (i + 1);
      const swap = copy[i];
      copy[i] = copy[j];
      copy[j] = swap;
    }
    return copy;
  }

  function battleCSS(battle) {
    const lines = [];
    if (battle.layout) lines.push(battle.layout);
    [battle.a, battle.b].forEach(function (side) {
      if (!side.selector) return;
      const important = side.important ? " !important" : "";
      lines.push(side.selector + " { background-color: " + side.color + important + "; }");
    });
    return lines.join("\n");
  }

  function roomStyles(room, options) {
    const opts = options || {};
    const lines = [];
    if (room.layout) lines.push(room.layout);
    room.rules.forEach(function (rule) {
      const important = rule.important && !opts.stripImportant ? " !important" : "";
      lines.push(rule.selector + " { " + rule.prop + ": " + rule.value + important + "; }");
    });
    if (opts.selector) {
      lines.push(opts.selector + " { " + room.prop + ": " + room.goal + "; }");
    }
    return lines.join("\n");
  }

  const battles = [
    {
      id: 1,
      title: "Classe contra element",
      html: '<p class="text">Hola</p>',
      layout: "p { display: inline-block; padding: 12px 16px; font-size: 22px; font-weight: 700; }",
      a: { name: ".text", selector: ".text" },
      b: { name: "p", selector: "p" },
      correct: "a",
    },
    {
      id: 2,
      title: "Element amb classe contra element",
      html: '<button class="btn" type="button">D\'acord</button>',
      a: { name: "button.btn", selector: "button.btn" },
      b: { name: "button", selector: "button" },
      correct: "a",
    },
    {
      id: 3,
      title: "Classe contra ID",
      html: '<div id="target" class="caixa">Fitxa</div>',
      layout: "div { display: inline-block; padding: 16px 18px; font-weight: 700; font-size: 22px; }",
      a: { name: ".caixa", selector: ".caixa" },
      b: { name: "#target", selector: "#target" },
      correct: "b",
    },
    {
      id: 4,
      title: "Dues classes contra una",
      html: '<article class="card"><h2 class="titol">Títol</h2></article>',
      layout: "h2 { margin: 0; padding: 12px 16px; font-size: 22px; }",
      a: { name: ".card .titol", selector: ".card .titol" },
      b: { name: ".titol", selector: ".titol" },
      correct: "a",
    },
    {
      id: 5,
      title: "Classe sola contra classe amb element",
      html: '<a class="link" href="#">Enllaç</a>',
      layout: "a { display: inline-block; padding: 12px 16px; font-weight: 700; font-size: 22px; }",
      a: { name: ".link", selector: ".link" },
      b: { name: "a.link", selector: "a.link" },
      correct: "b",
    },
    {
      id: 6,
      title: "Empat: mana l'ordre",
      html: '<p class="nota">Nota</p>',
      layout: "p { display: inline-block; padding: 12px 16px; font-size: 22px; font-weight: 700; }",
      a: { name: ".nota", selector: ".nota" },
      b: { name: ".nota", selector: ".nota" },
      correct: "order",
    },
    {
      id: 7,
      title: "Atribut contra element",
      html: '<input type="email" value="alumne@cicle.cat" readonly>',
      layout: "input { min-width: 240px; }",
      a: { name: '[type="email"]', selector: '[type="email"]' },
      b: { name: "input", selector: "input" },
      correct: "a",
    },
    {
      id: 8,
      title: "Diverses classes contra un ID",
      html: '<nav id="menu" class="nav"><a class="actiu" href="#">Inici</a></nav>',
      layout:
        "nav { background: #120e0b; padding: 12px; border-radius: 16px; } nav a { display: inline-block; padding: 10px 14px; border-radius: 999px; font-weight: 700; }",
      a: { name: ".nav a.actiu", selector: ".nav a.actiu" },
      b: { name: "#menu a", selector: "#menu a" },
      correct: "b",
      extra: "Per això un ID guanya qualsevol nombre de classes.",
    },
    {
      id: 9,
      kind: "inline",
      title: "Estil en línia contra ID",
      html: '<h1 id="titol" style="background-color:#ff5a36">Títol</h1>',
      layout: "h1 { display: inline-block; padding: 12px 16px; font-size: 28px; }",
      a: { name: 'style="background-color: …"', selector: null, spec: [1, 0, 0, 0], kind: "inline" },
      b: { name: "#titol", selector: "#titol" },
      correct: "a",
      extra: "L'estil en línia ocupa la primera columna. No és el mateix que un ID.",
    },
    {
      id: 10,
      title: "ID contra ID amb element",
      html: '<h1 id="titol">Títol</h1>',
      layout: "h1 { display: inline-block; padding: 12px 16px; font-size: 28px; }",
      a: { name: "#titol", selector: "#titol" },
      b: { name: "h1#titol", selector: "h1#titol" },
      correct: "b",
    },
    {
      id: 11,
      title: "Una classe contra dues al mateix element",
      html: '<a class="btn principal" href="#">Entrar</a>',
      layout: "a { display: inline-block; padding: 12px 16px; font-weight: 700; font-size: 22px; }",
      a: { name: ".btn", selector: ".btn" },
      b: { name: ".btn.principal", selector: ".btn.principal" },
      correct: "b",
    },
    {
      id: 12,
      kind: "important",
      title: "Una classe amb !important contra un ID",
      html: '<p id="avis" class="avis">Avís</p>',
      layout: "p { display: inline-block; padding: 12px 16px; font-size: 22px; font-weight: 700; }",
      a: { name: ".avis", selector: ".avis", important: true },
      b: { name: "#avis", selector: "#avis" },
      correct: "a",
    },
    {
      id: 13,
      title: "Fill directe contra element",
      html: '<ul class="llista"><li>Primer</li></ul>',
      layout: "ul { margin: 0; padding: 12px 18px; } li { font-weight: 700; font-size: 22px; }",
      a: { name: ".llista > li", selector: ".llista > li" },
      b: { name: "li", selector: "li" },
      correct: "a",
    },
    {
      id: 14,
      title: "Una classe contra dues al mateix bloc",
      html: '<div class="card destacat">Oferta</div>',
      layout: "div { display: inline-block; padding: 16px 18px; font-weight: 700; font-size: 22px; }",
      a: { name: ".card", selector: ".card" },
      b: { name: ".card.destacat", selector: ".card.destacat" },
      correct: "b",
    },
    {
      id: 15,
      title: "Dos elements contra una classe",
      html: '<div><p class="text">Text</p></div>',
      layout: "p { display: inline-block; padding: 12px 16px; font-size: 22px; font-weight: 700; }",
      a: { name: "div p", selector: "div p" },
      b: { name: ".text", selector: ".text" },
      correct: "b",
    },
    {
      id: 16,
      title: "Empat: el mateix selector dues vegades",
      html: '<a class="actiu" href="#">Ara</a>',
      layout: "a { display: inline-block; padding: 12px 16px; font-weight: 700; font-size: 22px; }",
      a: { name: "a.actiu", selector: "a.actiu" },
      b: { name: "a.actiu", selector: "a.actiu" },
      correct: "order",
    },
    {
      id: 17,
      title: "Atribut de llengua contra element",
      html: '<p lang="ca">Bon dia</p>',
      layout: "p { display: inline-block; padding: 12px 16px; font-size: 22px; font-weight: 700; }",
      a: { name: '[lang="ca"]', selector: '[lang="ca"]' },
      b: { name: "p", selector: "p" },
      correct: "a",
    },
    {
      id: 18,
      title: "Cadena de classes contra un ID",
      html: '<section id="hero" class="hero"><h2 class="titol">Portada</h2></section>',
      layout: "h2 { margin: 0; padding: 12px 16px; font-size: 28px; }",
      a: { name: ".hero h2.titol", selector: ".hero h2.titol" },
      b: { name: "#hero h2", selector: "#hero h2" },
      correct: "b",
      extra: "Torna a passar: la columna dels IDs es mira abans que la de les classes.",
    },
    {
      id: 19,
      title: "Element amb classe contra element sol",
      html: '<h2 class="titol">Capítol</h2>',
      layout: "h2 { display: inline-block; padding: 12px 16px; font-size: 28px; }",
      a: { name: "h2.titol", selector: "h2.titol" },
      b: { name: "h2", selector: "h2" },
      correct: "a",
    },
    {
      id: 20,
      title: "Pseudo-classe contra classe",
      html: '<p class="nota">Darrera</p>',
      layout: "p { display: inline-block; padding: 12px 16px; font-size: 22px; font-weight: 700; }",
      a: { name: "p:last-child", selector: "p:last-child" },
      b: { name: ".nota", selector: ".nota" },
      correct: "a",
    },
    {
      id: 21,
      title: "ID sol contra ID amb element",
      html: '<div id="fitxa">Fitxa</div>',
      layout: "div { display: inline-block; padding: 16px 18px; font-weight: 700; font-size: 22px; }",
      a: { name: "#fitxa", selector: "#fitxa" },
      b: { name: "div#fitxa", selector: "div#fitxa" },
      correct: "b",
    },
    {
      id: 22,
      title: "Empat entre dos atributs",
      html: '<span data-estat="on">Actiu</span>',
      layout: "span { display: inline-block; padding: 12px 16px; font-weight: 700; font-size: 22px; }",
      a: { name: '[data-estat="on"]', selector: '[data-estat="on"]' },
      b: { name: '[data-estat="on"]', selector: '[data-estat="on"]' },
      correct: "order",
    },
    {
      id: 23,
      title: "ID contra dues classes",
      html: '<section id="peu" class="peu"><span class="legal">Avís</span></section>',
      layout: "span { display: inline-block; padding: 12px 16px; font-weight: 700; font-size: 22px; }",
      a: { name: "#peu span", selector: "#peu span" },
      b: { name: ".peu span.legal", selector: ".peu span.legal" },
      correct: "a",
    },
    {
      id: 24,
      kind: "important",
      title: "Un ID contra una classe amb !important",
      html: '<p id="caixa" class="caixa">Caixa</p>',
      layout: "p { display: inline-block; padding: 12px 16px; font-size: 22px; font-weight: 700; }",
      a: { name: "#caixa", selector: "#caixa" },
      b: { name: ".caixa", selector: ".caixa", important: true },
      correct: "b",
    },
  ];

  const rooms = [
    {
      id: 1,
      kind: "fix",
      name: "El botó mut",
      digit: "4",
      html: '<button id="enviar" class="btn" type="button">Envia</button>',
      target: "#enviar",
      prop: "background-color",
      goal: "#2f9e44",
      story:
        "El botó Envia hauria de ser verd. La classe .btn ja ho demana, però es veu gris. Escriu un selector que el torni verd, amb la mínima especificitat que funcioni.",
      layout: "",
      rules: [
        { selector: ".btn", prop: "background-color", value: "#2f9e44" },
        { selector: "#enviar", prop: "background-color", value: "#868e96", culprit: true },
      ],
      hints: [
        "Calcula les tuples. Quina columna les separa?",
        "La teva regla va al final. Si la tupla empata, la teva guanya.",
        "Prova la mateixa especificitat que #enviar: (0, 1, 0, 0).",
      ],
    },
    {
      id: 2,
      kind: "fix",
      name: "El menú fantasma",
      digit: "8",
      html: '<nav class="menu"><a class="link actiu" href="#">Inici</a></nav>',
      target: "a.link",
      prop: "color",
      goal: "#f4efe6",
      story:
        "L'enllaç Inici hauria de llegir-se en clar sobre el menú fosc. Dues regles empaten i la segona el pinta del color del fons. Recupera el text clar.",
      layout:
        ".menu { background: #120e0b; padding: 14px 16px; border-radius: 16px; display: inline-flex; } .menu a { display: inline-block; padding: 10px 14px; border-radius: 999px; font-weight: 700; font-size: 22px; }",
      rules: [
        { selector: ".menu .link", prop: "color", value: "#f4efe6" },
        { selector: ".menu .actiu", prop: "color", value: "#120e0b", culprit: true },
      ],
      hints: [
        "Compta quantes classes té cada selector, no només el nom.",
        "Les dues regles de color tenen (0, 0, 2, 0). Guanya la que va després.",
        "Un selector amb (0, 0, 2, 0) que apliqui a l'enllaç, escrit al final, desempata a favor teu.",
      ],
    },
    {
      id: 3,
      kind: "inspect",
      name: "L'avís invisible",
      digit: "2",
      html: '<div class="targeta"><p class="avis" data-tipus="urgent">Queda 1 plaça</p></div>',
      target: "p.avis",
      prop: "color",
      goal: "#9a3412",
      story:
        "L'avís ha desaparegut: el text i el fons són el mateix color. Primer troba quina regla està guanyant. Després escriu un selector que torni el text a granat. Mira bé: l'última regla del fitxer no és necessàriament la que guanya.",
      layout:
        ".targeta { background: #fff8ee; padding: 22px 26px; border-radius: 16px; min-width: 240px; } .targeta p { margin: 0; font-size: 28px; font-weight: 800; outline: 1px dashed #e7d7c3; padding: 8px 10px; }",
      rules: [
        { selector: "p", prop: "color", value: "#9a3412" },
        { selector: '[data-tipus="urgent"]', prop: "color", value: "#9a3412" },
        { selector: 'p[data-tipus="urgent"]', prop: "color", value: "#fff8ee", culprit: true },
        { selector: ".avis", prop: "color", value: "#9a3412" },
      ],
      hints: [
        "La regla culpable és (0, 0, 1, 1). L'ordre només decideix si les tuples són iguals.",
        "No cal superar-la si pots empatar-la: la teva regla va al final.",
        "p.avis i p[data-tipus=\"urgent\"] tenen la mateixa tupla.",
      ],
    },
    {
      id: 4,
      kind: "fix",
      name: "El preu camuflat",
      digit: "6",
      html: '<span class="preu" data-oferta="si">19 €</span>',
      target: ".preu",
      prop: "background-color",
      goal: "#2f9e44",
      story:
        "El preu hauria de ser verd. Hi ha una regla verda al final del fitxer, però no és la que pinta. El gris guanya igualment. Escriu el selector mínim que el torni verd.",
      layout:
        "span.preu { display: inline-block; padding: 14px 18px; font-weight: 800; font-size: 28px; border-radius: 12px; }",
      rules: [
        { selector: ".preu", prop: "background-color", value: "#2f9e44" },
        { selector: "span.preu", prop: "background-color", value: "#868e96", culprit: true },
        { selector: '[data-oferta="si"]', prop: "background-color", value: "#2f9e44" },
      ],
      hints: [
        "L'última regla no guanya. Compara les tuples, no la posició.",
        "La culpable és (0, 0, 1, 1). La teva regla va al final: empatar n'hi ha prou.",
        "span.preu té aquesta tupla i apunta al preu.",
      ],
    },
    {
      id: 5,
      kind: "inspect",
      name: "La fitxa esborrada",
      digit: "1",
      html: '<article id="fitxa" class="fitxa"><h2 class="nom">Nil</h2></article>',
      target: "h2.nom",
      prop: "color",
      goal: "#f4efe6",
      story:
        "El nom de la fitxa s'ha fos amb el fons fosc. Primer assenyala la regla que està guanyant. Després escriu un selector que torni el text clar. Un ID al mig del fitxer pot guanyar una regla posterior.",
      layout:
        "article { background: #120e0b; padding: 18px 22px; border-radius: 16px; } article h2 { margin: 0; font-size: 32px; }",
      rules: [
        { selector: "h2", prop: "color", value: "#f4efe6" },
        { selector: ".nom", prop: "color", value: "#f4efe6" },
        { selector: "#fitxa .nom", prop: "color", value: "#241c16", culprit: true },
        { selector: ".fitxa h2", prop: "color", value: "#f4efe6" },
      ],
      hints: [
        "La culpable porta un ID. La seva tupla és (0, 1, 1, 0).",
        "Una regla posterior amb menys IDs no la desbanca.",
        "#fitxa .nom empata la tupla i, al final, guanya.",
      ],
    },
    {
      id: 6,
      kind: "fix",
      name: "L'avís legal",
      digit: "7",
      html: '<footer class="peu"><a class="legal" href="#">Avís legal</a></footer>',
      target: "a.legal",
      prop: "color",
      goal: "#ffd43b",
      story:
        "L'enllaç del peu hauria de ser daurat. Una classe sola ja ho demana, però perd contra un selector una mica més llarg. Recupera el daurat amb la mínima tupla que funcioni.",
      layout:
        "footer { background: #120e0b; padding: 16px 18px; border-radius: 16px; } footer a { display: inline-block; padding: 8px 4px; font-weight: 700; font-size: 22px; }",
      rules: [
        { selector: "a", prop: "color", value: "#ffd43b" },
        { selector: ".peu a", prop: "color", value: "#868e96", culprit: true },
        { selector: ".legal", prop: "color", value: "#ffd43b" },
      ],
      hints: [
        "Compta classes i elements. La regla grisa no és un ID.",
        "Cal empatar (0, 0, 1, 1). La teva regla es carrega al final.",
        ".peu a o a.legal tenen aquesta tupla.",
      ],
    },
    {
      id: 7,
      kind: "fix",
      name: "El botó de l'aula",
      digit: "3",
      html: '<button id="aula" class="btn principal" type="button">Entra</button>',
      target: "#aula",
      prop: "background-color",
      goal: "#ffd43b",
      story:
        "El botó hauria de ser daurat. Dues classes juntes ja ho demanen, però un ID el deixa gris. No abusis d'especificitat: empatar l'ID, al final del fitxer, és suficient.",
      layout: "",
      rules: [
        { selector: ".btn.principal", prop: "background-color", value: "#ffd43b" },
        { selector: "button.btn", prop: "background-color", value: "#ffd43b" },
        { selector: "#aula", prop: "background-color", value: "#495057", culprit: true },
      ],
      hints: [
        "Les classes, per moltes que siguin, no passen per davant d'un ID.",
        "La teva regla va al final. Amb (0, 1, 0, 0) n'hi ha prou.",
        "El selector és l'ID del botó: #aula.",
      ],
    },
    {
      id: 8,
      kind: "vault",
      name: "La caixa forta",
      digit: "5",
      html: '<div class="panell"><p class="secret">TANCAT</p></div>',
      target: ".secret",
      prop: "color",
      goal: "#ffd43b",
      story:
        "El missatge hauria de ser daurat. La regla més específica ja ho demana, però una de més feble porta !important i ho bloqueja. Treu aquest !important. No n'afegeixis cap altre.",
      layout:
        ".panell { background: #120e0b; padding: 28px 36px; border-radius: 18px; text-align: center; } .secret { margin: 0; font-size: 42px; font-weight: 800; letter-spacing: 0.14em; }",
      rules: [
        { selector: ".panell .secret", prop: "color", value: "#ffd43b" },
        { selector: ".secret", prop: "color", value: "#5c564c", important: true, culprit: true },
      ],
      hints: [],
    },
  ];

  const review = [
    {
      q: "Un ID lluita contra tres classes. Cap dels dos porta !important. Qui guanya?",
      options: [
        "Les tres classes, perquè 3 és més gran que 1",
        "L'ID, perquè la columna dels IDs es compara abans que la de les classes",
        "Empaten, perquè tots dos són selectors",
      ],
      correct: 1,
      why: "Es compara d'esquerra a dreta. Un 1 a la columna dels IDs guanya qualsevol nombre a la columna de les classes.",
    },
    {
      q: "Dues regles amb la mateixa especificitat apliquen al mateix element. Quina es veu?",
      options: [
        "La que està escrita més tard al CSS",
        "La que està escrita abans",
        "Cap: el navegador les descarta",
      ],
      correct: 0,
      why: "Si les tuples són iguals, l'especificitat no decideix. S'aplica la regla que apareix més tard al CSS.",
    },
    {
      q: "Una classe amb !important i un ID sense !important. Què passa?",
      options: [
        "Guanya l'ID, perquè és més específic",
        "Guanya la classe, perquè !important es resol abans que l'especificitat normal",
        "Guanya sempre l'estil en línia, encara que no n'hi hagi",
      ],
      correct: 1,
      why: "Un !important del full d'estil es resol abans que l'especificitat normal. La classe guanya l'ID sense necessitat de ser més específica.",
    },
    {
      q: "Un estil en línia sense !important lluita contra un ID del CSS. Qui guanya?",
      options: [
        "L'ID, perquè els identificadors són el selector més fort",
        "L'estil en línia, perquè ocupa la primera columna de la tupla",
        "Empaten i mana l'ordre del fitxer",
      ],
      correct: 1,
      why: "L'estil en línia és (1, 0, 0, 0). Es compara abans que la columna dels IDs, així que guanya #id, que és (0, 1, 0, 0).",
    },
    {
      q: "Quina tupla és més específica: (0, 0, 3, 0) o (0, 1, 0, 0)?",
      options: [
        "(0, 0, 3, 0), perquè 3 és més gran que 1",
        "(0, 1, 0, 0), perquè un ID es compara abans que les classes",
        "Empaten: 3 classes equivalen a 1 ID",
      ],
      correct: 1,
      why: "La primera columna diferent és la dels IDs: 1 contra 0. Les 3 classes de la columna següent ni tan sols es miren.",
    },
    {
      q: "On compta un atribut com [type=\"email\"] o una pseudo-classe com :last-child?",
      options: [
        "A la columna dels elements, amb p o a",
        "A la columna de les classes, juntament amb .btn",
        "A la columna dels IDs",
      ],
      correct: 1,
      why: "Classes, atributs i pseudo-classes comparteixen la tercera columna. Un [type=\"email\"] és (0, 0, 1, 0), com una classe.",
    },
  ];

  function prepare() {
    battles.forEach(function (battle) {
      ["a", "b"].forEach(function (key) {
        const side = battle[key];
        side.color = key === "a" ? COLOR_A : COLOR_B;
        if (side.selector) {
          side.spec = specificity(side.selector);
          if (!side.spec) throw new Error("Selector sense especificitat: " + side.selector);
        }
      });
    });
    rooms.forEach(function (room) {
      room.rules.forEach(function (rule) {
        rule.spec = specificity(rule.selector);
        if (!rule.spec) throw new Error("Regla sense especificitat: " + rule.selector);
      });
      const culprit = room.rules.find(function (rule) {
        return rule.culprit;
      });
      room.optimal = culprit.spec;
    });
    return { battles: battles, rooms: rooms };
  }

  return {
    COLOR_A: COLOR_A,
    COLOR_B: COLOR_B,
    GATE: GATE,
    POINTS: POINTS,
    STAGE_BASE: STAGE_BASE,
    battles: battles,
    rooms: rooms,
    review: review,
    specificity: specificity,
    cmp: cmp,
    formatSpec: formatSpec,
    gradeSpec: gradeSpec,
    explainBattle: explainBattle,
    bonusFor: bonusFor,
    battleCSS: battleCSS,
    roomStyles: roomStyles,
    prepare: prepare,
  };
});
