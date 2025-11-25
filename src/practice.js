import "./style.css";

const form = document.querySelector("#join-form");
const errorsBox = document.querySelector("#validation-errors");
const submittedBox = document.querySelector("#submitted");

// We don't always have to start at the top of the `document`.
const submitBtn = form.querySelector('[type="submit"]');

function ErrorItem(msg) {
  return `<li class="text-red-700">${msg}</li>`;
}

function gatherFieldErrors(el) {
  // We access the `validity` object on the incoming element.
  const v = el.validity;
  if (v.valid) return [];

  // Note: We are okay using .push() here.
  // This `errors` array is created fresh every time this function runs
  // and returned immediately. It is NOT long-lived app "state".
  // Later, when we talk about React-style state, we will avoid mutating
  // arrays that live across renders. For short-lived helper arrays like
  // this one, .push() keeps the code simple and readable.
  const errors = [];

  if (v.valueMissing) errors.push(`${el.name} is required.`);
  if (v.tooShort)
    errors.push(
      `${el.name} must be at least ${el.getAttribute("minlength")} characters.`,
    );
  if (v.tooLong)
    errors.push(
      `${el.name} must be at most ${el.getAttribute("maxlength")} characters.`,
    );
  if (v.typeMismatch) errors.push(`Please enter a valid ${el.type}.`);

  // Do we have any custom errors set from `setCustomValidity()`?
  if (v.customError) errors.push(el.validationMessage);

  //   This could be removed because `patternMismatch` is now handled by `customError`
  if (v.patternMismatch)
    errors.push(`${el.name} format is invalid. This is from pattern MISMATCH.`);

  return errors;
}

function collectErrors() {
  // Convert the HTMLFormControlsCollection into a real Array so we can use `filter()`.
  const fields = Array.from(form.elements).filter((field) => field.name);
  // `fields` is now a real array of just the inputs with a name (ignore the button).
  // We already wrote `gatherFieldErrors(el)` to return an ARRAY of messages for one field.
  // Here we map over all fields and then flatten so we end up with
  // ONE big array of strings instead of an array of arrays.
  // If you were to log this, you would see that it was an Array of Arrays 🤮
  // We use `flatMap` to avoid that!
  return fields.flatMap((field) => gatherFieldErrors(field));
}

function renderErrors(list) {
  errorsBox.innerHTML = list.length
    ? `<ul class="mb-4">${list.map(ErrorItem).join("")}</ul>`
    : "";
}

function updateSubmitState() {
  // If there are any errors, disable the button
  submitBtn.disabled = collectErrors().length;
  submitBtn.classList.toggle("opacity-50", submitBtn.disabled);
}

// This listens for any input changes in the form
// and updates errors and submit button state live.
// Putting the listener on the form means any change in its inputs
// will trigger this function (one listener instead of one per field).
form.addEventListener("input", () => {
  form.username.setCustomValidity(""); // reset first

  if (form.username.validity.patternMismatch) {
    console.log("pattern mismatch detected");

    form.username.setCustomValidity(
      "Username may contain only letters and numbers.",
    );
  }

  renderErrors(collectErrors());
  updateSubmitState();
});
