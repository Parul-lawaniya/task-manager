import React, { useEffect, useState } from "react";
import Button from "../Button/Button";

const EMPTY_FORM = {
  title: "",
  description: "",
};

const validators = {
  title: (value) => {
    if (!value.trim()) return "Title is required";
    return "";
  },
  description: (value) => {
    if (!value.trim()) return "Description is required";
    return "";
  },
};

export default function TaskForm({
  initialValues = EMPTY_FORM,
  mode = "create",
  onSubmit,
  onCancel,
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const validateField = (name, value) => {
    const validator = validators[name];
    if (!validator) return "";
    return validator(value);
  };

  const validateForm = () => {
    const nextErrors = {};

    Object.keys(validators).forEach((field) => {
      const error = validateField(field, values[field]);
      if (error) nextErrors[field] = error;
    });

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const error = validateField(name, value);

    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      setErrors((prev) => {
        const { [name]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
    };

    const succeeded = onSubmit ? onSubmit(payload) : false;

    if (succeeded && mode === "create") {
      setValues(EMPTY_FORM);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className={`form-control ${errors.title ? "has-error" : ""}`}>
        <label htmlFor="task-title">Title</label>
        <input
          id="task-title"
          name="title"
          type="text"
          placeholder="Task title"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          className="input-field"
          autoComplete="off"
        />
        {errors.title && <span className="input-error">{errors.title}</span>}
      </div>

      <div className={`form-control ${errors.description ? "has-error" : ""}`}>
        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          name="description"
          placeholder="Add a few details about the task"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          className="input-field textarea-field"
          rows={4}
        />
        {errors.description && (
          <span className="input-error">{errors.description}</span>
        )}
      </div>

      <div className="task-form__actions">
        {mode === "edit" && onCancel && (
          <button type="button" className="text-btn" onClick={onCancel}>
            Cancel
          </button>
        )}

        <Button
          text={mode === "edit" ? "Save" : "Add task"}
          type="primary"
        />
      </div>
    </form>
  );
}

