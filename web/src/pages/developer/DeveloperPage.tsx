import { useState } from "react";
import { BookOpen, CheckCircle2, Code2, Copy, KeyRound, Trash2, X } from "lucide-react";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import PageHeader from "../../components/common/PageHeader";
import OperationalPage from "../operational/OperationalPage";

export default function DeveloperPage({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  if (title === "API Playground")
    return (
      <>
        <PageHeader
          title="API Playground"
          description="Test K-ID endpoints with sandbox identity data"
        >
          <Badge tone="blue">Sandbox</Badge>
        </PageHeader>
        <div className="api-playground">
          <section className="card request-editor">
            <div className="endpoint-line">
              <Badge tone="success">POST</Badge>
              <input value="/v1/names/compare" readOnly />
              <Button>Send request</Button>
            </div>
            <div className="code-tabs">
              <button className="active">Body</button>
              <button>Headers</button>
              <button>Authorization</button>
            </div>
            <pre>{`{\n  \"name_a\": \"សុខ ដារ៉ា\",\n  \"name_b\": \"Sok Dara\",\n  \"options\": {\n    \"romanisation\": true,\n    \"phonetic\": true\n  }\n}`}</pre>
          </section>
          <section className="card response-view">
            <div className="response-head">
              <span>Response</span>
              <Badge tone="success">200 OK · 84 ms</Badge>
            </div>
            <pre>{`{\n  \"similarity\": 0.96,\n  \"classification\": \"strong_match\",\n  \"romanisation_score\": 0.98,\n  \"phonetic_score\": 0.96\n}`}</pre>
          </section>
        </div>
      </>
    );
  return (
    <>
      <PageHeader
        title={title}
        description={
          title === "API Keys"
            ? "Manage credentials used to access the K-ID API"
            : title === "Request Logs"
              ? "Inspect API requests, latency and response status"
              : "Integrate Khmer identity intelligence into your applications"
        }
      >
        <Button>
          {title === "API Keys" ? (
            <>
              <KeyRound size={16} /> Create API key
            </>
          ) : (
            <>
              <BookOpen size={16} /> Quick start
            </>
          )}
        </Button>
      </PageHeader>
      {title === "API Keys" ? (
        <section className="card api-key-card">
          <div className="card-head">
            <div>
              <h2>Production keys</h2>
              <p>Keys are hidden after creation. Store them securely.</p>
            </div>
            <Badge tone="success">2 active</Badge>
          </div>
          {[
            ["Production server", "kid_live_••••••••••••8F2A", "Last used 4 minutes ago"],
            ["Data import service", "kid_live_••••••••••••71CD", "Last used 2 days ago"],
          ].map((key) => (
            <div className="api-key-row" key={key[0]}>
              <KeyRound size={18} />
              <div>
                <strong>{key[0]}</strong>
                <code>{key[1]}</code>
                <span>{key[2]}</span>
              </div>
              <Badge tone="success">Active</Badge>
              <button onClick={() => setCopied(true)}>
                <Copy size={16} />
              </button>
              <button>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </section>
      ) : (
        <OperationalPage title={title} />
      )}
      {copied && (
        <button className="toast-message" onClick={() => setCopied(false)}>
          <CheckCircle2 size={17} />
          <span>
            <strong>Key identifier copied</strong>The secret remains protected.
          </span>
          <X size={15} />
        </button>
      )}
    </>
  );
}

