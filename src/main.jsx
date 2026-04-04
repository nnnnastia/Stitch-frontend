import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "/src/sass/style.scss";
import { BrowserRouter } from "react-router-dom";

import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "./lib/apolloClient.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </BrowserRouter>
);
