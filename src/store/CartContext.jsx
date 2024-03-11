import { createContext, useReducer } from "react";

const CartContext = createContext({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
});

function cartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    const updatedItems = [...state.items];

    const existingCartItemIndex = updatedItems.findIndex(
      (item) => item.id === action.payload.id
    );

    if (existingCartItemIndex > -1) {
      const existingCartItem = updatedItems[existingCartItemIndex];
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems.push({
        ...action.payload,
        quantity: 1,
      });
    }

    return {
      ...state,
      items: updatedItems,
    };
  }

  if (action.type === "REMOVE_ITEM") {
    const updatedItems = [...state.items];

    const existingCartItemIndex = updatedItems.findIndex(
      (item) => item.id === action.payload
    );

    const existingCartItem = updatedItems[existingCartItemIndex];

    if (existingCartItem.quantity === 1) {
      updatedItems.splice(existingCartItemIndex, 1);
    } else {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity - 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    }
    return {
      ...state,
      items: updatedItems,
    };
  }

  if (action.type === "CLEAR_CART") {
    return {
      ...state,
      items: [],
    };
  }

  return state;
}

export function CartContextProvider({ children }) {
  const [cartState, dispatchCartAction] = useReducer(cartReducer, {
    items: [],
  });

  function addItem(item) {
    dispatchCartAction({
      type: "ADD_ITEM",
      payload: item,
    });
  }

  function removeItem(id) {
    dispatchCartAction({
      type: "REMOVE_ITEM",
      payload: id,
    });
  }

  function clearCart() {
    dispatchCartAction({
      type: "CLEAR_CART",
    });
  }

  const ctxValue = {
    items: cartState.items,
    addItem,
    removeItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
  );
}

export default CartContext;
