import classNames from "classnames";
import { Footer } from "./Footer";
import "./Layout.css";
import Nav from "./Nav";

interface LayoutProps {
  showNav?: boolean;
  showFooter?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Layout(props: LayoutProps) {
  return (
    <div className="layout">
      {props.showNav && <Nav />}

      <main className={classNames("main-kodekamp", props.className)}>
        {props.children}
      </main>

      {props.showFooter && <Footer />}
    </div>
  );
}
