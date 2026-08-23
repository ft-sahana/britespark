// storage.js
// Save/resume for the HSP-1 rebuild.
// All data lives in localStorage under one key, keyed by page + field name.

const STORAGE_KEY = "hsp1_application";

// Read the whole saved application (or an empty object if nothing saved yet)
function loadApplication() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

// Save one field's value under its page
function saveField(pageId, fieldName, value) {
  const data = loadApplication();
  if (!data[pageId]) data[pageId] = {};
  data[pageId][fieldName] = value;
  data.lastSaved = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Get all saved values for one page (used to refill fields on load)
function loadPage(pageId) {
  const data = loadApplication();
  return data[pageId] || {};
}

// Wipe everything (e.g. after final submission, or a "start over" action)
function clearAll() {
  localStorage.removeItem(STORAGE_KEY);
}

// Wire every input/select/textarea inside a given root element to
// auto-save on change and refill from saved data. autoSavePage (below)
// calls this once for the whole document at page load; anything added
// to the DOM later (e.g. a new person card added by "Add another
// person") must call this again, scoped to just the new element, or
// its fields will silently never save.
function wireFieldsIn(root, pageId) {
  const saved = loadPage(pageId);

  root.querySelectorAll("input, select, textarea").forEach((el) => {
    if (!el.name) return;

    // Refill from saved data
    if (saved[el.name] !== undefined) {
      if (el.type === "radio" || el.type === "checkbox") {
        el.checked = el.value === saved[el.name];
      } else {
        el.value = saved[el.name];
      }
    }

    // Save on every change
    el.addEventListener("input", () => {
      saveField(pageId, el.name, el.value);
    });
  });
}

// Wire every input/select/textarea currently on the page. Call this
// once, on page load, passing the page's id (e.g. "page-1"). For
// content added dynamically after this runs, call wireFieldsIn()
// directly on the new element instead.
function autoSavePage(pageId) {
  wireFieldsIn(document, pageId);
}