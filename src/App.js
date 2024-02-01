import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { routes } from "./routes";
import { Provider } from "react";
import HeaderComponent from "./components/HeaderComponent";
import FooterComponent from "./components/FooterComponent";
import GlobalStyles from "./components/assets/GlobalStyles";

function App() {
  return (
    <Router>
      <HeaderComponent />
      {routes.map((route) => (
        <Route
          key={route.path}
          exact
          path={route.path}
          component={route.page}
        />
      ))}
      <FooterComponent />
    </Router>
  );
}

export default App;
