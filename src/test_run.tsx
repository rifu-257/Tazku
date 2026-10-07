
import * as cheerio from "cheerio";
import React from "react";
import ReactDOMServer from "react-dom/server";

import { RoleSelectionScreen } from "./components/RoleSelectionScreen";
import { AccountActionScreen } from "./components/AccountActionScreen";
import { AuthScreen } from "./components/AuthScreen";
import { LinkBankAccountScreen } from "./components/LinkBankAccountScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { MahalluPortalScreen } from "./components/MahalluPortalScreen";

const components = [
  { name: "RoleSelectionScreen", el: React.createElement(RoleSelectionScreen, { onSelectRole: () => {} }) },
  { name: "AccountActionScreen-personal", el: React.createElement(AccountActionScreen, { role: "personal", onSelectAction: () => {}, onBack: () => {} }) },
  { name: "AccountActionScreen-mahal", el: React.createElement(AccountActionScreen, { role: "mahal", onSelectAction: () => {}, onBack: () => {} }) },
  { name: "AuthScreen-login", el: React.createElement(AuthScreen, { role: "personal", action: "login", onSuccess: () => {}, onBack: () => {}, onSwitchAction: () => {} }) },
  { name: "AuthScreen-register", el: React.createElement(AuthScreen, { role: "personal", action: "register", onSuccess: () => {}, onBack: () => {} }) },
  { name: "LinkBankAccountScreen", el: React.createElement(LinkBankAccountScreen, { onComplete: () => {}, onSkip: () => {} }) },
  { name: "OnboardingScreen", el: React.createElement(OnboardingScreen, { onOpenCalculator: () => {}, onOpenTracker: () => {}, onOpenArticles: () => {}, onOpenFaq: () => {}, onStartGiving: () => {} }) }
];

const targetSelector1 = "div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2) > button:nth-of-type(1)";
const targetSelector2 = "div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2) > button:nth-of-type(2)";
const targetSelector3 = "div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2)";

for (const c of components) {
  const html = `<div id="root">${ReactDOMServer.renderToString(c.el)}</div>`;
  const $ = cheerio.load(html);
  const m1 = $(targetSelector1);
  const m2 = $(targetSelector2);
  const m3 = $(targetSelector3);
  if (m1.length || m2.length || m3.length) {
    console.log(`MATCH in component: ${c.name}!`);
    console.log("m1 text:", m1.text());
    console.log("m2 text:", m2.text());
    console.log("m3 text:", m3.text());
  } else {
    console.log(`--- ${c.name} (buttons: ${$("button").length}) ---`);
    $("button").each((i, el) => {
      const parts = [];
      let curr = $(el);
      while (curr && curr.length && curr[0].type === "tag") {
        const tag = curr[0].name;
        const parent = curr.parent();
        if (!parent || !parent.length || parent[0].type === "root") {
          const id = curr.attr("id");
          parts.unshift(id ? `${tag}#${id}` : tag);
          break;
        }
        const siblings = parent.children().filter((_, sibling) => sibling.type === "tag" && sibling.name === tag);
        const index = siblings.index(curr) + 1;
        parts.unshift(`${tag}:nth-of-type(${index})`);
        curr = parent;
      }
      console.log(`  btn ${i+1}: ${parts.join(" > ")} [${$(el).text().trim().slice(0, 30)}]`);
    });
  }
}
