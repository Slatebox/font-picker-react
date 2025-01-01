import {
  Category,
  Font,
  FONT_FAMILY_DEFAULT,
  FontManager,
  OPTIONS_DEFAULTS,
  Script,
  SortOption,
  Variant,
} from "@slatebox/font-manager";
// import "@slatebox/font-manager/src/picker-styles/styles.scss";
import "@slatebox/font-manager/dist/styles.css";
import React, { useEffect, useState, useCallback } from "react";

type LoadingStatus = "loading" | "finished" | "error";

interface Props {
  apiKey: string;
  activeFontFamily?: string;
  onChange?: (font: Font) 
	=> void;
  pickerId?: string;
  families?: string[];
  categories?: Category[];
  scripts?: Script[];
  variants?: Variant[];
  filter?: (font: Font) => boolean;
  limit?: number;
  sort?: SortOption;
}

const getFontId = (fontFamily: string): string => fontFamily.replace(/\s+/g, "-").toLowerCase();

const FontPicker: React.FC<Props> = ({
  apiKey,
  activeFontFamily = FONT_FAMILY_DEFAULT,
  onChange = () => {},
  pickerId = OPTIONS_DEFAULTS.pickerId,
  families = OPTIONS_DEFAULTS.families,
  categories = OPTIONS_DEFAULTS.categories,
  scripts = OPTIONS_DEFAULTS.scripts,
  variants = OPTIONS_DEFAULTS.variants,
  filter = OPTIONS_DEFAULTS.filter,
  limit = OPTIONS_DEFAULTS.limit,
  sort = OPTIONS_DEFAULTS.sort,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("loading");
  const [fontManager] = useState(() => new FontManager(apiKey, activeFontFamily, {
    pickerId,
    families,
    categories,
    scripts,
    variants,
    filter,
    limit,
    sort,
  }, onChange));

  useEffect(() => {
    const initFonts = async () => {
      try {
        await fontManager.init();
        setLoadingStatus("finished");
      } catch (err) {
        console.error("Error trying to fetch the list of available fonts", err);
        setLoadingStatus("error");
      }
    };

    initFonts();
  }, [fontManager]);

  useEffect(() => {
    fontManager.setActiveFont(activeFontFamily);
  }, [activeFontFamily, fontManager]);

  useEffect(() => {
    fontManager.setOnChange(onChange);
  }, [onChange, fontManager]);

  const onClose = useCallback((e: MouseEvent) => {
    let targetEl = e.target as Node;
    const fontPickerEl = document.getElementById(`font-picker${fontManager.selectorSuffix}`);

    while (true) {
      if (targetEl === fontPickerEl) {
        return;
      }
      if (targetEl.parentNode) {
        targetEl = targetEl.parentNode;
      } else {
        setExpanded(false);
        document.removeEventListener("click", onClose);
        return;
      }
    }
  }, [fontManager.selectorSuffix]);

  const toggleExpanded = useCallback(() => {
    setExpanded(prev => !prev);
    if (!expanded) {
      document.addEventListener("click", onClose);
    } else {
      document.removeEventListener("click", onClose);
    }
  }, [expanded, onClose]);

  const onSelectionClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    const activeFontFamily = target.textContent;
    if (!activeFontFamily) {
      throw Error(`Missing font family in clicked font button`);
    }
    fontManager.setActiveFont(activeFontFamily);
    setExpanded(false);
  }, [fontManager]);

  const onSelectionKeyPress = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      const target = e.target as HTMLButtonElement;
      const activeFontFamily = target.textContent;
      if (!activeFontFamily) {
        throw Error(`Missing font family in clicked font button`);
      }
      fontManager.setActiveFont(activeFontFamily);
      setExpanded(false);
    }
  }, [fontManager]);

  const generateFontList = useCallback((fonts: Font[]): React.ReactElement => {
    if (loadingStatus !== "finished") {
      return <div />;
    }
    return (
      <ul className="font-list">
        {fonts.map((font) => {
          const isActive = font.family === activeFontFamily;
          const fontId = getFontId(font.family);
          return (
            <li key={fontId} className="font-list-item">
              <button
                type="button"
                id={`font-button-${fontId}${fontManager.selectorSuffix}`}
                className={`font-button ${isActive ? "active-font" : ""}`}
                onClick={onSelectionClick}
                onKeyPress={onSelectionKeyPress}
              >
                {font.family}
              </button>
            </li>
          );
        })}
      </ul>
    );
  }, [activeFontFamily, loadingStatus, fontManager.selectorSuffix, onSelectionClick, onSelectionKeyPress]);

  const fonts = Array.from(fontManager.getFonts().values());
  if (sort === "alphabet") {
    fonts.sort((font1, font2) => font1.family.localeCompare(font2.family));
  }

  return (
    <div id={`font-picker${fontManager.selectorSuffix}`} className={expanded ? "expanded" : ""}>
      <button
        type="button"
        className="dropdown-button"
        onClick={toggleExpanded}
        onKeyPress={toggleExpanded}
      >
        <p className="dropdown-font-family">{activeFontFamily}</p>
        <p className={`dropdown-icon ${loadingStatus}`} />
      </button>
      {loadingStatus === "finished" && generateFontList(fonts)}
    </div>
  );
};

export default FontPicker;
