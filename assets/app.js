//les imports
import React from "react";
import ReactDOM from "react-dom";
import Navbar from "./js/components/Navbar";
import HomePage from "./js/pages/HomePage";
import { HashRouter, Switch, Route } from "react-router-dom";

// any CSS you import will output into a single css file (app.css in this case)
import "./styles/app.css";
import CustomersPage from "./js/pages/CustomersPage";
import CustomersPageWithPagination from "./js/pages/CustomersPageWithPagination";
import InvoicesPage from "./js/pages/InvoicesPage";

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

console.log("Hello Webpack Encore! Edit me in assets/app.js");

const App = () => {
  return (
    <HashRouter>
      <Navbar />
      <main className="container pt-5">
        <Switch>
          <Route path="/customers" component={CustomersPage} />
          <Route path="/invoices" component={InvoicesPage} />
          <Route path="/" component={HomePage} />
        </Switch>
      </main>
    </HashRouter>
  );
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
