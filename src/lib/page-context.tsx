import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { type Page } from "./types";
import { Logger } from "./log";

const logger = new Logger("PageContext");

type ChatContextState = {
  page: Page;
  prevPage: Page;
  setPage: (page: Page) => void;
};

const initialState: ChatContextState = {
  page: "home",
  prevPage: "home",
  setPage: () => null,
};

const PageContext = createContext<PageContextState>(initialState);

export const usePageContext = () => useContext(PageContext);

export const PageProvider = ({ children }: { children: React.ReactNode }) => {
  const [page, _setPage] = useState("home");
  const [prevPage, setPrevPage] = useState("home");

  const setPage = useCallback(
    (nextPage: Page) => {
      setPrevPage(page);
      _setPage(nextPage);
    },
    [_setPage, page, setPrevPage],
  );

  const value = useMemo(
    () => ({
      page,
      prevPage,
      setPage,
    }),
    [page, setPage, prevPage],
  );

  logger.debug({ page, prevPage });

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
};
