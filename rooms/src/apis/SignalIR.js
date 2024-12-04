
// SignalR.js
import { HubConnectionBuilder } from "@microsoft/signalr";

const baseUrl = 'https://localhost:7240'; 


export function setupSignalRConnection(token, onCartItemQuantityUpdate, updateCartItemInState, onCartTotalsUpdate ) {
    const hubUrl = `${baseUrl}/notificationhub`; // Construct the full URL for the SignalR hub

  const connection = new HubConnectionBuilder()
  .withUrl(hubUrl, {

      accessTokenFactory: () => token,
      withCredentials: true // Add this line

    })
    .withAutomaticReconnect()
    .build();

    connection.on("CreateCartItemUpdate", cartItem => {
      // Listening for cart item quantity updates
          onCartItemQuantityUpdate(cartItem); // New event listener
      
  
    });
    
 connection.on("CartItemQuantityUpdated", cartItem => {
  // Update state with the updated cart item
  updateCartItemInState(cartItem);
});


connection.on("CartItemDeductedUpdated", cartItem => {
  // Update state with the updated cart item
  updateCartItemInState(cartItem);
});

connection.on("UpdateCartTotals", cartTotals => {
  console.log("Received Cart Totals via SignalR:", cartTotals); // Debugging
  onCartTotalsUpdate(cartTotals);
});




connection.start()
        .then(() => {
            console.log("Connection established. Connection ID:", connection.connectionId);
            // You may choose to store the connectionId in a state, context or even in local storage
        })
        .catch(err => console.error("SignalR Connection Error: ", err));

    return connection;
      }

export function disconnectSignalRConnection(connection) {
  if (connection) {
    connection.stop();
  }
}
