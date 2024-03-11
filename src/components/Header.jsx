import { useContext } from "react";

import CartContext from "../store/CartContext.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import logoImg from "../assets/logo.jpg";
import Button from "./UI/Button";

export default function Header() {
  const { items } = useContext(CartContext);

  const { showCart } = useContext(UserProgressContext);

  const totalCartItems = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  function handleShowCart() {
    showCart();
  }

  return (
    <header id="main-header">
      <div id="title">
        <img src={logoImg} alt="Food order" />
        <h1>ReactFood</h1>
      </div>
      <nav>
        <Button textOnly onClick={handleShowCart}>
          Cart ({totalCartItems})
        </Button>
      </nav>
    </header>
  );
}
