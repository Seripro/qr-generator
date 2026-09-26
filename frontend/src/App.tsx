import { useState } from "react";

const API_URL = "http://localhost:3000";

function App() {
  const [text, setText] = useState("");
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  const generateQr = async () => {
    setError("");
    setSvg("");

    try {
      const response = await fetch(`${API_URL}/qr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "QRコードの生成に失敗しました");
        return;
      }

      setSvg(data.svg);
    } catch {
      setError("APIに接続できませんでした");
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <h1>QR Code Generator</h1>

      <input
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="QRコードにしたい文字列"
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={generateQr}
        disabled={!text}
        style={{
          marginTop: "16px",
          padding: "10px 20px",
          fontSize: "16px",
        }}
      >
        Generate QR
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {svg && (
        <div
          style={{
            marginTop: "30px",
          }}
          dangerouslySetInnerHTML={{
            __html: svg,
          }}
        />
      )}
    </div>
  );
}

export default App;
