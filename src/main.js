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

const callStack = [];

const dfs = (node) => {
  if (node.type === "call") {
    callStack.push(node.child(0).text);
  } else if (node.type === "begin") {
    callStack.push("(");
  } else if (node.type === "parbegin") {
    callStack.push("[");
  } else if (node.type === "end") {
    callStack.push(")");
  } else if (node.type === "parend") {
    callStack.push("]");
  }

  if (node.childCount === 0) return;

  for (let i = 0; i < node.childCount; i++) {
    dfs(node.child(i));
  }
};

const process = () => {
  const tree = [];

  for (const statement of callStack) {
    if (statement === "(") {
      if (tree.length > 0) {
        tree[tree.length - 1].push([]);
      } else {
        tree.push([]);
      }
    } else if (statement === ")") {
      tree.push([]);
    } else if (statement === "[") {
    } else if (statement === "]") {
    } else {
      tree[tree.length - 1].push(statement);
    }
  }

  console.log(tree);
};

const dot = () => {
  const graph = new Map();

  console.log(graph);

  let out = "digraph {";

  for (const edge of graph) {
    const src = edge[0];
    for (const dst of edge[1]) {
      out = `${out}
${src} -> ${dst};`;
    }
  }

  out = `${out}
}`;

  return out;
};

const main = async () => {
  await Parser.init();
  const parbeginParendLangauge = await Parser.Language.load(
    "tree-sitter-parbeginparend.wasm",
  );
  const parser = new Parser();
  parser.setLanguage(parbeginParendLangauge);
  const tree = parser.parse(example);
  dfs(tree.rootNode);
  console.log(callStack);
  process();
  console.log(dot());
};

main();
