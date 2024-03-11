import { useContext } from "react";

import CartContext from "../store/CartContext.jsx";
import Modal from "./UI/Modal.jsx";
import { currencyFormatter } from "../util/formatting.js";
import Input from "./UI/Input.jsx";
import Button from "./UI/Button.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import useHttp from "../hooks/useHttp.jsx";
import Error from "./Error.jsx";

const requestConfig = {
  method: "POST",
  headers: {
    "content-type": "application/json",
  },
};

export default function Checkout() {
  const cartCtx = useContext(CartContext);

  const userProgressCtx = useContext(UserProgressContext);

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData
  } = useHttp("http://localhost:3000/orders", requestConfig);

  const cartTotal = cartCtx.items.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  function handleHideCheckout() {
    userProgressCtx.hidecheckout();
  }

  function handleClearCart() {
    userProgressCtx.hidecheckout();
    cartCtx.clearCart();
    clearData();
  }

  function handleSubmit(event) {
    event.preventDefault();

    const fd = new FormData(event.target);

    const customerData = Object.fromEntries(fd.entries());

    sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      })
    );
  }

  let actions = (
    <>
      <Button type="button" textOnly onClick={handleHideCheckout}>
        Close
      </Button>
      <Button>Submit order</Button>
    </>
  );

  if (isSending) {
    actions = <span>Sending order data....</span>;
  }

  if (data && !error) {
    return (
      <Modal
        open={userProgressCtx.progress === "checkout"}
        onClose={handleClearCart}
      >
        <h2>Success!</h2>
        <p>Your order wast submitted successfully...</p>
        <p>We will get back to you via email within the next few minutes...</p>
        <p className="modal-actions">
          <Button onClick={handleClearCart}>Okay</Button>
        </p>
      </Modal>
    );
  }

  return (
    <Modal
      open={userProgressCtx.progress === "checkout"}
      onClose={handleHideCheckout}
    >
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

        <Input id="name" label="Full Name" type="text" />
        <Input id="email" label="E-mail Address" type="email" />
        <Input id="street" label="Street" type="text" />
        <div className="control-row">
          <Input id="postal-code" label="Postal Code" type="text" />
          <Input id="city" label="City" type="text" />
        </div>
        {error && <Error title="Failed to submit order" message={error} />}
        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}
