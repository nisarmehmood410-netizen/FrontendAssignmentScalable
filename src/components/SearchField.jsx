import { Search } from "lucide-react";

function SearchField({ value, onChange }) {
  return (
    <div className="toolbar-panel-inner">
      <label className="field">
        <span className="field-label">Search</span>
        <span className="input-affix">
          <span className="input-affix-icon" aria-hidden>
            <Search size={18} strokeWidth={2} />
          </span>
          <input
            className="field-input"
            placeholder="Try a caption, title, tag, or place name"
            value={value}
            autoComplete="off"
            spellCheck={false}
            onChange={(event) => onChange(event.target.value)}
          />
        </span>
      </label>
    </div>
  );
}

export default SearchField;
