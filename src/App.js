import './App.css';
import React, {createContext, useState} from "react";
import Header from "./component/Header/Header";
import Shop from "./component/Shop/Shop";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Review from "./component/Review/Review";
import Inventory from "./component/Inventory/Inventory";
import NotFound from "./component/NotFound/NotFound";
import ProductDetail from "./component/ProductDetail/ProductDetail";
import Login from "./component/Login/Login";
import Shipment from "./component/Shipment/Shipment";
import PrivateRoute from "./component/PrivateRoute/PrivateRoute";

export const UserContext = createContext();

function App() {
    const [loggedInUser, setLoggedInUser] = useState({});
  return (
    <UserContext.Provider value={[loggedInUser, setLoggedInUser]}>
        <h3>Email: {loggedInUser?.email}</h3>
        <Router>
            <Header></Header>
            <Switch>
                <Route path="/shop">
                    <Shop></Shop>
                </Route>
                <Route path="/review">
                    <Review></Review>
                </Route>
                <PrivateRoute path="/inventory">
                    <Inventory></Inventory>
                </PrivateRoute>
                <Route path="/login">
                    <Login></Login>
                </Route>
                <PrivateRoute path="/shipment">
                    <Shipment></Shipment>
                </PrivateRoute>
                <Route exact path="/">
                    <Shop></Shop>
                </Route>
                <Route path="/product/:productKey"> {/*colon (:) diye dynamic value read kora bujhai*/}
                    <ProductDetail></ProductDetail>
                </Route>
                <Route path="*">
                    <NotFound></NotFound>
                </Route>
            </Switch>
        </Router>
    </UserContext.Provider>
  );
}

export default App;
