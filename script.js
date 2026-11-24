const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
}));
document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("booking-form");
const checkin = form.elements.checkin;
const checkout = form.elements.checkout;
const today = new Date().toISOString().split("T")[0];
checkin.min = today;
checkout.min = today;
checkin.addEventListener("change", () => {
  checkout.min = checkin.value || today;
  if (checkout.value && checkout.value <= checkin.value) checkout.value = "";
});
form.addEventListener("submit", async event => {
  event.preventDefault();

  const message = form.querySelector(".form-message");
  const submitButton = form.querySelector('button[type="submit"]');

  if (checkout.value <= checkin.value) {
    message.textContent = "Please choose a check-out date after your check-in date.";
    return;
  }

  message.textContent = "Sending your reservation enquiry...";
  submitButton.disabled = true;

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("The enquiry could not be sent. Please try again.");
    }

    message.textContent =
      "Thank you! Your reservation enquiry has been sent. The hotel will contact you by email after reviewing your request.";

    form.reset();
    checkin.min = today;
    checkout.min = today;

  } catch (error) {
    message.textContent =
      "We could not send your enquiry right now. Please try again shortly.";

  } finally {
    submitButton.disabled = false;
  }
});
