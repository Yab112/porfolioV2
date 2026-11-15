"use client";

import { useState } from "react";
import { Loading, Btn, Notice, PageTitle, Pill, api, shortDate, timeAgo, useApi } from "../_lib";

type Job = {
  name: string;
  title: string;
  description: string;
  cron: string;
  enabled: boolean;
  last_status: string | null;
  last_run_at: string | null;
  next_run_at: string | null;
  last_error?: string | null;
};
type Status = {
  enabled: boolean;
  running: boolean;
  storage: string;
  jobs: Job[];
  recent_runs?: { job_name?: string; status?: string; trigger?: string; started_at?: string; error?: string | null }[];
};

export default function AdminAutomation() {
  const { data, error, loading, reload } = useApi<Status>("internal/scheduler/status");
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  async function act(job: string, action: "run" | "pause" | "resume") {
    setMsg(null);
    try {
      await api(`internal/scheduler/jobs/${job}/${action}`, { method: "POST", body: {} });
      setMsg({ kind: "ok", text: action === "run" ? `Started ${job}. Refresh in a minute to see the result.` : `${job} ${action === "pause" ? "paused" : "resumed"}.` });
      await reload();
    } catch (e) {
      setMsg({ kind: "error", text: e instanceof Error ? e.message : "Could not do that" });
    }
  }

  return (
    <main>
      <PageTitle title="Automation" sub="The jobs that find ideas, write posts, publish them and keep the site agent's knowledge fresh.">
        <Btn onClick={reload}>Refresh</Btn>
      </PageTitle>
      {error ? <Notice kind="error">{error}</Notice> : null}
      {msg ? <div className="mb-4"><Notice kind={msg.kind}>{msg.text}</Notice></div> : null}
      {loading && !data ? <Loading kind="cards" /> : null}
      {data ? (
        <div className="space-y-10">
          {!data.enabled || !data.running ? (
            <Notice kind="error">The scheduler is not running on the API host, so nothing below runs on its own. Jobs can still be started by hand.</Notice>
          ) : null}
          <ul className="grid gap-3 md:grid-cols-2">
            {data.jobs.map((j) => (
              <li key={j.name} className="border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{j.title}</div>
                    <div className="font-mono text-[11px] text-muted-foreground">
                      {j.name} · {j.cron}
                    </div>
                  </div>
                  <Pill>{j.enabled ? j.last_status ?? "never run" : "paused"}</Pill>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{j.description}</p>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
                  <div>
                    <dt className="text-muted-foreground">Last run</dt>
                    <dd>{j.last_run_at ? timeAgo(j.last_run_at) : "never"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Next run</dt>
                    <dd>{j.enabled ? (j.next_run_at ? shortDate(j.next_run_at) : "when content changes") : "paused"}</dd>
                  </div>
                </dl>
                {j.last_status === "failed" && j.last_error ? <p className="mt-2 break-words text-[12px] text-destructive">{j.last_error}</p> : null}
                <div className="mt-3 flex gap-2">
                  <Btn className="h-8" onClick={() => act(j.name, "run")}>
                    Run now
                  </Btn>
                  <Btn className="h-8" onClick={() => act(j.name, j.enabled ? "pause" : "resume")}>
                    {j.enabled ? "Pause" : "Resume"}
                  </Btn>
                </div>
              </li>
            ))}
          </ul>

          {data.recent_runs && data.recent_runs.length > 0 ? (
            <section>
              <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Recent runs</h2>
              <div className="overflow-x-auto border border-border">
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-muted/50 font-mono text-[11px] uppercase tracking-wide">
                    <tr>
                      <th className="px-3 py-2">Job</th>
                      <th className="px-3 py-2">Result</th>
                      <th className="px-3 py-2">Started</th>
                      <th className="px-3 py-2">Trigger</th>
                      <th className="px-3 py-2">Error</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {data.recent_runs.map((r, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 font-mono text-[12px]">{r.job_name}</td>
                        <td className="px-3 py-2">{r.status ? <Pill>{r.status}</Pill> : null}</td>
                        <td className="whitespace-nowrap px-3 py-2">{shortDate(r.started_at)}</td>
                        <td className="px-3 py-2">{r.trigger}</td>
                        <td className="max-w-[24rem] truncate px-3 py-2 text-muted-foreground" title={r.error ?? ""}>
                          {r.error}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </div>
      ) : null}
    </main>
  );
}
