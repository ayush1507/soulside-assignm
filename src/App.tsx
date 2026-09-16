import { useEffect, useState } from "react";
import { fetchApi } from "./lib/api";
import type { Client } from "./lib/types";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; clients: Client[] };

export function App() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    getClients()
      .then((clients) => {
        if (!cancelled) setState({ status: "ready", clients });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            message: err instanceof Error ? err.message : String(err),
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto max-w-2xl p-10 font-sans">
      <h1 className="text-2xl font-semibold tracking-tight">Caseload triage</h1>

      {state.status === "loading" && (
        <p className="mt-3 text-slate-600">Loading roster…</p>
      )}

      {state.status === "error" && (
        <p className="mt-3 text-red-600">
          Could not load the roster: {state.message}
        </p>
      )}

      {state.status === "ready" && (
        <>
          <p className="mt-3 text-slate-600">
            {state.clients.length} clients on the roster.
          </p>
          <ul className="mt-6 space-y-1 text-sm text-slate-700">
            {state.clients.map((client) => (
              <li key={client.id}>{client.name}</li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}

interface ClientsResponse {
  clients: Client[];
}

async function getClients(): Promise<Client[]> {
  const data = await fetchApi<ClientsResponse>("/api/clients");
  return data.clients;
}
