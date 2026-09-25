import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Record() {
  const emptyForm = {
    name: "",
    email: "",
    position: "",
    level: "",
    department: "",
    employeeType: "",
    salary: "",
    joiningDate: "",
    endingDate: "",
    status: "",
    location: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [isNew, setIsNew] = useState(true);

  const params = useParams();
  const navigate = useNavigate();

  function normalizeLevel(level) {
    if (!level) return "";

    const normalized = level.toString().trim().toLowerCase();

    if (normalized === "intern") return "Intern";
    if (normalized === "junior") return "Junior";
    if (normalized === "senior") return "Senior";

    return level;
  }

  useEffect(() => {
    async function fetchData() {
      const id = params.id ? params.id.toString() : undefined;

      if (!id) return;

      setIsNew(false);

      const response = await fetch("/record/" + id);

      if (!response.ok) {
        const message =
          "An error has occurred: " + response.statusText;

        console.error(message);
        return;
      }

      const record = await response.json();

      if (!record) {
        console.warn("Record with id " + id + " not found");
        navigate("/");
        return;
      }

      setForm({
        ...emptyForm,
        ...record,
        level: normalizeLevel(record.level),
        endingDate: record.endingDate || "",
      });
    }

    fetchData();
  }, [params.id, navigate]);

  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();

    const person = {
      ...form,
      salary: form.salary === "" ? null : Number(form.salary),
      endingDate: form.endingDate || null,
    };

    try {
      let response;

      if (isNew) {
        response = await fetch("/record", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      } else {
        response = await fetch("/record/" + params.id, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      }

      if (!response.ok) {
        throw new Error(
          "HTTP error! status: " + response.status
        );
      }

      navigate("/");
    } catch (error) {
      console.error(
        "A problem occurred adding or updating a record: ",
        error
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white shadow-sm">
                E
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Employee Records
                </h1>

                <p className="text-sm text-slate-500">
                  Manage employee information
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            ← Back to Employees
          </button>
        </div>

        {/* Main Card */}
        <form
          onSubmit={onSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50"
        >

          {/* Form Header */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-7 text-white sm:px-8">
            <p className="text-sm font-medium text-slate-300">
              {isNew ? "NEW EMPLOYEE" : "EDIT EMPLOYEE"}
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              {isNew
                ? "Create Employee Record"
                : "Update Employee Record"}
            </h2>

            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Enter accurate employee information to keep your
              organization's records up to date.
            </p>
          </div>

          {/* Form Content */}
          <div className="space-y-10 p-6 sm:p-8">

            {/* PERSONAL INFORMATION */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                  01
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Personal Information
                  </h3>

                  <p className="text-xs text-slate-500">
                    Basic employee details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-slate-800"
                  >
                    Full Name
                  </label>

                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Priya Patil"
                    value={form.name}
                    onChange={(e) =>
                      updateForm({ name: e.target.value })
                    }
                    className="mt-2 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-slate-900 sm:text-sm"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-slate-800"
                  >
                    Email Address
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="priya@example.com"
                    value={form.email}
                    onChange={(e) =>
                      updateForm({ email: e.target.value })
                    }
                    className="mt-2 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-slate-900 sm:text-sm"
                  />
                </div>

                {/* Position */}
                <div>
                  <label
                    htmlFor="position"
                    className="block text-sm font-semibold text-slate-800"
                  >
                    Position
                  </label>

                  <input
                    type="text"
                    id="position"
                    name="position"
                    required
                    placeholder="Software Engineer"
                    value={form.position}
                    onChange={(e) =>
                      updateForm({ position: e.target.value })
                    }
                    className="mt-2 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-slate-900 sm:text-sm"
                  />
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-semibold text-slate-800"
                  >
                    Location
                  </label>

                  <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    placeholder="Pune"
                    value={form.location}
                    onChange={(e) =>
                      updateForm({ location: e.target.value })
                    }
                    className="mt-2 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-slate-900 sm:text-sm"
                  />
                </div>
              </div>
            </section>

            {/* EMPLOYMENT INFORMATION */}
            <section className="border-t border-slate-200 pt-10">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                  02
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Employment Information
                  </h3>

                  <p className="text-xs text-slate-500">
                    Role and employment classification
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Level */}
                <div className="md:col-span-2">
                  <fieldset>
                    <legend className="block text-sm font-semibold text-slate-800">
                      Level
                    </legend>

                    <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {["Intern", "Junior", "Senior"].map((level) => (
                        <label
                          key={level}
                          className={`flex cursor-pointer items-center justify-center rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                            form.level === level
                              ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                              : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="level"
                            value={level}
                            checked={form.level === level}
                            onChange={(e) =>
                              updateForm({
                                level: e.target.value,
                              })
                            }
                            required
                            className="sr-only"
                          />

                          {level}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>

                {/* Department */}
                <div>
                  <label
                    htmlFor="department"
                    className="block text-sm font-semibold text-slate-800"
                  >
                    Department
                  </label>

                  <select
                    id="department"
                    name="department"
                    required
                    value={form.department}
                    onChange={(e) =>
                      updateForm({
                        department: e.target.value,
                      })
                    }
                    className="mt-2 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-slate-900 sm:text-sm"
                  >
                    <option value="">
                      Select department
                    </option>
                    <option value="Engineering">
                      Engineering
                    </option>
                    <option value="DevOps">DevOps</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">
                      Marketing
                    </option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>

                {/* Employee Type */}
                <div>
                  <label
                    htmlFor="employeeType"
                    className="block text-sm font-semibold text-slate-800"
                  >
                    Employee Type
                  </label>

                  <select
                    id="employeeType"
                    name="employeeType"
                    required
                    value={form.employeeType}
                    onChange={(e) =>
                      updateForm({
                        employeeType: e.target.value,
                      })
                    }
                    className="mt-2 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-slate-900 sm:text-sm"
                  >
                    <option value="">
                      Select employee type
                    </option>
                    <option value="Full-time">
                      Full-time
                    </option>
                    <option value="Part-time">
                      Part-time
                    </option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>

                {/* Status */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="status"
                    className="block text-sm font-semibold text-slate-800"
                  >
                    Employment Status
                  </label>

                  <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      "Active",
                      "On Leave",
                      "Completed",
                      "Resigned",
                    ].map((status) => (
                      <label
                        key={status}
                        className={`cursor-pointer rounded-lg border px-3 py-3 text-center text-sm font-semibold transition ${
                          form.status === status
                            ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                            : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="status"
                          value={status}
                          checked={form.status === status}
                          onChange={(e) =>
                            updateForm({
                              status: e.target.value,
                            })
                          }
                          required
                          className="sr-only"
                        />

                        {status}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* COMPENSATION AND DATES */}
            <section className="border-t border-slate-200 pt-10">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                  03
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Compensation & Dates
                  </h3>

                  <p className="text-xs text-slate-500">
                    Salary and employment timeline
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                {/* Salary */}
                <div>
                  <label
                    htmlFor="salary"
                    className="block text-sm font-semibold text-slate-800"
                  >
                    Annual Salary / Stipend
                  </label>

                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
                      ₹
                    </span>

                    <input
                      type="number"
                      id="salary"
                      name="salary"
                      min="0"
                      required
                      placeholder="650000"
                      value={form.salary}
                      onChange={(e) =>
                        updateForm({
                          salary:
                            e.target.value === ""
                              ? ""
                              : Number(e.target.value),
                        })
                      }
                      className="block w-full rounded-lg border-0 bg-slate-50 py-2.5 pl-8 pr-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-slate-900 sm:text-sm"
                    />
                  </div>

                  <p className="mt-1.5 text-xs text-slate-500">
                    Enter annual salary or stipend.
                  </p>
                </div>

                {/* Joining Date */}
                <div>
                  <label
                    htmlFor="joiningDate"
                    className="block text-sm font-semibold text-slate-800"
                  >
                    Joining Date
                  </label>

                  <input
                    type="date"
                    id="joiningDate"
                    name="joiningDate"
                    required
                    value={form.joiningDate}
                    onChange={(e) =>
                      updateForm({
                        joiningDate: e.target.value,
                      })
                    }
                    className="mt-2 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-slate-900 sm:text-sm"
                  />
                </div>

                {/* Ending Date */}
                <div>
                  <label
                    htmlFor="endingDate"
                    className="block text-sm font-semibold text-slate-800"
                  >
                    Ending Date
                  </label>

                  <input
                    type="date"
                    id="endingDate"
                    name="endingDate"
                    value={form.endingDate}
                    onChange={(e) =>
                      updateForm({
                        endingDate: e.target.value,
                      })
                    }
                    className="mt-2 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-slate-900 sm:text-sm"
                  />

                  <p className="mt-1.5 text-xs text-slate-500">
                    Leave empty for active employees.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              {isNew
                ? "Save Employee Record"
                : "Update Employee Record"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          EmployeeHub · Employee Records Management
        </p>
      </div>
    </main>
  );
}