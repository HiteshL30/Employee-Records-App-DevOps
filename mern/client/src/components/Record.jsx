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
    <>
      <h3 className="text-lg font-semibold p-4">
        Create/Update Employee Record
      </h3>

      <form
        onSubmit={onSubmit}
        className="border rounded-lg overflow-hidden p-4"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">

          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">
              Employee Info
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Enter employee information including role, employment
              type, salary, dates and current status.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8">

            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Name
              </label>

              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  placeholder="First Last"
                  value={form.name}
                  onChange={(e) =>
                    updateForm({ name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Email
              </label>

              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  placeholder="employee@example.com"
                  value={form.email}
                  onChange={(e) =>
                    updateForm({ email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="position"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Position
              </label>

              <div className="mt-2">
                <input
                  type="text"
                  name="position"
                  id="position"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  placeholder="Software Engineer"
                  value={form.position}
                  onChange={(e) =>
                    updateForm({ position: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <fieldset>
                <legend className="block text-sm font-medium leading-6 text-slate-900">
                  Level
                </legend>

                <div className="mt-3 flex items-center gap-6">
                  {["Intern", "Junior", "Senior"].map((level) => (
                    <label
                      key={level}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="level"
                        value={level}
                        checked={form.level === level}
                        onChange={(e) =>
                          updateForm({ level: e.target.value })
                        }
                        required
                        className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600"
                      />

                      <span className="ml-2 text-sm font-medium text-slate-900">
                        {level}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Department
              </label>

              <div className="mt-2">
                <select
                  id="department"
                  name="department"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  value={form.department}
                  onChange={(e) =>
                    updateForm({ department: e.target.value })
                  }
                >
                  <option value="">Select department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="DevOps">DevOps</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="employeeType"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Employee Type
              </label>

              <div className="mt-2">
                <select
                  id="employeeType"
                  name="employeeType"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  value={form.employeeType}
                  onChange={(e) =>
                    updateForm({ employeeType: e.target.value })
                  }
                >
                  <option value="">Select employee type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="salary"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Annual Salary / Stipend
              </label>

              <div className="mt-2">
                <input
                  type="number"
                  name="salary"
                  id="salary"
                  min="0"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
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
                />
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Enter annual salary for employees or stipend for interns.
              </p>
            </div>

            <div>
              <label
                htmlFor="joiningDate"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Joining Date
              </label>

              <div className="mt-2">
                <input
                  type="date"
                  name="joiningDate"
                  id="joiningDate"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  value={form.joiningDate}
                  onChange={(e) =>
                    updateForm({ joiningDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="endingDate"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Ending Date
              </label>

              <div className="mt-2">
                <input
                  type="date"
                  name="endingDate"
                  id="endingDate"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  value={form.endingDate}
                  onChange={(e) =>
                    updateForm({ endingDate: e.target.value })
                  }
                />
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Leave empty if the employee is currently active.
              </p>
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Status
              </label>

              <div className="mt-2">
                <select
                  id="status"
                  name="status"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  value={form.status}
                  onChange={(e) =>
                    updateForm({ status: e.target.value })
                  }
                >
                  <option value="">Select status</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Completed">Completed</option>
                  <option value="Resigned">Resigned</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Location
              </label>

              <div className="mt-2">
                <input
                  type="text"
                  name="location"
                  id="location"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  placeholder="Pune"
                  value={form.location}
                  onChange={(e) =>
                    updateForm({ location: e.target.value })
                  }
                />
              </div>
            </div>

          </div>
        </div>

        <input
          type="submit"
          value="Save Employee Record"
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
        />
      </form>
    </>
  );
}