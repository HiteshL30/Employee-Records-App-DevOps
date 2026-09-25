import { Link } from "react-router-dom";

export default function EmptyState({ filtered }) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
        👥
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-900">
        {filtered ? "No employees found" : "No employees yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        {filtered
          ? "Try changing your search or level filter."
          : "Start building your employee directory by adding your first employee."}
      </p>

      {!filtered && (
        <Link
          to="/create"
          className="mt-6 inline-flex h-10 items-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Add your first employee
        </Link>
      )}
    </div>
  );
}
