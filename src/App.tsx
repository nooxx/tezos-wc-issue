import './App.css'
import XtzContextProvider from "./XtzContextProvider.tsx";
import XtzWalletStatus from "./XtzWalletStatus.tsx";
import XtzStakingWidget from "./XtzStakingWidget.tsx";

function App() {

  return (
    <XtzContextProvider>
      <XtzWalletStatus/>
      <XtzStakingWidget/>
    </XtzContextProvider>
  )
}

export default App
