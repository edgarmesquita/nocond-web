import AppBreadcrumbs, { IRoute } from "./AppBreadcrumbs";
import AppContent from "./AppContent";
import AppLayout from "./AppLayout";
import AppModal from "./AppModal";
import AppTable from "./AppTable";
import CenteredPaper from "./CenteredPaper";
import DefaultHelmet from "./DefaultHelmet";
import ErrorSnackbar from "./ErrorSnackbar";
import AppSelect, { ISelectOption } from "./AppSelect";
import { useEffect, useRef } from "react";

export { AppBreadcrumbs, AppContent, AppLayout, AppModal, AppTable, AppSelect, CenteredPaper, DefaultHelmet, ErrorSnackbar };
export type { IRoute, ISelectOption };

export function usePrevious(value: any) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}