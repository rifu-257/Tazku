
import React from "react";
import ReactDOMServer from "react-dom/server";
import * as cheerio from "cheerio";

function getSelector($: cheerio.CheerioAPI, el: any): string {
  const parts: string[] = [];
  let curr = el;
  while (curr && curr.length && curr[0].name) {
    const node = curr[0];
    if (node.name === "body" || node.name === "html") break;
    const parent = curr.parent();
    if (!parent || !parent.length) break;
    const sameTagSiblings = parent.children().filter((_: any, sibling: any) => sibling.type === "tag" && sibling.name === node.name);
    const index = sameTagSiblings.index(curr) + 1;
    let part = `${node.name}:nth-of-type(${index})`;
    if (node.attribs && node.attribs.id === "root") {
      part = `div#root:nth-of-type(${index})`;
      parts.unshift(part);
      break;
    }
    parts.unshift(part);
    curr = parent;
  }
  return parts.join(" > ");
}

const target1 = "div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2) > button:nth-of-type(1)";
const target2 = "div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2) > button:nth-of-type(2)";

// Look through all files in src and find any JSX containing button:nth-of-type(1) and button:nth-of-type(2)
console.log("target1:", target1);
