import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Page } from "@/lib/types";
import { Logger } from "@/lib/log";

const logger = new Logger("PageContext");

type PageContextState = {
  page: Page;
  prevPage: Page;
  setPage: (page: Page) => void;
};

const initialState: PageContextState = {
  page: "home",
  prevPage: "home",
  setPage: () => null,
};

const PageContext = createContext<PageContextState>(initialState);

export const usePageContext = () => useContext(PageContext);

export const PageProvider = ({ children }: { children: React.ReactNode }) => {
  const [page, _setPage] = useState<Page>(Page.Home);
  const [prevPage, setPrevPage] = useState<Page>(Page.Home);

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

  useEffect(() => {
    logger.debug(value);
  }, [value]);

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
};
