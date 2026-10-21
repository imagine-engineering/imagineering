import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upstream-derived reference | imagineering",
  description:
    "Attribution and publication scope for the upstream-derived Zed reference book.",
  alternates: { canonical: "/docs/reference/" },
};

export default function ReferencePage() {
  return (
    <>
      <h1>Upstream-derived reference book</h1>
      <p>
        The application repository contains the Zed-derived mdBook reference for
        editing, settings, keybindings, languages and upstream services.
        Attribution, technical action identifiers and service names are
        retained.
      </p>
      <p>
        A released documentation build mounts that complete book here. This
        local website preview describes its scope; the source book is built
        separately by the release pipeline. Refer to the Copper and Groovy
        product guides for verified product setup and status.
      </p>
      <p>
        References to Zed accounts, subscriptions, collaboration and hosted
        models describe upstream services. They do not establish Copper or
        Groovy availability or support.
      </p>
      <p>
        <a href="https://zed.dev/docs/">Read the upstream Zed documentation</a>{" "}
        · <a href="/docs/">Product guides</a> ·{" "}
        <a href="/support/">Help and support</a>
      </p>
    </>
  );
}
