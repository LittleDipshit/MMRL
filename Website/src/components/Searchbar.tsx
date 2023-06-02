import { SearchRounded } from "@mui/icons-material";
import { Button, SearchInput } from "react-onsenui";

interface SearchbarProps {
  placeholder: string;
  onInputChange: (e: Event) => void;
  onButtonClick: () => void;
}

const Searchbar = ({ placeholder, onInputChange, onButtonClick }: SearchbarProps) => {
  return (
    <div
      style={{
        textAlign: "center",
        display: "inline-flex",
        justifyContent: "center",
        padding: "8px 8px 4px",
        width: "100%",
      }}
    >
      <SearchInput
        placeholder={placeholder}
        style={{
          borderRadius: "8px",
          width: "100%",
          marginRight: "4px",
        }}
        onChange={onInputChange}
      />
      <Button
        onClick={onButtonClick}
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          marginLeft: "4px",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SearchRounded sx={{ color: "white" }} />
        </div>
      </Button>
    </div>
  );
};

export { Searchbar };
