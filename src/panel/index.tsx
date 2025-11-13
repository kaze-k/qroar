/* @refresh reload */
import { render } from "solid-js/web";
import { disableContextMenu } from "@/utils";
import App from "./App";
import "./index.css";
import "@/shared/styles";

disableContextMenu();

const root = document.getElementById("app");

render(() => <App />, root!);
