const finalizarCompra = document.getElementById("finalizar-compra")

finalizarCompra.addEventListener("click", () => {
    fetch("/api/carts/finalizarCompra", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
})