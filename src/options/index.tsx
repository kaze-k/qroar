/* @refresh reload */
import { render } from "solid-js/web";
import { locale } from "@/constants";
import { disableContextMenu, i18n, setDocumentTitle } from "@/utils";
import App from "./App";
import "./index.css";
import "@/shared/styles";

setDocumentTitle(i18n(locale.title.SETUP));
disableContextMenu();

const root = document.getElementById("app");

render(() => <App />, root!);
