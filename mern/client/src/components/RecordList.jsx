import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import StatCard from "./StatCard";
import SearchBar from "./SearchBar";
import EmptyState from "./EmptyState";

function displayLevel(level) {
  if (!level) return "Unknown";

  const normalized = level.toString().trim().toLowerCase();

  if (normalized === "intern") return "Intern";
  if (normalized === "junior") return "Junior";
  if (normalized === "senior") return "Senior";

  return level;
}

function LevelBadge({ level }) {
  const normalized = displayLevel(level);

  const styles = {
    Intern: "bg-blue-50 text-blue-700 ring-blue-600/20",
    Junior: "bg-amber-50 text-amber-700 ring-amber-600/20",
    Senior: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  };

  const badgeStyle =
    styles[normalized] ||
    "bg-slate-50 text-slate-600 ring-slate-500/20";

  return (
    <span
      className={
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset " +
        badgeStyle
      }
    >
      {normalized}
    </span>
  );
}

LevelBadge.propTypes = {
  level: PropTypes.string,
};

function StatusBadge({ status }) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    "On Leave": "bg-amber-50 text-amber-700 ring-amber-600/20",
    Completed: "bg-blue-50 text-blue-700 ring-blue-600/20",
    Resigned: "bg-red-50 text-red-700 ring-red-600/20",
  };

  const badgeStyle =
    styles[status] ||
    "bg-slate-50 text-slate-600 ring-slate-500/20";

  return (
    <span
      className={
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset " +
        badgeStyle
      }
    >
      {status || "Unknown"}
    </span>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.string,
};

function formatSalary(salary) {
  if (salary === null || salary === undefined || salary === "") {
    return "—";
  }

  return "₹" + Number(salary).toLocaleString("en-IN");
}

function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(date + "T00:00:00");

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function EmployeeRow({ record, deleteRecord }) {
  return (
    <tr className="border-b border-slate-100 transition hover:bg-slate-50/80 last:border-0">
      {/* Employee */}
      <td className="whitespace-nowrap px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm">
            {record.name?.charAt(0)?.toUpperCase() || "?"}
          </div>

          <div>
            <p className="font-semibold text-slate-900">
              {record.name || "Unnamed Employee"}
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              {record.email || "No email"}
            </p>
          </div>
        </div>
      </td>

      {/* Position */}
      <td className="whitespace-nowrap px-6 py-5">
        <p className="text-sm font-semibold text-slate-700">
          {record.position || "—"}
        </p>

        <div className="mt-1.5">
          <LevelBadge level={record.level} />
        </div>
      </td>

      {/* Department */}
      <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-600">
        {record.department || "—"}
      </td>

      {/* Employee Type */}
      <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-600">
        {record.employeeType || "—"}
      </td>

      {/* Salary */}
      <td className="whitespace-nowrap px-6 py-5 text-sm font-semibold text-slate-700">
        {formatSalary(record.salary)}
      </td>

      {/* Joining Date */}
      <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-600">
        {formatDate(record.joiningDate)}
      </td>

      {/* Status */}
      <td className="whitespace-nowrap px-6 py-5">
        <StatusBadge status={record.status} />
      </td>

      {/* Actions */}
      <td className="whitespace-nowrap px-6 py-5">
        <div className="flex items-center gap-2">
          <Link
            to={"/edit/" + record._id}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            Edit
          </Link>

          <button
            type="button"
            onClick={() => deleteRecord(record._id)}
            className="rounded-lg border border-red-100 bg-white px-3 py-2 text-xs font-semibold text-red-600 shadow-sm transition hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
EmployeeRow.propTypes = {
  record: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    position: PropTypes.string,
    level: PropTypes.string,
    department: PropTypes.string,
    employeeType: PropTypes.string,
    salary: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    joiningDate: PropTypes.string,
    endingDate: PropTypes.string,
    status: PropTypes.string,
    location: PropTypes.string,
  }).isRequired,

  deleteRecord: PropTypes.func.isRequired,
};
export default function RecordList() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getRecords() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/record/");

        if (!response.ok) {
          throw new Error(
            "Unable to load employees (" + response.status + ")"
          );
        }

        const data = await response.json();
        setRecords(data);
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load employee records. Please check the backend connection."
        );
      } finally {
        setLoading(false);
      }
    }

    getRecords();
  }, []);

  async function deleteRecord(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch("/record/" + id, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete request failed");
      }

      setRecords((current) =>
        current.filter((employee) => employee._id !== id)
      );
    } catch (err) {
      console.error(err);

      alert(
        "Unable to delete the employee. Please try again."
      );
    }
  }

  const stats = useMemo(() => {
    return {
      total: records.length,

      interns: records.filter(
        (record) =>
          displayLevel(record.level) === "Intern"
      ).length,

      juniors: records.filter(
        (record) =>
          displayLevel(record.level) === "Junior"
      ).length,

      seniors: records.filter(
        (record) =>
          displayLevel(record.level) === "Senior"
      ).length,
    };
  }, [records]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !query ||
        record.name?.toLowerCase().includes(query) ||
        record.position?.toLowerCase().includes(query) ||
        record.department?.toLowerCase().includes(query) ||
        record.employeeType?.toLowerCase().includes(query) ||
        record.location?.toLowerCase().includes(query);

      const matchesLevel =
        levelFilter === "All" ||
        displayLevel(record.level) === levelFilter;

      return matchesSearch && matchesLevel;
    });
  }, [records, search, levelFilter]);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white shadow-sm">
              E
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Employee Management
              </p>

              <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Employee Dashboard
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage employee records from one place.
              </p>
            </div>
          </div>

          <Link
            to="/create"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            + Add Employee
          </Link>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Employees"
            value={stats.total}
            description="All employee records"
            icon="👥"
          />

          <StatCard
            title="Interns"
            value={stats.interns}
            description="Early-career employees"
            icon="🎓"
          />

          <StatCard
            title="Junior"
            value={stats.juniors}
            description="Junior-level employees"
            icon="💼"
          />

          <StatCard
            title="Senior"
            value={stats.seniors}
            description="Senior-level employees"
            icon="⭐"
          />
        </div>

        {/* Employee Directory */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">

          {/* Directory Header */}
          <div className="border-b border-slate-200 bg-white p-5 sm:p-6">
            <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Employee Directory
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage employee information.
                </p>
              </div>

              {!loading && !error && (
                <div className="text-sm font-medium text-slate-500">
                  {filteredRecords.length} employee
                  {filteredRecords.length === 1 ? "" : "s"} displayed
                </div>
              )}
            </div>

            <SearchBar
              search={search}
              setSearch={setSearch}
              levelFilter={levelFilter}
              setLevelFilter={setLevelFilter}
            />
          </div>

          {/* Loading */}
          {loading && (
            <div className="p-12 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

              <p className="mt-4 text-sm text-slate-500">
                Loading employees...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-5">
              <p className="font-semibold text-red-800">
                Unable to load employees
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* Empty State */}
          {!loading &&
            !error &&
            filteredRecords.length === 0 && (
              <EmptyState
                filtered={records.length > 0}
              />
            )}

          {/* Employee Table */}
          {!loading &&
            !error &&
            filteredRecords.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th className="px-6 py-4">
                        Employee
                      </th>

                      <th className="px-6 py-4">
                        Position
                      </th>

                      <th className="px-6 py-4">
                        Department
                      </th>

                      <th className="px-6 py-4">
                        Type
                      </th>

                      <th className="px-6 py-4">
                        Salary
                      </th>

                      <th className="px-6 py-4">
                        Joining Date
                      </th>

                      <th className="px-6 py-4">
                        Status
                      </th>

                      <th className="px-6 py-4">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRecords.map((record) => (
                      <EmployeeRow
                        key={record._id}
                        record={record}
                        deleteRecord={deleteRecord}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </section>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-500">
          EmployeeHub · Employee Records Management
        </p>
      </div>
    </main>
  );
}