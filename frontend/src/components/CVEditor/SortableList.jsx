import React, { useState } from 'react';

// Collapsible list of CV entries (experience, education, certificates):
// one item open at a time, drag-and-drop or arrow reordering, duplicate and delete.
export default function SortableList({
  items,
  onChange,
  newItem,           // () => fields of an empty entry (id is added here)
  getTitle,          // item => main line in the collapsed header
  getSubtitle,       // item => secondary line in the collapsed header
  renderFields,      // (item, update) => form fields of the open entry
  isEmpty,           // item => true when the entry has no content (skip delete confirm)
  labels,            // { add, untitled, empty, emptyIcon }
}) {
  const [openId, setOpenId] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const nextId = () => Math.max(0, ...items.map(i => i.id || 0)) + 1;

  const update = (index, field, value) => {
    onChange(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const add = () => {
    const id = nextId();
    onChange([...items, { id, ...newItem() }]);
    setOpenId(id);
  };

  const duplicate = (index) => {
    const id = nextId();
    const copy = { ...items[index], id };
    onChange([...items.slice(0, index + 1), copy, ...items.slice(index + 1)]);
    setOpenId(id);
  };

  const remove = (index) => {
    const item = items[index];
    const name = getTitle(item) || labels.untitled;
    if (!isEmpty(item) && !window.confirm(`¿Eliminar "${name}"?`)) return;
    onChange(items.filter((_, i) => i !== index));
  };

  const move = (from, to) => {
    if (to < 0 || to >= items.length || from === to) return;
    const arr = [...items];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    onChange(arr);
  };

  const endDrag = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <div>
      {items.length === 0 ? (
        <div className="ed-empty">
          <i className={`fa-solid ${labels.emptyIcon || 'fa-folder-open'}`} />
          {labels.empty}
        </div>
      ) : (
        <div className="ed-list">
          {items.map((item, index) => {
            const key = item.id ?? index;
            const open = openId === key;
            const title = getTitle(item);
            const subtitle = getSubtitle?.(item);
            const classes = [
              'ed-item',
              open && 'is-open',
              dragIndex === index && 'is-dragging',
              overIndex === index && dragIndex !== index && 'is-drop-target',
            ].filter(Boolean).join(' ');

            return (
              <div
                key={key}
                className={classes}
                onDragOver={e => { if (dragIndex !== null) { e.preventDefault(); setOverIndex(index); } }}
                onDrop={e => { e.preventDefault(); move(dragIndex, index); endDrag(); }}
              >
                <div className="ed-item-head">
                  <span
                    className="ed-drag"
                    draggable
                    onDragStart={e => { setDragIndex(index); e.dataTransfer.effectAllowed = 'move'; }}
                    onDragEnd={endDrag}
                    title="Arrastra para reordenar"
                  >
                    <i className="fa-solid fa-grip-vertical" />
                  </span>

                  <button
                    type="button"
                    className="ed-item-toggle"
                    onClick={() => setOpenId(open ? null : key)}
                    aria-expanded={open}
                  >
                    <span className="ed-item-num">{index + 1}</span>
                    <span className="ed-item-text">
                      <span className={`ed-item-title ${title ? '' : 'is-empty'}`} style={{ display: 'block' }}>
                        {title || labels.untitled}
                      </span>
                      {subtitle && <span className="ed-item-sub" style={{ display: 'block' }}>{subtitle}</span>}
                    </span>
                    <i className="fa-solid fa-chevron-down ed-item-chevron" />
                  </button>

                  <div className="ed-item-actions">
                    <button type="button" className="btn-icon" onClick={() => move(index, index - 1)} disabled={index === 0} title="Subir">
                      <i className="fa-solid fa-chevron-up" />
                    </button>
                    <button type="button" className="btn-icon" onClick={() => move(index, index + 1)} disabled={index === items.length - 1} title="Bajar">
                      <i className="fa-solid fa-chevron-down" />
                    </button>
                    <button type="button" className="btn-icon" onClick={() => duplicate(index)} title="Duplicar">
                      <i className="fa-regular fa-copy" />
                    </button>
                    <button type="button" className="btn-delete" onClick={() => remove(index)} title="Eliminar">
                      <i className="fa-solid fa-trash" />
                    </button>
                  </div>
                </div>

                {open && (
                  <div className="ed-item-body">
                    {renderFields(item, (field, value) => update(index, field, value))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button type="button" className="btn-outline ed-add-btn" onClick={add} style={{ marginTop: 12 }}>
        <i className="fa-solid fa-plus" /> {labels.add}
      </button>
    </div>
  );
}
