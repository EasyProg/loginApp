import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import { Home } from "./Home";
import { API_URL } from "./consts";
import ProtectedRoute from "./routes/ProtectedRoute";
import { UserForm } from "./ui/UserForm/UserForm";

function App() {
  const authLink = new SetContextLink(({ headers }) => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const appLink = new HttpLink({ uri: API_URL });
  const client = new ApolloClient({
    link: authLink.concat(appLink),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<UserForm />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
