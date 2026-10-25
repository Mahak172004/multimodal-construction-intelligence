const API_BASE = "http://localhost:8000/api/v1";

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error("Health check failed");
    return await res.json();
  } catch (err) {
    return { status: "offline", error: err.message };
  }
}

export async function inspectSafetyApi(file, notes) {
  const formData = new FormData();
  formData.append("file", file);
  if (notes) formData.append("notes", notes);

  const res = await fetch(`${API_BASE}/safety/inspect`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Safety inspection failed: ${errorText}`);
  }
  return await res.json();
}

export async function analyzeCrackApi(file, notes) {
  const formData = new FormData();
  formData.append("file", file);
  if (notes) formData.append("notes", notes);

  const res = await fetch(`${API_BASE}/crack/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Crack analysis failed: ${errorText}`);
  }
  return await res.json();
}

export async function calculateValuationApi(payload) {
  const res = await fetch(`${API_BASE}/valuation/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Valuation failed: ${errorText}`);
  }
  return await res.json();
}

export async function planProjectApi(payload) {
  const res = await fetch(`${API_BASE}/planner/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Project planning failed: ${errorText}`);
  }
  return await res.json();
}

export async function summarizeSiteLogApi(payload) {
  const res = await fetch(`${API_BASE}/site-log/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Site log summarization failed: ${errorText}`);
  }
  return await res.json();
}

export async function getWeatherAdvisoryApi(payload) {
  const res = await fetch(`${API_BASE}/weather/advisory`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Weather advisory failed: ${errorText}`);
  }
  return await res.json();
}

export async function chatAssistantApi(message, topic, chatHistory) {
  const res = await fetch(`${API_BASE}/assistant/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      topic,
      chat_history: chatHistory
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Assistant query failed: ${errorText}`);
  }
  return await res.json();
}
