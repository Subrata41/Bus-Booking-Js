document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.querySelector("#bookingForm");
  const bookingTableBody = document.querySelector("#booking-table-body");
  const filterCarNumber = document.querySelector("#filter-car-number");

  const CRUD_ENDPOINT =
    "https://crudcrud.com/api/645e493332fd4a6a8642371649e3376b/bookings";

  loadBookings();

  bookingForm.addEventListener("submit", busBooking);
  filterCarNumber.addEventListener("change", filterBookings);

  async function loadBookings() {
    try {
      const response = await fetch(CRUD_ENDPOINT);
      const bookings = await response.json();
      bookings.forEach(addBookingToTable);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    }
  }

  async function saveBooking(newBooking) {
    try {
      const response = await fetch(CRUD_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBooking),
      });

      const savedBooking = await response.json();
      addBookingToTable(savedBooking);
      bookingForm.reset();
    } catch (err) {
      console.error("Failed to save booking:", err);
    }
  }

  function busBooking(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const carNumber = document.getElementById("car_number").value;

    const newBooking = { name, email, phone, carNumber };
    saveBooking(newBooking);
  }

  function addBookingToTable(booking) {
    const newRow = document.createElement("tr");
    newRow.dataset.carNumber = booking.carNumber;
    newRow.dataset.bookingId = booking._id;

    newRow.innerHTML = `
      <td>${booking.name}</td>
      <td>${booking.email}</td>
      <td>${booking.phone}</td>
      <td>${booking.carNumber}</td>
      <td>
        <button class="btn btn-warning btn-sm edit-btn">Edit</button>
        <button class="btn btn-danger btn-sm delete-btn">Delete</button>
      </td>
    `;

    bookingTableBody.appendChild(newRow);

    const editBtn = newRow.querySelector(".edit-btn");
    const deleteBtn = newRow.querySelector(".delete-btn");

    editBtn.addEventListener("click", function () {
      document.getElementById("name").value = booking.name;
      document.getElementById("email").value = booking.email;
      document.getElementById("phone").value = booking.phone;
      document.getElementById("car_number").value = booking.carNumber;

      newRow.remove();
      deleteBooking(booking._id);
    });

    deleteBtn.addEventListener("click", function () {
      newRow.remove();
      deleteBooking(booking._id);
    });
  }

  async function deleteBooking(id) {
    try {
      const response = await fetch(`${CRUD_ENDPOINT}/${id}`, {
        method: "DELETE",
      });
      console.log("Booking Deleted");
    } catch (err) {
      console.error("Failed to delete booking:", err);
    }
  }

  function filterBookings() {
    const selectedCarNumber = filterCarNumber.value;
    Array.from(bookingTableBody.querySelectorAll("tr")).forEach((row) => {
      row.style.display =
        selectedCarNumber === "All" ||
        row.dataset.carNumber === selectedCarNumber
          ? ""
          : "none";
    });
  }
});
