paypal
  .Buttons({
    createOrder: function (data, actions) {
      const addCart = JSON.parse(localStorage.getItem("addCart"));
      const totalAmount = addCart.reduce((total, product) => {
        const productTotal = product.quantity * product.price;
        return total + productTotal;
      }, 0);

      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: totalAmount.toFixed(2),
            },
          },
        ],
      });
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(async function (details) {
        try {
          const addCart = JSON.parse(localStorage.getItem("addCart"));
          if (
            details &&
            details.purchase_units &&
            details.purchase_units.length > 0
          ) {
            const totalAmount = details.purchase_units[0].amount.value;
            const response = await fetch("/process-paypal-order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ addCart, totalAmount }),
            });

            const result = await response.json();

            if (result.success) {
              console.log("Commande traitée avec succès.");
              localStorage.removeItem("addCart");
              window.location.href = "/panier";
            } else {
              console.error("Erreur lors du traitement de la commande.");
            }
          } else {
            console.error("Détails de la commande manquants ou incorrects.");
          }
        } catch (error) {
          console.error(
            "Erreur lors de la communication avec le serveur:",
            error
          );
        }
      });
    },
    onError: function (data, actions) {
      console.error("Erreur de paiement :", data);
    },
  })
  .render("#paypal-button-container");
