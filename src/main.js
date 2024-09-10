import Parser from "web-tree-sitter";

const example = `
BEGIN
  P1;
  PARBEGIN
    P3;
    BEGIN
      P2;
      P4;
      PARBEGIN
        P5;
        P6;
      PAREND
    END
  PAREND
  P7;
END
`;

let graph = new Map();

/*
bloco seq:
  p1
  bloco par:
    p3
    bloco seq:
      p2
      p4
      bloco par:
        p5
	p6
  p7
*/

const dfs = (node) => {
  if (node.type === "call") {
    const label = node.child(0).text;
    graph.set(label, new Set());
  } else if (node.type === "begin") {
  } else if (node.type === "parbegin") {
  } else if (node.type === "end") {
  } else if (node.type === "parend") {
  }

  const count = node.childCount;

  if (count === 0) return;

  for (let i = 0; i < count; i++) {
    dfs(node.child(i));
  }
};

const dot = () => {
  console.log(graph);

  let out = "digraph {";

  for (const edge of graph) {
    const src = edge[0];
    for (const dst of edge[1]) {
	out = `${out}
${src} -> ${dst};`
    }
  }

  out = `${out}
}`;

  return out;
};

const main = async () => {
  await Parser.init();
  const parbeginParendLangauge = await Parser.Language.load("tree-sitter-parbeginparend.wasm");
  const parser = new Parser();
  parser.setLanguage(parbeginParendLangauge);
  const tree = parser.parse(example);
  dfs(tree.rootNode);
  console.log(dot());
};

main();
