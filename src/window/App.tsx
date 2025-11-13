import { ErrorBoundary, Suspense } from "solid-js";
import { QrLoader } from "@/components/qrcode/Loader";
import { QrErrorPage } from "@/components/qrcode/Pager";
import { AppContext, appStore, appStoreInit } from "@/stores";
import { PersistGate } from "@/stores/PersistGate";
import View from "./View";
import "@/styles/app.css";

function App() {
  return (
    <ErrorBoundary
      fallback={(err, reset) => (
        <QrErrorPage
          err={err}
          reset={reset}
        />
      )}
    >
      <Suspense fallback={<QrLoader screen />}>
        <AppContext.Provider value={appStore}>
          <PersistGate
            init={appStoreInit}
            fallback={<QrLoader screen />}
          >
            <View />
          </PersistGate>
        </AppContext.Provider>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
