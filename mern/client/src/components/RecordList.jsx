import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
        styles[normalized] || "bg-slate-50 text-slate-600 ring-slate-500/20"
      }`}
    >
      {normalized}
    </span>
  );
}

function EmployeeRow({ record, deleteRecord }) {
  return (
    <tr className="border-b border-slate-100 transition hover:bg-slate-50/70 last:border-0">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
            {record.name?.charAt(0)?.toUpperCase() || "?"}
          </div>

          <div>
            <p className="font-semibold text-slate-900">
              {record.name}
            </p>

            <p className="text-xs text-slate-500">
              Employee record
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-slate-600">
        {record.position}
      </td>

      <td className="px-6 py-4">
        <LevelBadge level={record.level} />
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Link
            to={`/edit/${record._id}`}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Edit
          </Link>

          <button
            type="button"
            onClick={() => deleteRecord(record._id)}
            className="rounded-lg border border-red-100 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

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
          throw new Error(`Unable to load employees (${response.status})`);
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
      const response = await fetch(`/record/${id}`, {
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
      alert("Unable to delete the employee. Please try again.");
    }
  }

  const stats = useMemo(() => {
    return {
      total: records.length,
      interns: records.filter(
        (record) => displayLevel(record.level) === "Intern"
      ).length,
      juniors: records.filter(
        (record) => displayLevel(record.level) === "Junior"
      ).length,
      seniors: records.filter(
        (record) => displayLevel(record.level) === "Senior"
      ).length,
    };
  }, [records]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !query ||
        record.name?.toLowerCase().includes(query) ||
        record.position?.toLowerCase().includes(query);

      const matchesLevel =
        levelFilter === "All" ||
        displayLevel(record.level) === levelFilter;

      return matchesSearch && matchesLevel;
    });
  }, [records, search, levelFilter]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page heading */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            Employee Management
          </p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Employee Dashboard
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Manage employee records from one place.
          </p>
        </div>

        <Link
          to="/create"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          + Add Employee
        </Link>
      </div>

      {/* Stats */}
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

      {/* Main directory card */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Employee Directory
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {filteredRecords.length} employee
                {filteredRecords.length === 1 ? "" : "s"} displayed
              </p>
            </div>
          </div>

          <SearchBar
            search={search}
            setSearch={setSearch}
            levelFilter={levelFilter}
            setLevelFilter={setLevelFilter}
          />
        </div>

        {loading && (
          <div className="p-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

            <p className="mt-4 text-sm text-slate-500">
              Loading employees...
            </p>
          </div>
        )}

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

        {!loading && !error && filteredRecords.length === 0 && (
          <EmptyState
            filtered={records.length > 0}
          />
        )}

        {!loading && !error && filteredRecords.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Position</th>
                  <th className="px-6 py-4">Level</th>
                  <th className="px-6 py-4">Actions</th>
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
    </main>
  );
}