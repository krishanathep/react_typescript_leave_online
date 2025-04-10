import AuthProvider from "react-auth-kit";
import createStore from "react-auth-kit/createStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Routes from "./Routes";
import "./App.css";

function App() {
  const queryClient = new QueryClient();
  const store = createStore({
    authName: "_auth",
    authType: "cookie",
    cookieDomain: window.location.hostname,
    cookieSecure: window.location.protocol === "https:",
  });
  return (
    <>
      <AuthProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <Routes />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
}

export default App;
