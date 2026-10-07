/* CASCADA — combat de selectors i escape room. */
(function () {
  "use strict";

  const C = window.Cascada;
  C.prepare();

  const KEY = "cascada-specificity-v2";
  const params = new URLSearchParams(location.search);
  const docent = params.get("docent") === "1";

  const app = document.getElementById("app");
  let state = freshState();

  function freshState() {
    return {
      name: "",
      phase: "start",
      startedAt: null,
      queue: C.battles.map(function (_, index) { return index; }),
      pointer: 0,
      results: C.battles.map(function () { return null; }),
      escapeRoom: 0,
      roomsCleared: C.rooms.map(function () { return null; }),
      foundCulprit: C.rooms.map(function () { return false; }),
      importantOn: true,
      roomAttempts: C.rooms.map(function () { return 0; }),
      reviewAnswers: C.review.map(function () { return null; }),
      selectorDraft: "",
      roomReady: false,
    };
  }

  function esc(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function elapsed() {
    if (!state.startedAt) return "00:00";
    const total = Math.floor((Date.now() - state.startedAt) / 1000);
    const min = String(Math.floor(total / 60)).padStart(2, "0");
    const sec = String(total % 60).padStart(2, "0");
    return min + ":" + sec;
  }

  function paceNote() {
    if (!state.startedAt) return "";
    const min = (Date.now() - state.startedAt) / 60000;
    if (state.phase === "combat" && min >= 40) {
      return "Convé tancar el combat: encara queden les sales.";
    }
    if (state.phase === "escape" && min >= 80) return "Convé anar cap al tancament.";
    return "";
  }

  function correctCount() {
    return state.results.reduce(function (total, result) {
      return total + (result && result.choiceOk ? 1 : 0);
    }, 0);
  }

  function combatPoints() {
    return state.results.reduce(function (total, result) {
      if (!result) return total;
      return total + (result.choiceOk ? C.POINTS.choice : 0) + (result.bonusOk ? C.POINTS.bonus : 0);
    }, 0);
  }

  function roomPoints() {
    return state.roomsCleared.reduce(function (total, grade) {
      if (grade === "perfect") return total + C.POINTS.roomPerfect;
      if (grade === "excess") return total + C.POINTS.roomExcess;
      return total;
    }, 0);
  }

  function reviewPoints() {
    return state.reviewAnswers.reduce(function (total, answer, index) {
      return total + (answer === C.review[index].correct ? C.POINTS.review : 0);
    }, 0);
  }

  function totalPoints() {
    return combatPoints() + roomPoints() + reviewPoints();
  }

  function bonusCount() {
    return state.results.reduce(function (total, result) {
      return total + (result && result.bonusOk ? 1 : 0);
    }, 0);
  }

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (err) {
      /* La sessió segueix en memòria si l'emmagatzematge no està disponible. */
    }
  }

  function readSave() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || !Array.isArray(data.results)) return null;
      return data;
    } catch (err) {
      return null;
    }
  }

  function paintStage(css, html) {
    const host = document.getElementById("stage");
    if (!host) return null;
    const root = host.shadowRoot || host.attachShadow({ mode: "open" });
    root.innerHTML = "<style>" + C.STAGE_BASE + "\n" + css + "</style>" + html;
    return root;
  }

  function sameValue(root, prop, hex) {
    const probe = document.createElement("span");
    root.appendChild(probe);
    probe.style.setProperty(prop, hex);
    const expected = getComputedStyle(probe).getPropertyValue(prop);
    probe.remove();
    return expected;
  }

  const actions = {
    start: function () {
      const input = document.getElementById("player-name");
      const name = input ? input.value.trim() : "";
      state = freshState();
      state.name = name || "Equip";
      state.phase = "combat";
      state.startedAt = Date.now();
      persist();
      render();
    },
    continue: function () {
      const saved = readSave();
      if (!saved) return;
      state = Object.assign(freshState(), saved);
      if (!state.startedAt) state.startedAt = Date.now();
      persist();
      render();
    },
    reset: function () {
      if (!confirm("Vols esborrar el progrés d'aquesta sessió?")) return;
      localStorage.removeItem(KEY);
      state = freshState();
      render();
    },
    choice: function (btn) {
      const battle = currentBattle();
      const index = currentBattleIndex();
      if (!battle || (state.results[index] && state.results[index].choice)) return;
      const choice = btn.dataset.choice;
      state.results[index] = {
        choice: choice,
        choiceOk: choice === battle.correct,
        bonusIndex: null,
        bonusOk: false,
      };
      persist();
      render();
      const reveal = document.getElementById("reveal");
      if (reveal) reveal.scrollIntoView({ behavior: "smooth", block: "nearest" });
    },
    bonus: function (btn) {
      const index = currentBattleIndex();
      const result = state.results[index];
      if (!result || result.bonusIndex !== null) return;
      const battle = currentBattle();
      const picked = Number(btn.dataset.index);
      result.bonusIndex = picked;
      result.bonusOk = picked === C.bonusFor(battle).correct;
      persist();
      render();
    },
    "next-battle": function () {
      state.pointer += 1;
      if (state.pointer >= state.queue.length) state.phase = "bridge";
      persist();
      render();
    },
    retry: function () {
      const wrong = [];
      state.results.forEach(function (result, index) {
        if (!result || !result.choiceOk) wrong.push(index);
      });
      wrong.forEach(function (index) {
        state.results[index] = null;
      });
      state.queue = wrong;
      state.pointer = 0;
      state.phase = "combat";
      persist();
      render();
    },
    "enter-escape": function () {
      if (correctCount() < C.GATE) return;
      state.phase = "escape";
      state.escapeRoom = 0;
      state.selectorDraft = "";
      state.roomReady = false;
      persist();
      render();
    },
    "pick-rule": function (btn) {
      const room = currentRoom();
      if (room.kind !== "inspect" || state.foundCulprit[state.escapeRoom]) return;
      const rule = room.rules[Number(btn.dataset.index)];
      const box = document.getElementById("feedback");
      if (rule.culprit) {
        state.foundCulprit[state.escapeRoom] = true;
        persist();
        render();
        return;
      }
      writeFeedback(
        box,
        "bad",
        "<p>" +
          esc(rule.selector) +
          " és " +
          esc(C.formatSpec(rule.spec)) +
          ". Una altra regla té una tupla més alta, i això pesa més que la posició al fitxer.</p>"
      );
    },
    "test-selector": function () {
      const room = currentRoom();
      if (!room || room.kind === "vault") return;
      const input = document.getElementById("selector");
      const selector = normalizeSelector(input ? input.value : state.selectorDraft);
      state.selectorDraft = selector;
      const box = document.getElementById("feedback");
      if (!selector) {
        writeFeedback(box, "bad", "<p>Escriu un selector.</p>");
        return;
      }
      if (!isSafeSelector(selector)) {
        writeFeedback(
          box,
          "bad",
          "<p>Aquí només hi va el selector. !important no entra en aquest repte: la declaració ja està escrita.</p>"
        );
        return;
      }
      const root = paintRoom(selector);
      const el = root && root.querySelector(room.target);
      let matches = false;
      try {
        matches = !!(el && el.matches(selector));
      } catch (err) {
        writeFeedback(box, "bad", "<p>Aquest selector no és vàlid.</p>");
        return;
      }
      if (!matches) {
        state.roomAttempts[state.escapeRoom] += 1;
        writeFeedback(
          box,
          "bad",
          "<p>Aquest selector no aplica a l'element que hem d'arreglar.</p>" + hintHtml(room)
        );
        persist();
        return;
      }
      const computed = getComputedStyle(el).getPropertyValue(room.prop);
      const expected = sameValue(root, room.prop, room.goal);
      const spec = C.specificity(selector);
      const grade = spec ? C.gradeSpec(spec, room.optimal) : "excess";
      if (computed !== expected) {
        state.roomAttempts[state.escapeRoom] += 1;
        const why =
          grade === "weak"
            ? "Especificitat massa baixa: " +
              C.formatSpec(spec) +
              ". Cal empatar " +
              C.formatSpec(room.optimal) +
              " o superar-la. La teva regla ja va al final, així que empatar n'hi ha prou."
            : "El selector aplica, però no està guanyant la cascada.";
        writeFeedback(box, "bad", "<p>" + esc(why) + "</p>" + hintHtml(room));
        persist();
        return;
      }
      const level = grade === "perfect" ? "perfect" : "excess";
      if (state.roomsCleared[state.escapeRoom] !== "perfect") {
        state.roomsCleared[state.escapeRoom] = level;
      }
      state.roomReady = true;
      persist();
      const msg =
        level === "perfect"
          ? "Mínim necessari. La teva tupla " +
            C.formatSpec(spec) +
            " empata amb la regla culpable i, com que va al final, guanya."
          : "Funciona, amb la tupla " +
            C.formatSpec(spec || room.optimal) +
            ". N'hi havia prou d'empatar " +
            C.formatSpec(room.optimal) +
            ". Pots afinar-ho o continuar.";
      writeFeedback(
        box,
        "ok",
        "<p>" +
          esc(msg) +
          "</p><p>Dígit obtingut: <strong>" +
          room.digit +
          "</strong></p>" +
          '<p><button class="btn btn-primary" data-action="next-room" type="button">' +
          (state.escapeRoom >= C.rooms.length - 1 ? "Ves al tancament" : "Sala següent") +
          "</button></p>"
      );
      updateDigits();
      updateScore();
    },
    "toggle-important": function () {
      state.importantOn = !state.importantOn;
      paintVault();
      const box = document.getElementById("feedback");
      if (box && !state.roomsCleared[state.escapeRoom]) {
        box.className = "feedback";
        box.innerHTML = state.importantOn
          ? "<p>L'!important continua actiu. La regla feble encara guanya.</p>"
          : "<p>Sense !important, compara les tuples. La regla daurada ja hauria de poder guanyar.</p>";
      }
    },
    "open-vault": function () {
      const box = document.getElementById("feedback");
      if (state.importantOn) {
        writeFeedback(
          box,
          "bad",
          "Encara hi ha un !important. No n'afegeixis un altre a la regla daurada: treu el que bloqueja la cascada."
        );
        return;
      }
      const room = currentRoom();
      state.roomsCleared[state.escapeRoom] = "perfect";
      state.roomReady = true;
      paintVault();
      persist();
      const nextLabel = state.escapeRoom >= C.rooms.length - 1 ? "Ves al tancament" : "Sala següent";
      writeFeedback(
        box,
        "ok",
        "<p>La regla .panell .secret és (0, 0, 2, 0) i .secret és (0, 0, 1, 0). Sense !important, guanya la més específica. El color daurat no necessitava un altre !important.</p><p>Dígit obtingut: <strong>" +
          room.digit +
          '</strong></p><p><button class="btn btn-primary" data-action="next-room" type="button">' +
          nextLabel +
          "</button></p>"
      );
      updateDigits();
      updateScore();
    },
    "trap-important": function () {
      writeFeedback(
        document.getElementById("feedback"),
        "bad",
        "Tècnicament un altre !important podria guanyar, però només apilaries el mateix problema. La regla feble guanyava només per l'!important. Treu-lo."
      );
    },
    "next-room": function () {
      if (!state.roomsCleared[state.escapeRoom]) return;
      if (state.escapeRoom >= C.rooms.length - 1) {
        state.phase = "final";
      } else {
        state.escapeRoom += 1;
        state.selectorDraft = "";
        state.roomReady = false;
      }
      persist();
      render();
    },
    review: function (btn) {
      const q = Number(btn.dataset.q);
      if (state.reviewAnswers[q] !== null && state.reviewAnswers[q] !== undefined) return;
      state.reviewAnswers[q] = Number(btn.dataset.index);
      persist();
      render();
      const blocks = document.querySelectorAll(".reveal");
      if (blocks[q]) blocks[q].scrollIntoView({ behavior: "smooth", block: "nearest" });
    },
    "docent-escape": function () {
      fillDocentCombat();
      state.phase = "bridge";
      persist();
      render();
    },
    "docent-room": function (btn) {
      fillDocentCombat();
      state.phase = "escape";
      state.escapeRoom = Number(btn.dataset.room) || 0;
      state.foundCulprit = C.rooms.map(function () { return false; });
      state.importantOn = true;
      state.selectorDraft = "";
      persist();
      render();
    },
    "docent-battle": function (btn) {
      state.phase = "combat";
      state.startedAt = state.startedAt || Date.now();
      state.name = state.name || "Docent";
      state.queue = C.battles.map(function (_, index) { return index; });
      state.pointer = Math.max(0, Number(btn.dataset.battle) - 1);
      persist();
      render();
    },
  };

  function fillDocentCombat() {
    state.startedAt = state.startedAt || Date.now();
    state.name = state.name || "Docent";
    state.results = C.battles.map(function (_, index) {
      return {
        choice: index < C.GATE ? "docent" : "docent",
        choiceOk: index < C.GATE,
        bonusIndex: 0,
        bonusOk: index < 4,
      };
    });
  }

function normalizeSelector(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function isSafeSelector(selector) {
  if (!selector || selector.length > 120) return false;
  if (/[{}<]/.test(selector)) return false;
  if (/!important/i.test(selector)) return false;
  if (/url\s*\(/i.test(selector)) return false;
  if (selector.indexOf("@") !== -1) return false;
  if (selector.indexOf("\\") !== -1) return false;
  return true;
}

function writeFeedback(box, kind, html) {
  if (!box) return;
  box.hidden = false;
  box.className = "feedback " + kind;
  box.innerHTML = html;
}

  function hintHtml(room) {
    const attempt = state.roomAttempts[state.escapeRoom];
    if (!room.hints || attempt < 1) return "";
    const shown = room.hints.slice(0, attempt);
    return (
      "<p><strong>Pista:</strong> " +
      shown.map(esc).join("</p><p><strong>Pista:</strong> ") +
      "</p>"
    );
  }

  function currentBattleIndex() {
    return state.queue[state.pointer];
  }

  function currentBattle() {
    const index = currentBattleIndex();
    return C.battles[index] || null;
  }

  function currentRoom() {
    return C.rooms[state.escapeRoom] || null;
  }

  function render() {
    app.innerHTML = topbar() + '<main class="wrap">' + screen() + "</main>";
    afterRender();
  }

  function topbar() {
    const door = "Porta " + Math.min(correctCount(), C.GATE) + "/" + C.GATE;
    return (
      '<header class="topbar"><p class="brand">CASCADA<span>Especificitat CSS</span></p><div class="top-meta"><span>' +
      esc(phaseLabel()) +
      '</span><span>' +
      door +
      "</span><span><strong id=\"score\">" +
      totalPoints() +
      '</strong> pts</span><span><strong id="clock">' +
      elapsed() +
      '</strong></span><button class="btn btn-ghost" type="button" data-action="reset">Reinicia</button><p class="pace" id="pace">' +
      esc(paceNote()) +
      "</p></div></header>"
    );
  }

  function phaseLabel() {
    if (state.phase === "combat") return "Combat";
    if (state.phase === "bridge") return "Porta";
    if (state.phase === "escape") return "Escape room";
    if (state.phase === "final") return "Tancament";
    return "Inici";
  }

  function screen() {
    if (state.phase === "start") return renderStart();
    if (state.phase === "combat") return renderCombat();
    if (state.phase === "bridge") return renderBridge();
    if (state.phase === "escape") return renderRoom();
    if (state.phase === "final") return renderFinal();
    return renderStart();
  }

  function renderStart() {
    const saved = readSave();
    return (
      '<p class="kicker">DIW · Grau superior · 90 minuts</p><h1 class="display">Cascada</h1><p class="lede">Specificity: l\'especificitat dels selectors. Primer calcules qui guanya. Després arregles ' + C.rooms.length + ' interfícies que la cascada ha trencat.</p><ul class="tuple-row"><li><code>p</code><span>(0, 0, 0, 1)</span></li><li><code>.btn</code><span>(0, 0, 1, 0)</span></li><li><code>#enviar</code><span>(0, 1, 0, 0)</span></li><li><code>style</code><span>(1, 0, 0, 0)</span></li></ul><div class="grid-2"><article class="card"><h2>1. Combat</h2><p>' + C.battles.length + ' rondes. Tria quina regla s\'aplica i justifica la tupla o el desempat. Calen <strong>' + C.GATE + ' encerts</strong> per obrir la porta. Uns 40 minuts.</p></article><article class="card"><h2>2. Escape room</h2><p>' + C.rooms.length + ' sales. A cada una escrius el selector mínim que arregla la peça, o desmuntes un <code>!important</code>. Uns 40 minuts, i 10 de tancament.</p></article></div><label class="name-field">Nom de l\'equip o de l\'alumne<input id="player-name" maxlength="32" autocomplete="off" placeholder="Per exemple, Equip 3"></label><div class="btn-row"><button class="btn btn-primary" type="button" data-action="start">Comença el combat</button>' +
      (saved
        ? '<button class="btn" type="button" data-action="continue">Continua la sessió de ' +
          esc(saved.name || "l'equip") +
          "</button>"
        : "") +
      "</div>" +
      apunts() +
      docentPanel()
    );
  }

  function renderCombat() {
    const battle = currentBattle();
    const result = state.results[currentBattleIndex()];
    const answered = !!(result && result.choice);
    const bonusDone = !!(result && result.bonusIndex !== null);
    const bonus = C.bonusFor(battle);
    return (
      '<p class="eyebrow">Ronda ' +
      (state.pointer + 1) +
      " de " +
      state.queue.length +
      " · " +
      esc(battle.title) +
      "</p><h1>" +
      esc(state.name) +
      '</h1><p class="html-sample">' +
      esc(battle.html) +
      '</p><div class="fighters"><article class="fighter ' +
      fighterClass("a", battle, answered) +
      '"><p class="letter">A · escrita abans</p><p class="sel">' +
      esc(battle.a.name) +
      importantBadge(battle.a, true) +
      specLine(battle.a, bonusDone) +
      '</p></article><p class="vs">vs</p><article class="fighter ' +
      fighterClass("b", battle, answered) +
      '"><p class="letter">B · escrita després' +
      (battle.b.kind === "inline" ? " · en línia" : "") +
      '</p><p class="sel">' +
      esc(battle.b.name) +
      importantBadge(battle.b, true) +
      specLine(battle.b, bonusDone) +
      "</p></article></div>" +
      '<div class="choices">' +
      choiceBtn("a", "S'aplica A", result) +
      choiceBtn("b", "S'aplica B", result) +
      choiceBtn("order", "Empaten", result) +
      '</div><p class="note">Tria Empaten només si les tuples són iguals. L\'ordre es treballa just després.</p><div class="stage-wrap"><p>Resultat real del navegador</p><div id="stage"></div></div>' +
      (answered ? renderReveal(battle, result, bonus, bonusDone) : "") +
      apunts()
    );
  }

  function fighterClass(side, battle, answered) {
    if (!answered) return "";
    const applied = battle.correct === "a" ? "a" : "b";
    return applied === side ? "is-winner" : "is-quiet";
  }

  function specLine(side, show) {
    if (!show) return "";
    return '</p><p class="spec">' + esc(C.formatSpec(side.spec));
  }

  function importantBadge(side, show) {
    if (!show || !side.important) return "";
    return '<span class="badge">!important</span>';
  }

  function choiceBtn(choice, label, result) {
    const answered = !!(result && result.choice);
    let cls = "btn";
    if (answered && choice === currentBattle().correct) cls += " is-right";
    else if (answered && result.choice === choice) cls += " is-wrong";
    return (
      '<button class="' +
      cls +
      '" type="button" data-action="choice" data-choice="' +
      choice +
      '"' +
      (answered ? " disabled" : "") +
      ">" +
      label +
      "</button>"
    );
  }

  function renderReveal(battle, result, bonus, bonusDone) {
    const ok = result.choiceOk;
    let html =
      '<section class="reveal" id="reveal"><h3>' +
      (ok ? "Correcte" : "Aquesta no") +
      "</h3><p>El navegador ha aplicat la regla que es veu a la previsualització.</p>";
    if (!bonusDone) {
      html += '<div class="bonus"><p><strong>' + esc(bonus.question) + "</strong></p>";
      bonus.options.forEach(function (option, index) {
        html +=
          '<button class="btn" type="button" data-action="bonus" data-index="' +
          index +
          '">' +
          esc(option) +
          "</button>";
      });
      html += "</div></section>";
      return html;
    }
    html +=
      specTable(battle) +
      "<p>" +
      esc(C.explainBattle(battle)) +
      "</p><p>" +
      (result.bonusOk ? "La justificació també és correcta." : "La justificació no era aquesta. L'explicació de dalt és la que queda.") +
      '</p><div class="btn-row"><button class="btn btn-primary" type="button" data-action="next-battle">' +
      (state.pointer + 1 >= state.queue.length ? "Ves a la porta" : "Ronda següent") +
      "</button></div></section>";
    return html;
  }

  function specTable(battle) {
    const applied = battle.correct === "a" ? "a" : "b";
    return (
      '<table class="spec-table"><thead><tr><th>Ordre</th><th>Selector</th><th>(inline, IDs, classes, elements)</th></tr></thead><tbody><tr class="' +
      (applied === "a" ? "win-row" : "") +
      '"><td>A</td><td class="mono">' +
      esc(battle.a.name) +
      "</td><td>" +
      esc(C.formatSpec(battle.a.spec)) +
      '</td></tr><tr class="' +
      (applied === "b" ? "win-row" : "") +
      '"><td>B</td><td class="mono">' +
      esc(battle.b.name) +
      importantBadge(battle.b, true) +
      "</td><td>" +
      esc(C.formatSpec(battle.b.spec)) +
      "</td></tr></tbody></table>"
    );
  }

  function renderBridge() {
    const correct = correctCount();
    const open = correct >= C.GATE;
    return (
      '<section class="bridge"><p class="kicker">Fase 1 acabada</p><h1 class="display">' +
      (open ? "Porta oberta" : "Porta tancada") +
      "</h1>" +
      (open
        ? '<p class="stamp">Acreditació de càlcul</p><p class="lede">' +
          esc(state.name) +
          " ha encertat " +
          correct +
          " de " +
          C.battles.length +
          " combats i " +
          bonusCount() +
          ' justificacions. A dins, ' + C.rooms.length + ' interfícies s\'han trencat. Arregla-les amb el mínim d\'especificitat. La teva regla es carrega al final. <code>!important</code> només és un parany a l\'última sala.</p><div class="btn-row"><button class="btn btn-primary" type="button" data-action="enter-escape">Entra a la sala 1</button></div>'
        : "<p class=\"lede\">Et calen " +
          C.GATE +
          " encerts i en portes " +
          correct +
          '. Torna a jugar només els combats fallats. Els encerts es queden.</p><div class="btn-row"><button class="btn btn-primary" type="button" data-action="retry">Repeteix els fallats</button></div>') +
      "</section>"
    );
  }

  function renderRoom() {
    const room = currentRoom();
    return (
      '<div class="room-head"><div><p class="eyebrow">Sala ' +
      room.id +
      " de " +
      C.rooms.length +
      "</p><h1>" +
      esc(room.name) +
      '</h1></div><div class="digits" id="digits">' +
      digitsHtml() +
      '</div></div><p class="lede">' +
      esc(room.story) +
      '</p><p class="html-sample">' +
      esc(room.html) +
      '</p><div class="room-grid"><div>' +
      ruleList(room) +
      roomComposer(room) +
      '<div id="feedback" class="feedback"></div></div><div class="stage-wrap"><p>Peça en directe</p><div id="stage"></div></div></div>' +
      apunts()
    );
  }

  function digitsHtml() {
    return C.rooms
      .map(function (room, index) {
        const got = state.roomsCleared[index];
        return '<span class="digit' + (got ? " is-on" : "") + '">' + (got ? esc(room.digit) : "·") + "</span>";
      })
      .join("");
  }

  function ruleList(room) {
    if (room.kind === "vault") return vaultRules(room);
    const clickable = room.kind === "inspect" && !state.foundCulprit[state.escapeRoom];
    const items = room.rules
      .map(function (rule, index) {
        const tag = clickable ? "button" : "div";
        const found = room.kind === "inspect" && state.foundCulprit[state.escapeRoom] && rule.culprit ? " is-culprit-found" : "";
        const attrs = clickable
          ? ' type="button" data-action="pick-rule" data-index="' + index + '"'
          : "";
        return (
          "<" +
          tag +
          ' class="rule' +
          found +
          '"' +
          attrs +
          '><i class="swatch" style="background:' +
          esc(rule.value) +
          '"></i><span><span class="mono">' +
          esc(rule.selector) +
          "</span> <span class=\"prop\">{ " +
          esc(rule.prop) +
          ": " +
          esc(rule.value) +
          (rule.important ? " !important" : "") +
          '; }</span></span><span class="spec-pill">' +
          esc(C.formatSpec(rule.spec)) +
          "</span></" +
          tag +
          ">"
        );
      })
      .join("");
    const help =
      room.kind === "inspect" && !state.foundCulprit[state.escapeRoom]
        ? "<p>Tria la regla que està guanyant ara.</p>"
        : "<p>Regles ja carregades. La teva s'afegirà al final.</p>";
    return '<div class="rule-list">' + help + items + "</div>";
  }

  function vaultRules(room) {
    const gold = room.rules[0];
    const weak = room.rules[1];
    const token = state.importantOn
      ? '<button class="important-token" type="button" data-action="toggle-important">!important</button>'
      : '<button class="important-token is-off" type="button" data-action="toggle-important">!important</button>';
    return (
      '<div class="rule-list"><p>Clica <code>!important</code> per treure\'l. Després comprova la caixa.</p><div class="rule"><i class="swatch" style="background:' +
      gold.value +
      '"></i><span class="mono">' +
      esc(gold.selector) +
      " { color: " +
      gold.value +
      '; }</span><span class="spec-pill">' +
      esc(C.formatSpec(gold.spec)) +
      '</span></div><div class="rule"><i class="swatch" style="background:' +
      weak.value +
      '"></i><span class="mono">' +
      esc(weak.selector) +
      " { color: " +
      weak.value +
      " " +
      token +
      '; }</span><span class="spec-pill">' +
      esc(C.formatSpec(weak.spec)) +
      '</span></div><div class="btn-row"><button class="btn btn-primary" type="button" data-action="open-vault">Comprova la caixa</button><button class="btn" type="button" data-action="trap-important">Afegir !important a la regla daurada</button></div></div>'
    );
  }

  function roomComposer(room) {
    if (room.kind === "vault") return "";
    if (room.kind === "inspect" && !state.foundCulprit[state.escapeRoom]) return "";
    const decl = room.prop + ": " + room.goal + ";";
    return (
      '<div class="editor"><div class="editor-bar"><span>La teva regla · al final del fitxer</span><span>només el selector</span></div><div class="editor-body"><label for="selector">selector</label><input id="selector" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder=".classe o #id" value="' +
      esc(state.selectorDraft) +
      '"><div><span class="locked">{</span><div class="locked">  ' +
      esc(decl) +
      '</div><span class="locked">}</span></div></div><p class="live-spec" id="live-spec"></p><div class="btn-row"><button class="btn btn-primary" type="button" data-action="test-selector">Prova el selector</button></div></div>'
    );
  }

  function renderFinal() {
    const digits = C.rooms.map(function (room) { return room.digit; }).join("");
    const correct = correctCount();
    const roomsWon = state.roomsCleared.filter(Boolean).length;
    return (
      '<p class="kicker">Codi de sortida</p><p class="final-code">' +
      digits +
      "</p><h2 class=\"rank\">" +
      esc(rankTitle()) +
      "</h2><p>" +
      esc(state.name) +
      " · " +
      elapsed() +
      "</p><table class=\"score-table\"><tr><td>Combat (" +
      correct +
      "/" +
      C.battles.length +
      " encerts, " +
      bonusCount() +
      " justificacions)</td><td>" +
      combatPoints() +
      "</td></tr><tr><td>Escape room (" +
      roomsWon +
      "/" +
      C.rooms.length +
      " sales)</td><td>" +
      roomPoints() +
      "</td></tr><tr><td>Tancament</td><td>" +
      reviewPoints() +
      "</td></tr><tr><td><strong>Total</strong></td><td><strong>" +
      totalPoints() +
      "</strong></td></tr></table>" +
      reviewBlock() +
      '<div class="card"><h2>Què t\'has d\'endur</h2><ul><li>La tupla es llegeix (inline, IDs, classes, elements) i es compara d\'esquerra a dreta.</li><li>Un ID guanya qualsevol nombre de classes.</li><li>Si dues regles empaten, mana l\'ordre del CSS.</li><li>!important no puja l\'especificitat: la salta. Treu-lo abans d\'apilar-ne un altre.</li></ul></div>'
    );
  }

  function rankTitle() {
    const points = totalPoints();
    if (points >= 5200) return "Mestre de la cascada";
    if (points >= 3800) return "Selector precís";
    if (points >= 2400) return "Ja llegeixes tuples";
    return "L'ID encara et guanya algun cop";
  }

  function reviewBlock() {
    return C.review
      .map(function (item, qIndex) {
        const answer = state.reviewAnswers[qIndex];
        const answered = answer !== null && answer !== undefined;
        const options = item.options
          .map(function (option, index) {
            let cls = "btn";
            if (answered && index === item.correct) cls += " is-right";
            else if (answered && answer === index) cls += " is-wrong";
            return (
              '<button class="' +
              cls +
              '" type="button" data-action="review" data-q="' +
              qIndex +
              '" data-index="' +
              index +
              '"' +
              (answered ? " disabled" : "") +
              ">" +
              esc(option) +
              "</button>"
            );
          })
          .join("");
        const verdict = answered
          ? '<div class="feedback ' +
            (answer === item.correct ? "ok" : "bad") +
            '"><p><strong>' +
            (answer === item.correct ? "Correcte." : "Aquesta no.") +
            "</strong> " +
            esc(item.why || "") +
            "</p></div>"
          : "";
        return (
          '<section class="reveal"><h3>Sortida ' +
          (qIndex + 1) +
          "</h3><p>" +
          esc(item.q) +
          '</p><div class="bonus">' +
          options +
          "</div>" +
          verdict +
          "</section>"
        );
      })
      .join("");
  }

  function apunts() {
    return (
      '<details class="apunts"><summary>Apunts d\'especificitat</summary><ul><li>La tupla és <strong>(inline, IDs, classes, elements)</strong>.</li><li><code>p</code> → (0, 0, 0, 1). Cada element o pseudo-element suma 1 a la quarta columna.</li><li><code>.btn</code> → (0, 0, 1, 0). Classes, atributs i pseudo-classes van a la tercera.</li><li><code>#enviar</code> → (0, 1, 0, 0). Cada ID suma 1 a la segona.</li><li>L\'estil en línia és (1, 0, 0, 0).</li><li>Es compara d\'esquerra a dreta. Un ID guanya qualsevol nombre de classes.</li><li>Si les tuples són iguals, s\'aplica la regla escrita més tard.</li><li><code>!important</code> no és una columna. Un !important del CSS guanya un selector normal, fins i tot un ID. Avui no n\'apilem més: el treiem.</li></ul></details>'
    );
  }

  function docentPanel() {
    if (!docent) return "";
    return (
      '<div class="docent"><p>Mode docent</p><div class="btn-row"><button class="btn" type="button" data-action="docent-escape">Omple el combat i ves a la porta</button><button class="btn" type="button" data-action="docent-battle" data-battle="1">Combat 1</button><button class="btn" type="button" data-action="docent-battle" data-battle="12">Combat 12</button><button class="btn" type="button" data-action="docent-battle" data-battle="24">Combat 24</button><button class="btn" type="button" data-action="docent-room" data-room="0">Sala 1</button><button class="btn" type="button" data-action="docent-room" data-room="4">Sala 5</button><button class="btn" type="button" data-action="docent-room" data-room="7">Sala 8</button></div></div>'
    );
  }

  function afterRender() {
    if (state.phase === "combat") {
      const battle = currentBattle();
      const result = state.results[currentBattleIndex()];
      const css = result && result.choice ? C.battleCSS(battle) : battle.layout || "";
      paintStage(css, battle.html);
    }
    if (state.phase === "escape") {
      const room = currentRoom();
      if (room.kind === "vault") paintVault();
      else paintRoom(state.selectorDraft || "");
      updateLiveSpec();
      if (state.roomsCleared[state.escapeRoom]) {
        const nextLabel = state.escapeRoom >= C.rooms.length - 1 ? "Ves al tancament" : "Sala següent";
        writeFeedback(
          document.getElementById("feedback"),
          "ok",
          '<p>Aquesta sala ja està resolta.</p><p><button class="btn btn-primary" type="button" data-action="next-room">' +
            nextLabel +
            "</button></p>"
        );
      }
    }
    const clock = document.getElementById("clock");
    if (clock) clock.textContent = elapsed();
  }

  function paintRoom(selector) {
    const room = currentRoom();
    const safe = isSafeSelector(selector) ? selector : "";
    return paintStage(C.roomStyles(room, { selector: safe }), room.html);
  }

  function paintVault() {
    const room = currentRoom();
    const root = paintStage(C.roomStyles(room, { stripImportant: !state.importantOn }), room.html);
    const secret = root && root.querySelector(".secret");
    if (secret) secret.textContent = state.importantOn ? "TANCAT" : "OBERT";
    return root;
  }

  function updateLiveSpec() {
    const node = document.getElementById("live-spec");
    const input = document.getElementById("selector");
    if (!node || !input) return;
    const spec = C.specificity(input.value);
    node.textContent = spec
      ? "El teu selector: " + C.formatSpec(spec)
      : input.value.trim()
        ? "Encara no puc calcular aquest selector."
        : "Especificitat: —";
  }

  function updateDigits() {
    const node = document.getElementById("digits");
    if (node) node.innerHTML = digitsHtml();
  }

  function updateScore() {
    const node = document.getElementById("score");
    if (node) node.textContent = String(totalPoints());
  }

  app.addEventListener("click", function (event) {
    const btn = event.target.closest("[data-action]");
    if (!btn || !app.contains(btn)) return;
    const action = actions[btn.dataset.action];
    if (action) action(btn);
  });

  app.addEventListener("input", function (event) {
    if (event.target.id !== "selector") return;
    state.selectorDraft = event.target.value;
    updateLiveSpec();
    if (state.phase === "escape" && currentRoom() && currentRoom().kind !== "vault") {
      paintRoom(normalizeSelector(event.target.value));
    }
  });

  app.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && event.target.id === "selector") {
      event.preventDefault();
      actions["test-selector"]();
      return;
    }
    if (state.phase !== "combat") return;
    const result = state.results[currentBattleIndex()];
    if (result && result.choice) return;
    const map = { "1": "a", "2": "b", "3": "order" };
    if (map[event.key]) {
      const fake = { dataset: { choice: map[event.key] } };
      actions.choice(fake);
    }
  });

  setInterval(function () {
    const clock = document.getElementById("clock");
    if (clock) clock.textContent = elapsed();
    const pace = document.getElementById("pace");
    if (pace) pace.textContent = paceNote();
  }, 1000);

  render();
})();
