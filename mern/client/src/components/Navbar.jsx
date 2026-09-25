import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white">
            E
          </div>

          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900">
              EmployeeHub
            </h1>

            <p className="text-xs text-slate-500">
              Employee Records
            </p>
          </div>
        </NavLink>

        <NavLink
          to="/create"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          <span className="text-lg leading-none">+</span>
          Add Employee
        </NavLink>
      </div>
    </header>
  );
}