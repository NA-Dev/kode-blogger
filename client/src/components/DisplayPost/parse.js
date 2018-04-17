const parseValue = (nodes) => {
  var code = [];
  var text = [];
  var index = 0;
  var currentContent = "text";

  var placeholderText = {
    object: "block",
    type: "paragraph",
    isVoid: false,
    data: {},
    nodes: [
      {
        object: "text",
        leaves: [
          {
            object: "leaf",
            text: "( no text was input for this section )",
            marks: []
          }
        ]
      }
    ]
  };

  var placeholderCode = {
    "object": "block",
    "type": "code_block",
    "isVoid": false,
    "data": { "syntax": "javascript" },
    "nodes": [
      {
        "object": "block",
        "type": "code_line",
        "isVoid": false,
        "data": { "syntax": "javascript" },
        "nodes": [
          {
            "object": "text",
            "leaves": [
              { "object": "leaf", "text": "( no code was input for this section )", "marks": [] }
            ]
          }
        ]
      }
    ]
  };

  nodes = nodes.filter((node, i) => {
    var remove = false;

    // remove blank paragraph nodes
    if (node.type === "paragraph" && node.nodes[0].leaves) {
      node.nodes.map(subNode => {
        if (subNode.leaves[0].text === "") {
          remove = true;
        }
      })
    
    // remove blank code-block nodes
    } else if ( node.type === "code-block" ) {
      node.nodes.map(subNode => {
        if (subNode.nodes[0].leaves[0].text === "") {
          remove = true;
        }
      })
    }

    return !remove;
  });

  nodes.map((node, i) => {

    // scan nodes and parse
    if (node.type === "code_block" && currentContent === "code") {
      if (!code[index]) {
        code[index] = [];
      }
      code[index].push(node);
    
    } else if (node.type === "code_block" && currentContent === "text") {
      currentContent = "code"
      if (!text[index]) {
        text[index] = placeholderText;
      }      
      if (!code[index]) {
        code[index] = [];
      }
      code[index].push(node);
    
    } else if (node.type !== "code_block" && currentContent === "code") {
      currentContent = "text"
      if (!code[index]) {
        code[index] = placeholderCode;
      }
      index++      
      if (!text[index]) {
        text[index] = []
      }
      text[index].push(node);

    } else if (node.type !== "code_block" && currentContent === "text") {
      if (!text[index]) {
        text[index] = []
      }
      text[index].push(node);
    }
  });

  return { code, text }
}

export default parseValue;
