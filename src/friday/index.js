import React from "react";
import ReactDOM from "react-dom";

import Canvas from "./components/canvas";

const mainNode = document.getElementById("main");
mainNode.style.width = "100%";
mainNode.style.height = "100%";
mainNode.style.position = "fixed";
mainNode.style.left = "0";
mainNode.style.top = "0";

ReactDOM.render(<Canvas />, document.getElementById("main"));
