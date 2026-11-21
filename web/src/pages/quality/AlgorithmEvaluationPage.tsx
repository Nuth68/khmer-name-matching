import { useState } from "react";
import {
  Activity,
  ChevronDown,
  Clock3,
  Database,
  Gauge,
  Target,
  UploadCloud,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const datasets = [
  "Cambodian names — validated v3",
  "Civil registry — benchmark v2",
  "Romanisation pairs — reviewed v1",
];

const comparisonData = [
  { name: "K-ID Hybrid", precision: 96.4, recall: 93.8 },
  { name: "Phonetic", precision: 88.2, recall: 91.1 },
  { name: "Levenshtein", precision: 84.3, recall: 79.4 },
  { name: "Romanisation", precision: 91.2, recall: 86.3 },
];

const metrics = [
  { label: "Precision", value: "96.4%", delta: "+1.2%", icon: Target },
  { label: "Recall", value: "93.8%", delta: "+0.6%", icon: Activity },
  { label: "F1 score", value: "95.1%", delta: "+0.9%", icon: Gauge },
  { label: "Processing time", value: "42 ms", delta: "−8 ms", icon: Clock3 },
];

export default function AlgorithmEvaluationPage() {
  const [dataset, setDataset] = useState(datasets[0]);
  const [datasetOpen, setDatasetOpen] = useState(false);
  const [threshold, setThreshold] = useState(82);

  return (
    <div className="ae-page">
      <header className="ae-header">
        <div>
          <h1>Algorithm Evaluation</h1>
          <p>Compare matching performance on labelled identity datasets</p>
        </div>
        <div className="ae-header-actions">
          <button type="button" className="ae-button is-secondary">
            <UploadCloud size={16} />
            Upload dataset
          </button>
          <button type="button" className="ae-button is-primary">
            <Zap size={16} />
            Run evaluation
          </button>
        </div>
      </header>

      <section className="ae-card ae-setup-card">
        <div className="ae-card-heading">
          <div>
            <h2>Evaluation setup</h2>
            <p>Choose the benchmark data and decision threshold</p>
          </div>
        </div>

        <div className="ae-controls-grid">
          <div className="ae-field ae-dataset-field">
            <label>Dataset</label>
            <button
              type="button"
              className={`ae-select-trigger ${datasetOpen ? "is-open" : ""}`}
              onClick={() => setDatasetOpen((open) => !open)}
              aria-haspopup="listbox"
              aria-expanded={datasetOpen}
            >
              <span>
                <Database size={16} />
                {dataset}
              </span>
              <ChevronDown size={16} />
            </button>
            {datasetOpen && (
              <div className="ae-dataset-menu" role="listbox" aria-label="Evaluation dataset">
                {datasets.map((item) => (
                  <button
                    type="button"
                    role="option"
                    aria-selected={dataset === item}
                    className={dataset === item ? "is-selected" : ""}
                    key={item}
                    onClick={() => {
                      setDataset(item);
                      setDatasetOpen(false);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="ae-field">
            <div className="ae-field-label-row">
              <label htmlFor="evaluation-threshold">Similarity threshold</label>
              <strong>{threshold}%</strong>
            </div>
            <div className="ae-threshold-control">
              <input
                id="evaluation-threshold"
                type="range"
                min="50"
                max="100"
                value={threshold}
                onChange={(event) => setThreshold(Number(event.target.value))}
              />
              <div className="ae-threshold-scale" aria-hidden="true">
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div className="ae-field">
            <label>Test records</label>
            <div className="ae-record-count">
              <Database size={16} />
              <span>
                <strong>24,800</strong>
                <small>labelled pairs</small>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="ae-metrics" aria-label="Evaluation summary">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article className="ae-card ae-metric-card" key={metric.label}>
              <div>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.delta} vs baseline</small>
              </div>
              <span className="ae-metric-icon" aria-hidden="true">
                <Icon size={19} />
              </span>
            </article>
          );
        })}
      </section>

      <div className="ae-results-grid">
        <section className="ae-card ae-chart-card">
          <div className="ae-card-heading">
            <div>
              <h2>Algorithm comparison</h2>
              <p>Precision and recall by matching model</p>
            </div>
            <div className="ae-chart-legend" aria-label="Chart legend">
              <span><i className="is-precision" /> Precision</span>
              <span><i className="is-recall" /> Recall</span>
            </div>
          </div>
          <div className="ae-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 14, right: 4, left: -18, bottom: 4 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted)", fontSize: 10 }}
                />
                <YAxis
                  domain={[70, 100]}
                  ticks={[70, 80, 90, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted)", fontSize: 10 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`]}
                  cursor={{ fill: "var(--surface-subtle)" }}
                  contentStyle={{
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    background: "var(--surface)",
                    color: "var(--text)",
                    fontSize: 11,
                    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.1)",
                  }}
                />
                <Bar dataKey="precision" fill="var(--primary)" radius={[5, 5, 0, 0]} />
                <Bar dataKey="recall" fill="#9bd8c8" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="ae-card ae-matrix-card">
          <div className="ae-card-heading">
            <div>
              <h2>Confusion matrix</h2>
              <p>Results at a {threshold}% similarity threshold</p>
            </div>
          </div>
          <div className="ae-matrix">
            <span />
            <b>Predicted match</b>
            <b>Predicted no match</b>
            <b>Actual match</b>
            <div className="is-correct">
              <strong>11,634</strong>
              <span>True positive</span>
            </div>
            <div className="is-error">
              <strong>768</strong>
              <span>False negative</span>
            </div>
            <b>Actual no match</b>
            <div className="is-error">
              <strong>435</strong>
              <span>False positive</span>
            </div>
            <div className="is-correct">
              <strong>11,963</strong>
              <span>True negative</span>
            </div>
          </div>
          <div className="ae-matrix-note">
            <span>24,800 evaluated pairs</span>
            <strong>95.1% overall F1 score</strong>
          </div>
        </section>
      </div>
    </div>
  );
}
