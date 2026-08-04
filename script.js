const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const siteHeader = document.querySelector("[data-header]");
const enquiryForm = document.querySelector("[data-enquiry-form]");

if (navToggle && nav) {
  const closeNavigation = () => {
    nav.classList.remove("is-open");
    siteHeader?.classList.remove("is-menu-open");
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    siteHeader?.classList.toggle("is-menu-open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNavigation);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNavigation();
    }
  });
}

if (siteHeader) {
  const updateHeader = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

if (enquiryForm) {
  enquiryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!enquiryForm.reportValidity()) {
      return;
    }

    const submitButton = enquiryForm.querySelector("[data-submit-button]");
    const status = enquiryForm.querySelector("[data-form-status]");
    const originalLabel = submitButton.textContent;
    const formData = new FormData(enquiryForm);
    const payload = Object.fromEntries(formData.entries());
    const submittedAt = new Date();
    const reference = `EBL-${submittedAt.getTime().toString(36).toUpperCase()}`;
    const customerName = String(payload.name || "New enquiry")
      .replace(/[\r\n]+/g, " ")
      .trim()
      .slice(0, 60);

    payload._subject = `Book a Call | ${customerName} | ${reference}`;
    payload.submission_reference = reference;
    payload.submitted_at = submittedAt.toISOString();

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    status.className = "form-status";
    status.textContent = "Sending your request securely...";

    try {
      const response = await fetch(enquiryForm.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Submission failed");
      }

      enquiryForm.reset();
      status.className = "form-status is-success";
      status.textContent = "Thank you. Your call request has been sent to EmbedLancer.";
    } catch (error) {
      status.className = "form-status is-error";
      status.innerHTML = "The request could not be sent. Please email <a href=\"mailto:contact.embedlancer@gmail.com\">contact.embedlancer@gmail.com</a>.";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalLabel;
    }
  });
}
