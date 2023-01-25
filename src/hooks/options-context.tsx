import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import z from "zod";

const OPTIONS_STORE = "MEDIA_SERVER_OPTIONS";

const optionsSchema = z.object({
  darkMode: z.enum(["light", "dark", "system"]),
  watchedVideos: z.array(z.string()),
  volume: z.number(),
});

export type Options = z.infer<typeof optionsSchema>;

export const defaultOptions: Readonly<Options> = Object.freeze({
  darkMode: "system",
  watchedVideos: [],
  volume: 0.5,
});

const toggleDarkMode = (darkMode: Options["darkMode"]) => {
  if (
    darkMode === "dark" ||
    (darkMode === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

const OptionsContext = createContext<{
  options: Options;
  setOptions: (newPartialOptions: Partial<Options>) => void;
}>({
  options: defaultOptions,
  setOptions: () => {},
});

const OptionsContextProvider = ({ children }: { children: ReactNode }) => {
  const savedOptionsString = localStorage.getItem(OPTIONS_STORE);
  let savedOptions: Partial<Options> = {};
  if (savedOptionsString) {
    try {
      savedOptions = optionsSchema
        .partial()
        .parse(JSON.parse(savedOptionsString));
    } catch (e) {
      console.error("Invalid saved options", savedOptionsString);
    }
  }

  const [options, setOptions] = useState<Options>({
    ...defaultOptions,
    ...savedOptions,
  });

  useEffect(() => {
    toggleDarkMode(options.darkMode);
  }, [options.darkMode]);

  useEffect(() => {
    const prefersColorSchemeDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const toggleCallBack = () => {
      toggleDarkMode(options.darkMode);
    };

    prefersColorSchemeDark.addEventListener("change", toggleCallBack);

    return () => {
      prefersColorSchemeDark.removeEventListener("change", toggleCallBack);
    };
  }, []);

  return (
    <OptionsContext.Provider
      value={{
        options,
        setOptions: (newPartialOptions: Partial<Options>) => {
          setOptions((prevOptions) => {
            const fullOptions = { ...prevOptions, ...newPartialOptions };
            localStorage.setItem(OPTIONS_STORE, JSON.stringify(fullOptions));
            return fullOptions;
          });
        },
      }}
    >
      {children}
    </OptionsContext.Provider>
  );
};

export const useOptions = () => {
  return useContext(OptionsContext);
};

export default OptionsContextProvider;
