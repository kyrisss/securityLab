import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  memo,
  MouseEvent,
} from "react";
import ReactDOM from "react-dom/client";

import "./styles.css";

type Mode = "add" | "remove";
type Item = { id: string; name: string };

const useRenderCounter = () => {
  const counter = useRef(0);
  counter.current++;

  return counter.current;
};

const RenderCountLabel = ({
  count,
  label,
}: {
  count: number;
  label: string;
}) => {
  return (
    <div>
      {label} render:
      <span style={{ color: "red" }}>{count}</span>
    </div>
  );
};

const AddButton = memo(
  ({ onClick, text }: { onClick: () => void; text: string }) => {
    const counter = useRenderCounter();
    return (
      <div className="button">
        <button onClick={onClick}>{text}</button>
        <RenderCountLabel label="Button" count={counter} />
      </div>
    );
  }
);

const ChangeModeButton = memo(
  ({ action, onClick }: { action: Mode; onClick: () => void }) => {
    const counter = useRenderCounter();
    return (
      <div>
        <button onClick={onClick}>change mode: {action}</button>
        <RenderCountLabel label="Button" count={counter} />
      </div>
    );
  }
);

const ListItem = ({
  item,
  onRemove,
  onClick,
}: {
  item: string;
  onRemove: (item: string) => void;
  onClick: (item: string) => void;
}) => {
  const handleClick = () => onClick(item);
  const handleRemoveItem = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onRemove(item);
  };
  return (
    <li onClick={handleClick} className="li-item">
      {item}
      <button className="btn-remove" onClick={handleRemoveItem}>
        x
      </button>
    </li>
  );
};

const List = () => {
  const counter = useRenderCounter();
  const [items, setItems] = useState<Item[]>([]);
  const [action, setAction] = useState<Mode>("add");

  const index = useRef(0);

  const handleChangeAction = useCallback(() => {
    setAction((prev) => (prev === "add" ? "remove" : "add"));
  }, []);

  const handlRemoveItems = () => {
    if (items.length === 0) {
      return;
    }
    setItems((prev) => prev.slice(0, prev.length - 1));
  };

  const handleRemoveItem = (name: string) => {
    setItems((prev) => prev.filter((item) => item.name !== name));
  };

  const handleAddItem = useCallback(() => {
    index.current++;
    setItems((prev) => [
      ...prev,
      { id: String(index.current * 100), name: `${index.current}-item` },
    ]);
  }, []);

  const handleAddToStart = useCallback(() => {
    index.current++;
    setItems((prev) => [
      { id: String(index.current * 100), name: `${index.current}-item` },
      ...prev,
    ]);
  }, []);

  useEffect(() => {
    const timer = setTimeout(
      () => (action === "add" ? handleAddItem() : handlRemoveItems()),
      1000
    );
    return () => clearTimeout(timer);
  });

  const onClickItem = (name: string) => {
    setItems((prev) => {
      return prev.map((item) => {
        if (item.name === name) {
          return { ...item, id: item.id + 1000 };
        }
        return item;
      });
    });
  };

  return (
    <ul className="list">
      <RenderCountLabel label="List" count={counter} />
      <br />
      <ChangeModeButton action={action} onClick={handleChangeAction} />
      <br />
      <div className="btn-actions">
        <AddButton onClick={handleAddToStart} text="Add to start" />
        <AddButton onClick={handleAddItem} text="Add to end" />
      </div>
      {items.map(({ id, name }) => (
        <ListItem
          key={id}
          item={name}
          onRemove={handleRemoveItem}
          onClick={onClickItem}
        />
      ))}
    </ul>
  );
};

function App() {
  return (
    <div>
      <List />
    </div>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;
