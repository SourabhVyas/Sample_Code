import { useState } from "react";

import Window from "./components/Window";

function App() {
  const [window, setWindow] = useState("auth");
  

  return <Window window={window} setWindow={setWindow} />;
}

export default App;
