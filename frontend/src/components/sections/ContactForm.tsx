"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { contact, contactSubjects } from "@/data/content";
import { cn } from "@/lib/utils";

interface FormValues {
  name: string;
  email: string;
  organisation: string;
  subject: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  name: "",
  email: "",
  organisation: "",
  subject: contactSubjects[0],
  message: "",
};

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Please enter your name.";
  }

  if (!values.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.message.trim()) {
    errors.message = "Please tell us how we can help.";
  } else if (values.message.trim().length < 20) {
    errors.message =
      "Please give us a little more detail (20 characters or more).";
  }

  return errors;
}

/**
 * Contact form.
 *
 * There is no backend yet. Rather than silently discarding the message, a
 * valid submission opens the visitor's mail client with the fields already
 * composed, and the UI confirms what happened - so the enquiry genuinely
 * reaches CyberGreen in the meantime.
 */
export function ContactForm() {
  const fieldId = useId();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const update =
    (field: keyof FormValues) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
      // Clear a field's error as soon as the visitor starts correcting it.
      setErrors((current) => ({ ...current, [field]: undefined }));
    };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    // TODO: replace with POST to Django backend once available
    // (`${process.env.NEXT_PUBLIC_API_URL}/contact/`). Until then the message
    // is handed to the visitor's mail client so nothing is lost.
    const body = [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      values.organisation ? `Organisation: ${values.organisation}` : null,
      "",
      values.message,
    ]
      .filter((line) => line !== null)
      .join("\n");

    const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(
      `${values.subject} - website enquiry`,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setSubmitted(true);
  }

  const inputClass =
    "w-full rounded-card border bg-white px-4 py-3 text-sm text-ink transition-colors placeholder:text-ink-600/60 focus:border-signal";

  const errorClass = "mt-1.5 text-sm text-hazard";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`${fieldId}-name`}
            className="text-canopy block text-sm font-medium"
          >
            Name
          </label>
          <input
            id={`${fieldId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={update("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${fieldId}-name-error` : undefined}
            className={cn(
              inputClass,
              "mt-2",
              errors.name ? "border-hazard" : "border-surface-200",
            )}
          />
          {errors.name ? (
            <p id={`${fieldId}-name-error`} className={errorClass}>
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor={`${fieldId}-email`}
            className="text-canopy block text-sm font-medium"
          >
            Email
          </label>
          <input
            id={`${fieldId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={update("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email ? `${fieldId}-email-error` : undefined
            }
            className={cn(
              inputClass,
              "mt-2",
              errors.email ? "border-hazard" : "border-surface-200",
            )}
          />
          {errors.email ? (
            <p id={`${fieldId}-email-error`} className={errorClass}>
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`${fieldId}-organisation`}
            className="text-canopy block text-sm font-medium"
          >
            Organisation{" "}
            <span className="text-ink-600 font-normal">(optional)</span>
          </label>
          <input
            id={`${fieldId}-organisation`}
            name="organisation"
            type="text"
            autoComplete="organization"
            value={values.organisation}
            onChange={update("organisation")}
            className={cn(inputClass, "border-surface-200 mt-2")}
          />
        </div>

        <div>
          <label
            htmlFor={`${fieldId}-subject`}
            className="text-canopy block text-sm font-medium"
          >
            Reason for contact
          </label>
          <select
            id={`${fieldId}-subject`}
            name="subject"
            value={values.subject}
            onChange={update("subject")}
            className={cn(inputClass, "border-surface-200 mt-2")}
          >
            {contactSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor={`${fieldId}-message`}
          className="text-canopy block text-sm font-medium"
        >
          Message
        </label>
        <textarea
          id={`${fieldId}-message`}
          name="message"
          rows={6}
          value={values.message}
          onChange={update("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message ? `${fieldId}-message-error` : undefined
          }
          className={cn(
            inputClass,
            "mt-2 resize-y",
            errors.message ? "border-hazard" : "border-surface-200",
          )}
        />
        {errors.message ? (
          <p id={`${fieldId}-message-error`} className={errorClass}>
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit">Send message</Button>

        {/* Announced to assistive tech when the state flips. */}
        <p role="status" aria-live="polite" className="text-ink-600 text-sm">
          {submitted
            ? `Thank you - your email client should now be open with this message ready to send to ${contact.email}.`
            : ""}
        </p>
      </div>
    </form>
  );
}
